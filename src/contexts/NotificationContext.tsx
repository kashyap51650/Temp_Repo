import { createContext, type ReactNode, useContext, useReducer } from "react";

import {
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  mockNotifications,
} from "@/data/notifications";
import type { Notification } from "@/types/notification";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isDrawerOpen: boolean;
}

type NotificationAction =
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_AS_READ" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | {
      type: "ADD_NOTIFICATION";
      payload: Omit<Notification, "id" | "createdAt">;
    }
  | { type: "LOAD_NOTIFICATIONS"; payload: Notification[] };

interface NotificationContextType extends NotificationState {
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const initialState: NotificationState = {
  notifications: mockNotifications,
  unreadCount: getUnreadCount(mockNotifications),
  isDrawerOpen: false,
};

function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case "MARK_AS_READ": {
      const updatedNotifications = markNotificationAsRead(
        state.notifications,
        action.payload
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: getUnreadCount(updatedNotifications),
      };
    }
    case "MARK_ALL_AS_READ": {
      const updatedNotifications = markAllNotificationsAsRead(
        state.notifications
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: 0,
      };
    }
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
    case "ADD_NOTIFICATION": {
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      const updatedNotifications = [newNotification, ...state.notifications];
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: getUnreadCount(updatedNotifications),
      };
    }
    case "LOAD_NOTIFICATIONS": {
      return {
        ...state,
        notifications: action.payload,
        unreadCount: getUnreadCount(action.payload),
      };
    }
    default:
      return state;
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const markAsRead = (id: string) => {
    dispatch({ type: "MARK_AS_READ", payload: id });
  };

  const markAllAsRead = () => {
    dispatch({ type: "MARK_ALL_AS_READ" });
  };

  const openDrawer = () => {
    dispatch({ type: "OPEN_DRAWER" });
  };

  const closeDrawer = () => {
    dispatch({ type: "CLOSE_DRAWER" });
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "createdAt">
  ) => {
    dispatch({ type: "ADD_NOTIFICATION", payload: notification });
  };

  const value: NotificationContextType = {
    ...state,
    markAsRead,
    markAllAsRead,
    openDrawer,
    closeDrawer,
    addNotification,
  };

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
