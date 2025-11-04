import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { API_CONFIG, apiClient } from "@/lib/api";
import type {
  LoginApiResponse,
  LoginCredentials,
  LoginResponse,
  User,
} from "@/types/auth";

// Query keys for TanStack Query
export const AUTH_QUERY_KEYS = {
  auth: ["auth"] as const,
  user: ["auth", "user"] as const,
};

// Authentication API functions
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const apiResponse = await apiClient.post<LoginApiResponse>(
      API_CONFIG.ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    // Transform the API response to our internal format
    return {
      access_token: apiResponse.data.token.access_token,
      refresh_token: apiResponse.data.token.refresh_token,
      token_type: apiResponse.data.token.token_type,
      user: apiResponse.data.user,
      must_change_password: apiResponse.data.must_change_password,
    };
  },

  getCurrentUser: async (): Promise<User> => {
    // This would be implemented when you have a get current user endpoint
    // For now, we'll return cached user data
    throw new Error("Get current user endpoint not implemented yet");
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      //Replace that by sentry logging in future
      console.warn("Logout API call failed:", error);
    } finally {
      tokenUtils.removeTokens();
    }
  },

  changePassword: async (data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }): Promise<void> => {
    await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },

  resetPassword: async (data: {
    reset_token: string;
    new_password: string;
    confirm_password: string;
  }): Promise<{ message: string }> => {
    return await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, data);
  },
};

// React Query hooks for authentication
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: LoginResponse) => {
      // Store tokens in sessionStorage
      sessionStorage.setItem("access_token", data.access_token);
      sessionStorage.setItem("refresh_token", data.refresh_token);

      // Cache auth data in TanStack Query
      queryClient.setQueryData(AUTH_QUERY_KEYS.auth, data);
      queryClient.setQueryData(AUTH_QUERY_KEYS.user, data.user);

      // Show success toast
      toast.success("Login successful!", {
        description: `Welcome back, ${data.user.full_name || data.user.username}!`,
      });
    },
    onError: (error: Error) => {
      // Show error toast
      toast.error("Login failed", {
        description:
          error.message || "Please check your credentials and try again.",
      });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.auth });
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.user });
      queryClient.clear();
      toast.success("Logged out successfully");
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully", {
        description: "Your password has been updated.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to change password", {
        description: error.message || "Please try again.",
      });
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (response) => {
      toast.success("Password reset successfully", {
        description: response.message || "Your password has been reset.",
      });
    },
    onError: (error: Error) => {
      toast.error("Failed to reset password", {
        description: error.message || "Please try again.",
      });
    },
  });
};

// Hook to get current authentication state
export const useAuth = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.auth,
    queryFn: () => {
      const token = tokenUtils.getAccessToken();
      if (!token || tokenUtils.isTokenExpired(token)) {
        throw new Error("No valid token");
      }

      // Return cached auth data or null if not authenticated
      return null;
    },
    enabled: !!tokenUtils.getAccessToken(),
    staleTime: Infinity, // Auth data doesn't get stale
    retry: false,
  });
};

// Hook to get current user data
export const useCurrentUser = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.user,
    queryFn: authApi.getCurrentUser,
    enabled:
      !!tokenUtils.getAccessToken() &&
      !tokenUtils.isTokenExpired(tokenUtils.getAccessToken()!),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
};

// Helper hook to check if user is authenticated
export const useIsAuthenticated = () => {
  const token = tokenUtils.getAccessToken();
  return !!token && !tokenUtils.isTokenExpired(token);
};

// Utility functions for token management
export const tokenUtils = {
  getAccessToken: (): string | null => {
    return sessionStorage.getItem("access_token");
  },

  getRefreshToken: (): string | null => {
    return sessionStorage.getItem("refresh_token");
  },

  removeTokens: (): void => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },
};
