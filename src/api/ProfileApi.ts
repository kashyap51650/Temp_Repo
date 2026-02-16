import { API_CONFIG, apiClient } from "@/lib";
import type {
  UpdateUserNotificationSettingPayload,
  UpdateUserNotificationSettingResponse,
  UserNotificationSettingResponse,
} from "@/types/profile";

export const profileApi = {
  getUserNotificationSetting: async () => {
    return apiClient.get<UserNotificationSettingResponse>(
      API_CONFIG.ENDPOINTS.USER_NOTIFICATION_SETTINGS
        .GET_USER_NOTIFICATION_SETTINGS
    );
  },

  updateUserNotificationSetting: async (
    payload: UpdateUserNotificationSettingPayload
  ) => {
    return apiClient.post<UpdateUserNotificationSettingResponse>(
      API_CONFIG.ENDPOINTS.USER_NOTIFICATION_SETTINGS
        .UPDATE_USER_NOTIFICATION_SETTINGS,
      payload
    );
  },
};
