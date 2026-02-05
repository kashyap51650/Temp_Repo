import { io, Socket } from "socket.io-client";

import {
  SESSION_STORAGE_KEYS,
  SOCKET_CONFIG,
  SOCKET_EVENTS,
} from "./constants";

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
    console.error("❌ Socket connection error:", error);
    isConnecting = false;
  });

  // Reconnection failed
  socketInstance.on(SOCKET_EVENTS.RECONNECT_FAILED, () => {
    console.error("❌ Reconnection failed after max attempts");
    isConnecting = false;
  });

  // General error
  socketInstance.on(SOCKET_EVENTS.ERROR, (error) => {
    console.error("❌ Socket error:", error);
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
    console.error("❌ No authentication token found. Cannot connect socket.");
    return;
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  if (!socketUrl || socketUrl.trim() === "") {
    console.error(
      "❌ VITE_SOCKET_URL is not configured or is empty in environment"
    );
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
    console.error("❌ Failed to initialize socket:", error);
    isConnecting = false;
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
    console.error("Error during socket disconnection:", error);
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
    console.error(
      `❌ Cannot subscribe to event "${event}" - socket not initialized`
    );
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
    console.error(
      `❌ Cannot subscribe to event "${event}" - socket not initialized`
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
    console.error(
      `❌ Cannot subscribe to event "${event}" - socket not initialized`
    );
    return;
  }

  if (!socket.connected) {
    console.error(`❌ Cannot emit event "${event}" - socket not connected`);
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
