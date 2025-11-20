export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface ApiNotification {
  id: number;
  subject: string;
  message: string;
  notification_types: string[];
  is_read: boolean;
  is_delivered: boolean;
  created_at: string;
  read_at: string | null;
  delivered_at: string;
}

export interface NotificationApiResponse {
  success: boolean;
  message: string;
  data: {
    items: ApiNotification[];
    pagination: {
      page: number;
      size: number;
      total: number;
      pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}
