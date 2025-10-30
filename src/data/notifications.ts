import type { Notification } from "@/types/notification";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Data Upload Completed",
    message:
      "PROT-001-Biodistribution data has been uploaded successfully and is ready for validation.",
    type: "success",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
  },
  {
    id: "2",
    title: "Validation Required",
    message:
      "PROT-002-Biodistribution requires validation review. Please check the uploaded data for any discrepancies.",
    type: "warning",
    isRead: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: "3",
    title: "System Maintenance",
    message:
      "Scheduled maintenance on Sunday 3:00 AM - 5:00 AM. The system will be temporarily unavailable during this time.",
    type: "info",
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    readAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Read 2 hours ago
  },
  {
    id: "4",
    title: "New User Registered",
    message:
      "Sarah Johnson has been added to the Data Uploader role and can now access the data upload functionality.",
    type: "info",
    isRead: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "5",
    title: "File Processing Error",
    message:
      "There was an error processing the Hematology data file for PROT-003. Please check the file format and try again.",
    type: "error",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
];

export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter((n) => !n.isRead).length;
};

export const markNotificationAsRead = (
  notifications: Notification[],
  notificationId: string
): Notification[] => {
  return notifications.map((notification) =>
    notification.id === notificationId
      ? {
          ...notification,
          isRead: true,
          readAt: new Date(),
        }
      : notification
  );
};

export const markAllNotificationsAsRead = (
  notifications: Notification[]
): Notification[] => {
  const now = new Date();
  return notifications.map((notification) =>
    notification.isRead
      ? notification
      : {
          ...notification,
          isRead: true,
          readAt: now,
        }
  );
};
