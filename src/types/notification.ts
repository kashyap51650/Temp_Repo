export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}
