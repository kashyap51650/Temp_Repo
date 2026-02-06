import { API_CONFIG, apiClient, type ApiResponse } from "@/lib/api";
import type { MyPermissionResponse } from "@/types/permissions";

export const roleApi = {
  getRoles: async (
    page: number = 1,
    size: number = 10
  ): Promise<import("../types/auth").RolesResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.RBAC.ROLES}?${params.toString()}`;
    return apiClient.get<import("../types/auth").RolesResponse>(endpoint);
  },

  getRolesDropdown: async (): Promise<{
    success: boolean;
    message: string;
    data: Array<{ id: number; name: string }>;
  }> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.RBAC.ROLES_DROPDOWN);
  },

  createRole: async (payload: {
    name: string;
    description: string;
  }): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(
      API_CONFIG.ENDPOINTS.RBAC.ROLES,
      payload
    );
  },

  updateRole: async (
    roleId: string,
    payload: {
      name: string;
      description: string;
    }
  ): Promise<ApiResponse> => {
    return apiClient.put<ApiResponse>(
      `${API_CONFIG.ENDPOINTS.RBAC.ROLES}/${roleId}`,
      payload
    );
  },

  getPermissions: async (
    roleId: string
  ): Promise<import("../types/auth").PermissionsApiResponse> => {
    return apiClient.get<import("../types/auth").PermissionsApiResponse>(
      `${API_CONFIG.ENDPOINTS.RBAC.ROLES}/${roleId}/permissions`
    );
  },

  assignUserRole: async (payload: {
    role_id: number;
    user_id: number;
  }): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(
      API_CONFIG.ENDPOINTS.RBAC.USER_ROLES,
      payload
    );
  },

  getUsersWithRoles: async (
    page: number = 1,
    size: number = 10
  ): Promise<import("../types/auth").UsersWithRolesResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.RBAC.USERS_WITH_ROLES}?${params.toString()}`;
    return apiClient.get<import("../types/auth").UsersWithRolesResponse>(
      endpoint
    );
  },

  updatePermissions: async (
    roleId: string,
    payload: {
      permission_ids: number[];
    }
  ): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(
      `${API_CONFIG.ENDPOINTS.RBAC.ROLES}/${roleId}/permissions`,
      payload
    );
  },
};

export const permissionsApi = {
  getMyPermissions: async () => {
    const response = await apiClient.get<MyPermissionResponse>(
      API_CONFIG.ENDPOINTS.RBAC.MY_PERMISSIONS
    );
    return response.data;
  },
};
