import { API_CONFIG, apiClient, type ApiResponse } from "@/lib/api";

export const authApi = {
  getProfile: async (): Promise<{
    success: boolean;
    message: string;
    data: {
      id: number;
      email: string;
      username: string;
      first_name: string;
      last_name: string;
      full_name: string;
      profile_picture: string;
      status: string;
      is_email_verified: boolean;
      last_login_at: string;
      must_change_password: boolean;
      roles: unknown[];
    };
  }> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
  },

  updateProfile: async (profileData: {
    first_name: string;
    last_name: string;
    profile_picture?: File;
  }): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append("first_name", profileData.first_name);
    formData.append("last_name", profileData.last_name);

    if (profileData.profile_picture) {
      formData.append("profile_picture", profileData.profile_picture);
    }

    return apiClient.putFormData<ApiResponse>(
      API_CONFIG.ENDPOINTS.AUTH.PROFILE,
      formData
    );
  },
};
