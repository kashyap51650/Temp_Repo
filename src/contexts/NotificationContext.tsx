import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

import {
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  mockNotifications,
  transformApiNotification,
} from "@/data/notifications";
import { useAuthState } from "@/hooks";
import { notificationApi } from "@/lib/api";
import type { Notification } from "@/types/notification";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isDrawerOpen: boolean;
  isLoading: boolean;
  error: string | null;
  apiUnreadCount: number;
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
  | { type: "LOAD_NOTIFICATIONS"; payload: Notification[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_API_UNREAD_COUNT"; payload: number };

interface NotificationContextType extends NotificationState {
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  openDrawer: () => void;
  closeDrawer: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt">
  ) => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isDrawerOpen: false,
  isLoading: false,
  error: null,
  apiUnreadCount: 0,
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
        error: null,
      };
    }
    case "SET_LOADING": {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    case "SET_ERROR": {
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    }
    case "SET_API_UNREAD_COUNT": {
      return {
        ...state,
        apiUnreadCount: action.payload,
      };
    }
    default:
      return state;
  }
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { isAuthenticated } = useAuthState();
  const fetchCountIntervalRef = useRef<number | undefined>(undefined);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const response = await notificationApi.getMyNotifications(1, 50); // Get more notifications initially

      if (response.success && response.data.items) {
        const transformedNotifications = response.data.items.map(
          transformApiNotification
        );
        dispatch({
          type: "LOAD_NOTIFICATIONS",
          payload: transformedNotifications,
        });
      } else {
        dispatch({ type: "LOAD_NOTIFICATIONS", payload: mockNotifications });
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load notifications" });
      dispatch({ type: "LOAD_NOTIFICATIONS", payload: mockNotifications });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const response = await notificationApi.getUnreadCount();
      if (response.success && response.data) {
        dispatch({
          type: "SET_API_UNREAD_COUNT",
          payload: response.data.unread_count,
        });
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
      dispatch({ type: "SET_API_UNREAD_COUNT", payload: state.unreadCount });
    }
  }, [isAuthenticated, state.unreadCount]);

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        const response = await notificationApi.markNotificationAsRead(id);

        if (response.success) {
          dispatch({ type: "MARK_AS_READ", payload: id });

          await Promise.all([fetchNotifications(), fetchUnreadCount()]);
        }
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
        dispatch({ type: "MARK_AS_READ", payload: id });
      }
    },
    [fetchNotifications, fetchUnreadCount]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await notificationApi.markAllNotificationsAsRead();

      if (response.success) {
        dispatch({ type: "MARK_ALL_AS_READ" });

        await Promise.all([fetchNotifications(), fetchUnreadCount()]);
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      dispatch({ type: "MARK_ALL_AS_READ" });
    }
  }, [fetchNotifications, fetchUnreadCount]);

  const openDrawer = useCallback(() => {
    dispatch({ type: "OPEN_DRAWER" });
  }, []);

  const closeDrawer = useCallback(() => {
    dispatch({ type: "CLOSE_DRAWER" });
  }, []);

  const refreshNotifications = useCallback(async () => {
    await Promise.all([fetchNotifications(), fetchUnreadCount()]);
  }, [fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [isAuthenticated, fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    if (fetchCountIntervalRef.current) {
      clearInterval(fetchCountIntervalRef.current);
    }

    if (isAuthenticated) {
      fetchCountIntervalRef.current = setInterval(() => {
        fetchUnreadCount();
      }, 30000);
    }

    return () => {
      if (fetchCountIntervalRef.current) {
        clearInterval(fetchCountIntervalRef.current);
      }
    };
  }, [isAuthenticated, fetchUnreadCount]);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "createdAt">) => {
      dispatch({ type: "ADD_NOTIFICATION", payload: notification });
    },
    []
  );

  const value: NotificationContextType = useMemo(
    () => ({
      ...state,
      markAsRead,
      markAllAsRead,
      openDrawer,
      closeDrawer,
      addNotification,
      refreshNotifications,
    }),
    [
      state,
      markAsRead,
      markAllAsRead,
      openDrawer,
      closeDrawer,
      addNotification,
      refreshNotifications,
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
