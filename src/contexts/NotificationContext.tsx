import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";

import { useAuthState } from "@/hooks";
import { useNotificationData } from "@/hooks/useNotificationData";
import type { Notification } from "@/types/notification";

interface NotificationState {
  isDrawerOpen: boolean;
}

type NotificationAction = { type: "OPEN_DRAWER" } | { type: "CLOSE_DRAWER" };

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isDrawerOpen: boolean;
  isLoading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const initialState: NotificationState = {
  isDrawerOpen: false,
};

function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case "OPEN_DRAWER":
      return {
        ...state,
        isDrawerOpen: true,
      };
    case "CLOSE_DRAWER":
      return {
        ...state,
        isDrawerOpen: false,
      };
    default:
      return state;
  }
}

export function NotificationProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { isAuthenticated } = useAuthState();

  // Use the custom hook for all notification data and operations
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
  } = useNotificationData(isAuthenticated);

  const openDrawer = useCallback(() => {
    dispatch({ type: "OPEN_DRAWER" });
  }, []);

  const closeDrawer = useCallback(() => {
    dispatch({ type: "CLOSE_DRAWER" });
  }, []);

  const value: NotificationContextType = useMemo(
    () => ({
      notifications,
      unreadCount,
      isDrawerOpen: state.isDrawerOpen,
      isLoading,
      error,
      markAsRead,
      markAllAsRead,
      openDrawer,
      closeDrawer,
    }),
    [
      notifications,
      unreadCount,
      state.isDrawerOpen,
      isLoading,
      error,
      markAsRead,
      markAllAsRead,
      openDrawer,
      closeDrawer,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
