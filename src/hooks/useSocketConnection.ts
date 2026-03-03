import { useCallback, useEffect, useRef } from "react";

import { useSocketContext } from "@/contexts/SocketProvider";
import {
  reconnectSocket,
  socketEmit,
  socketEmitWithAck,
  socketOff,
  socketOn,
} from "@/lib/socket-client";

/**
 * Hook to access socket functionality with React integration
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isConnected, emit, on, off } = useSocket();
 *
 *   useEffect(() => {
 *     const handleNotification = (data) => {
 *       // handle notification data
 *       void data;
 *     };
 *
 *     on('notification', handleNotification);
 *     return () => off('notification', handleNotification);
 *   }, [on, off]);
 *
 *   return <div>Connected: {isConnected ? 'Yes' : 'No'}</div>;
 * }
 * ```
 */
export function useSocket() {
  const { isConnected } = useSocketContext();

  // Memoized socket functions
  const on = useCallback(socketOn, []);
  const off = useCallback(socketOff, []);
  const emit = useCallback(socketEmit, []);
  const emitWithAck = useCallback(socketEmitWithAck, []);
  const reconnect = useCallback(reconnectSocket, []);

  return {
    isConnected,
    on,
    off,
    emit,
    emitWithAck,
    reconnect,
  };
}

/**
 * Hook to automatically subscribe to a socket event
 * Handles subscription and cleanup automatically
 * Automatically re-subscribes when socket reconnects
 *
 * Uses a ref to store the latest handler, so you don't need to memoize
 * the handler function with useCallback. The subscription remains stable
 * even if the handler changes.
 *
 * @param event - Event name to listen to
 * @param handler - Callback function for the event (doesn't need to be memoized)
 *
 * @example
 * ```tsx
 * function NotificationBell() {
 *   const [count, setCount] = useState(0);
 *
 *   // ✅ No need for useCallback - handler can be inline
 *   useSocketEvent('notification', (data) => {
 *     setCount(prev => prev + 1);
 *     toast.info(data.message);
 *   });
 *
 *   return <Badge>{count}</Badge>;
 * }
 * ```
 */
export function useSocketEvent(
  event: string,
  handler: (...args: unknown[]) => void
): void {
  const { isConnected } = useSocketContext();
  const handlerRef = useRef(handler);

  // Update ref when handler changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    // Stable callback that always calls the latest handler
    const stableHandler = (...args: unknown[]) => {
      handlerRef.current(...args);
    };

    socketOn(event, stableHandler);

    return () => {
      socketOff(event, stableHandler);
    };
  }, [event, isConnected]);
}
