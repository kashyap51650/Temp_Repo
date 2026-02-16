import type { ApiResponse } from "@/lib";

export interface UserNotificationSettingData {
  id: number;
  user_id: number;
  validate_notification: boolean;
  created_at: string;
  updated_at: string;
}

export type UserNotificationSettingResponse =
  ApiResponse<UserNotificationSettingData>;

export interface UpdateUserNotificationSettingPayload {
  validate_notification: boolean;
}

export type UpdateUserNotificationSettingResponse =
  ApiResponse<UserNotificationSettingData>;
