import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  mockNotifications,
  transformApiNotification,
} from "@/data/notifications";
import { useSocketEvent } from "@/hooks";
import { notificationApi } from "@/lib/api";
import { REACT_QUERY_CONFIG, SOCKET_EVENTS } from "@/lib/constants";
import queryClient from "@/lib/queryClient";

/**
 * Custom hook for managing notification data with TanStack Query
 * Handles fetching, caching, and mutations for notifications
 */
export function useNotificationData(isAuthenticated: boolean) {
  // Fetch notifications list
  const {
    data: notifications = [],
    isLoading: isLoadingNotifications,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await notificationApi.getMyNotifications(1, 50);
      if (response.success && response.data.items) {
        return response.data.items.map(transformApiNotification);
      }
      return mockNotifications;
    },
    enabled: isAuthenticated,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.VERY_SHORT,
    refetchOnWindowFocus: true,
  });

  // Fetch unread count
  const {
    data: unreadCount = 0,
    isLoading: isLoadingUnreadCount,
    error: unreadCountError,
    refetch: refetchUnreadCount,
  } = useQuery({
    queryKey: ["notifications", "unreadCount"],
    queryFn: async () => {
      const response = await notificationApi.getUnreadCount();
      if (response.success && response.data) {
        return response.data.unread_count;
      }
      return 0;
    },
    enabled: isAuthenticated,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.VERY_SHORT,
    refetchOnWindowFocus: true,
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markNotificationAsRead(id),
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unreadCount"],
      });
    },
    onError: (error) => {
      console.error("Failed to mark notification as read:", error);
    },
  });

  // Mark all notifications as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllNotificationsAsRead(),
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: ["notifications", "unreadCount"],
      });
    },
    onError: (error) => {
      console.error("Failed to mark all notifications as read:", error);
    },
  });

  // Wrapper functions for easier use
  const markAsRead = useCallback(
    async (id: string) => {
      await markAsReadMutation.mutateAsync(id);
    },
    [markAsReadMutation]
  );

  const markAllAsRead = useCallback(async () => {
    await markAllAsReadMutation.mutateAsync();
  }, [markAllAsReadMutation]);

  // Handle socket notifications - invalidate queries to trigger automatic refetch
  const handleSocketNotification = useCallback(() => {
    // TanStack Query will automatically refetch after invalidation
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({
      queryKey: ["notifications", "unreadCount"],
    });
  }, []);

  useSocketEvent(SOCKET_EVENTS.NOTIFICATION_NEW, handleSocketNotification);

  return {
    // Data
    notifications,
    unreadCount,

    // Loading states
    isLoading: isLoadingNotifications || isLoadingUnreadCount,
    isLoadingNotifications,
    isLoadingUnreadCount,

    // Errors
    error: notificationsError?.message || unreadCountError?.message || null,
    notificationsError,
    unreadCountError,

    // Mutation states
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,

    // Actions
    markAsRead,
    markAllAsRead,
    refetchNotifications,
    refetchUnreadCount,
  };
}
