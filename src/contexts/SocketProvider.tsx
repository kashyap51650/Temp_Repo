import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuthState } from "@/hooks";
import { SOCKET_EVENTS } from "@/lib/constants";
import {
  connectSocket,
  disconnectSocket,
  isSocketConnected,
  socketOff,
  socketOn,
} from "@/lib/socket-client";

interface SocketContextType {
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

/**
 * SocketProvider Component
 *
 * Manages WebSocket connection lifecycle for the entire application.
 * Automatically connects when authenticated and disconnects on unmount.
 *
 * Features:
 * - Connects only when auth token is present
 * - Automatic reconnection on disconnect
 * - Clean connection/disconnection lifecycle
 * - Provides reactive connection status to child components via Context
 */
export function SocketProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { isAuthenticated, token } = useAuthState();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsConnected(false);
      return;
    }

    // Update connection status
    const updateConnectionStatus = () => {
      setIsConnected(isSocketConnected());
    };

    // Connect socket
    connectSocket();

    // Set up connection status listeners
    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    // Listen for connection events
    socketOn(SOCKET_EVENTS.CONNECT, handleConnect);
    socketOn(SOCKET_EVENTS.DISCONNECT, handleDisconnect);

    // Initial status check
    updateConnectionStatus();

    return () => {
      socketOff(SOCKET_EVENTS.CONNECT, handleConnect);
      socketOff(SOCKET_EVENTS.DISCONNECT, handleDisconnect);
      disconnectSocket();
      setIsConnected(false);
    };
  }, [isAuthenticated, token]);

  const contextValue = useMemo(
    () => ({
      isConnected,
    }),
    [isConnected]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}

/**
 * Hook to access socket connection status from Context
 */
export function useSocketContext() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
}
