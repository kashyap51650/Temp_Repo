import { z } from "zod";

export const createNotificationSchema = z.object({
  subject: z.string().trim().min(1, "Please enter a notification subject"),
  message: z.string().trim().min(1, "Please enter a notification message"),
  selectedRoleIds: z
    .array(z.number())
    .min(1, "Please select at least one role"),
  notificationTypes: z
    .array(z.string())
    .min(1, "Please select at least one notification type"),
});

export type NotificationDataType = z.infer<typeof createNotificationSchema>;
