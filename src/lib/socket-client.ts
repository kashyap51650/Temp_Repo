import { io, Socket } from "socket.io-client";

import {
  SESSION_STORAGE_KEYS,
  SOCKET_CONFIG,
  SOCKET_EVENTS,
} from "./constants";
import { logError } from "./sentry-logger";

/**
 * Singleton socket instance - shared across the app
 */
let socket: Socket | null = null;
let isConnecting = false;

/**
 * Check if socket is connected
 */
export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}

/**
 * Setup socket event handlers
 */
function setupSocketEventHandlers(socketInstance: Socket): void {
  // Connection successful - reset connecting flag
  socketInstance.once(SOCKET_EVENTS.CONNECT, () => {
    isConnecting = false;
  });

  // Connection error - reset connecting flag
  socketInstance.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
    isConnecting = false;
    logError(error instanceof Error ? error : new Error(String(error)), {
      level: "error",
      tags: { error_type: "socket_connection_error" },
      context: {
        socket: {
          event: "connect_error",
          errorMessage: String(error),
        },
      },
    });
  });

  // Reconnection failed
  socketInstance.on(SOCKET_EVENTS.RECONNECT_FAILED, () => {
    isConnecting = false;
    logError("Socket reconnection failed after max attempts", {
      tags: { error_type: "socket_reconnection_failed" },
      context: {
        socket: {
          event: "reconnect_failed",
          maxAttempts: SOCKET_CONFIG.reconnectionAttempts,
        },
      },
    });
  });

  // General error
  socketInstance.on(SOCKET_EVENTS.ERROR, (error) => {
    logError(error instanceof Error ? error : new Error(String(error)), {
      level: "error",
      tags: { error_type: "socket_error" },
      context: {
        socket: {
          event: "error",
          errorMessage: String(error),
        },
      },
    });
  });
}

/**
 * Connect to socket server
 */
export function connectSocket(): void {
  // Prevent multiple connection attempts
  if (socket?.connected) {
    return;
  }

  if (isConnecting) {
    return;
  }

  // If socket exists but is disconnected, dispose it so we can recreate with a fresh token
  if (socket && !socket.connected) {
    socket.disconnect();
    socket = null;
    return;
  }

  // Get token and URL
  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.ACCESS_TOKEN);

  if (!token) {
    logError("Cannot connect socket - no authentication token found", {
      tags: { error_type: "socket_auth_missing" },
      context: { socket: { action: "connect_attempt" } },
    });
    return;
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  if (!socketUrl || socketUrl.trim() === "") {
    logError(new Error("Socket URL not configured"), {
      level: "error",
      tags: { error_type: "socket_config_missing" },
      context: {
        socket: {
          action: "connect_attempt",
          issue: "VITE_SOCKET_URL not configured",
        },
      },
    });
    return;
  }

  try {
    isConnecting = true;

    socket = io(socketUrl, {
      query: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: SOCKET_CONFIG.reconnectionAttempts,
      reconnectionDelay: SOCKET_CONFIG.reconnectionDelay,
      reconnectionDelayMax: SOCKET_CONFIG.reconnectionDelayMax,
      timeout: SOCKET_CONFIG.timeout,
      autoConnect: false,
    });

    setupSocketEventHandlers(socket);
    socket.connect();
  } catch (error) {
    isConnecting = false;
    logError(error instanceof Error ? error : new Error(String(error)), {
      level: "error",
      tags: { error_type: "socket_initialization_failed" },
      context: {
        socket: {
          action: "initialize",
          errorMessage: String(error),
        },
      },
    });
  }
}

/**
 * Disconnect socket
 */
export function disconnectSocket(): void {
  if (!socket) return;

  try {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    isConnecting = false;
  } catch (error) {
    logError(error instanceof Error ? error : new Error(String(error)), {
      level: "warning",
      tags: { error_type: "socket_disconnection_error" },
      context: {
        socket: {
          action: "disconnect",
          errorMessage: String(error),
        },
      },
    });
  }
}

/**
 * Listen to a socket event
 */
export function socketOn(
  event: string,
  callback: (...args: unknown[]) => void
): void {
  if (!socket) {
    logError(`Cannot subscribe to event "${event}" - socket not initialized`, {
      tags: { error_type: "socket_not_initialized" },
      context: { socket: { action: "subscribe", event } },
    });
    return;
  }
  socket.on(event, callback);
}

/**
 * Remove socket event listener
 */
export function socketOff(
  event: string,
  callback?: (...args: unknown[]) => void
): void {
  if (!socket) {
    logError(
      `Cannot unsubscribe from event "${event}" - socket not initialized`,
      {
        tags: { error_type: "socket_not_initialized" },
        context: { socket: { action: "unsubscribe", event } },
      }
    );
    return;
  }

  if (callback) {
    socket.off(event, callback);
  } else {
    socket.off(event);
  }
}

/**
 * Emit event to server
 */
export function socketEmit(event: string, ...args: unknown[]): void {
  if (!socket) {
    logError(`Cannot emit event "${event}" - socket not initialized`, {
      tags: { error_type: "socket_not_initialized" },
      context: { socket: { action: "emit", event } },
    });
    return;
  }

  if (!socket.connected) {
    logError(`Cannot emit event "${event}" - socket not connected`, {
      tags: { error_type: "socket_not_connected" },
      context: { socket: { action: "emit", event } },
    });
    return;
  }

  socket.emit(event, ...args);
}

/**
 * Emit event with acknowledgment
 */
export function socketEmitWithAck<T = unknown>(
  event: string,
  data: unknown,
  timeout = 5000
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!socket?.connected) {
      reject(new Error("Socket not connected"));
      return;
    }

    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for "${event}" acknowledgment`));
    }, timeout);

    socket.emit(event, data, (response: T) => {
      clearTimeout(timer);
      resolve(response);
    });
  });
}

/**
 * Manually reconnect socket with fresh token
 */
export function reconnectSocket(): void {
  disconnectSocket();
  setTimeout(() => {
    connectSocket();
  }, 500);
}
