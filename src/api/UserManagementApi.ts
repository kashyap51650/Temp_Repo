import { API_CONFIG, apiClient, type ApiResponse } from "@/lib/api";

import type { UserFilters, UsersResponse } from "../types/auth";

export const userApi = {
  getUsers: async (filters?: UserFilters): Promise<UsersResponse> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.role_ids) params.append("role_ids", filters.role_ids);
    if (filters?.statuses) params.append("statuses", filters.statuses);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.size) params.append("size", filters.size.toString());

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_CONFIG.ENDPOINTS.USERS.LIST}?${queryString}`
      : API_CONFIG.ENDPOINTS.USERS.LIST;

    return apiClient.get<UsersResponse>(endpoint);
  },

  createUser: async (userData: {
    email: string;
    first_name: string;
    last_name: string;
    role_id: number;
    account_expiry_date?: string | null;
  }): Promise<ApiResponse> => {
    const payload = {
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      role_id: userData.role_id,
      ...(userData.account_expiry_date && {
        account_expiry_date: userData.account_expiry_date,
      }),
    };

    return apiClient.post<ApiResponse>(
      API_CONFIG.ENDPOINTS.USERS.CREATE,
      payload
    );
  },

  updateUser: async (
    userId: string,
    userData: {
      email: string;
      first_name: string;
      last_name: string;
      role_id: number;
      account_expiry_date?: string | null;
      status: string;
    }
  ): Promise<ApiResponse> => {
    const payload = {
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      role_id: userData.role_id,
      status: userData.status,
      must_change_password: false,
      ...(userData.account_expiry_date && {
        account_expiry_date: userData.account_expiry_date,
      }),
    };

    return apiClient.put<ApiResponse>(
      API_CONFIG.ENDPOINTS.USERS.UPDATE(userId),
      payload
    );
  },

  updateUserStatus: async (
    userId: string,
    status: "active" | "inactive"
  ): Promise<ApiResponse> => {
    return apiClient.put<ApiResponse>(
      API_CONFIG.ENDPOINTS.USERS.STATUS(userId),
      { status }
    );
  },
};
