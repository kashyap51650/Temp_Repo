import { API_CONFIG, apiClient, type ApiResponse } from "@/lib/api";

export const notificationApi = {
  createNotification: async (payload: {
    subject: string;
    message: string;
    notification_types: string[];
    recipient_role_ids: number[];
  }): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.CREATE,
      payload
    );
  },

  getNotifications: async (
    page: number = 1,
    size: number = 10,
    search?: string
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      items: Array<{
        id: number;
        title: string;
        sent_to: string[];
        sent_by: string;
        date: string;
        type: string[];
        recipients: number;
        status: string;
      }>;
      pagination: {
        page: number;
        size: number;
        total: number;
        pages: number;
        has_next: boolean;
        has_prev: boolean;
      };
    };
  }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const endpoint = `${API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST}?${params.toString()}`;
    return apiClient.get(endpoint);
  },

  getNotificationTemplates: async (
    page: number = 1,
    size: number = 10
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      items: Array<{
        id: number;
        template_name: string;
        template_subject: string;
        template_content: string;
        is_active: boolean;
        created_at: string;
        creator: {
          id: number;
          first_name: string;
          last_name: string;
          email: string;
        };
      }>;
      pagination: {
        page: number;
        size: number;
        total: number;
        pages: number;
        has_next: boolean;
        has_prev: boolean;
      };
    };
  }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.NOTIFICATIONS.TEMPLATES}?${params.toString()}`;
    return apiClient.get(endpoint);
  },

  createNotificationTemplate: async (payload: {
    template_name: string;
    template_subject: string;
    template_content: string;
  }): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.TEMPLATES,
      payload
    );
  },

  updateNotificationTemplate: async (
    templateId: string,
    payload: {
      template_name: string;
      template_subject: string;
      template_content: string;
    }
  ): Promise<ApiResponse> => {
    return apiClient.put<ApiResponse>(
      `${API_CONFIG.ENDPOINTS.NOTIFICATIONS.TEMPLATES}/${templateId}`,
      payload
    );
  },

  getNotificationTemplatesDropdown: async (): Promise<{
    success: boolean;
    message: string;
    data: Array<{
      id: number;
      template_name: string;
      template_subject: string;
      template_content: string;
    }>;
  }> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.TEMPLATES_DROPDOWN);
  },

  getMyNotifications: async (
    page: number = 1,
    size: number = 10
  ): Promise<import("../types/notification").NotificationApiResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.NOTIFICATIONS.MY_NOTIFICATIONS}?${params.toString()}`;
    return apiClient.get<
      import("../types/notification").NotificationApiResponse
    >(endpoint);
  },

  getUnreadCount: async (): Promise<{
    success: boolean;
    message: string;
    data: {
      unread_count: number;
    };
  }> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  },

  markNotificationAsRead: async (
    notificationId: string
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    return apiClient.patch(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId),
      {
        notification_id: notificationId,
      }
    );
  },

  markAllNotificationsAsRead: async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    return apiClient.patch(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  },
};
