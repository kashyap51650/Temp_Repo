import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

import type { UserFilters, UsersResponse } from "../types/auth";

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VERSION: import.meta.env.VITE_API_VERSION,
  ENDPOINTS: {
    AUTH: {
      LOGIN: `/api/${import.meta.env.VITE_API_VERSION}/auth/login`,
      LOGOUT: `/api/${import.meta.env.VITE_API_VERSION}/auth/logout`,
      PROFILE: `/api/${import.meta.env.VITE_API_VERSION}/auth/profile`,
      FORGOT_PASSWORD: `/api/${import.meta.env.VITE_API_VERSION}/auth/forgot-password`,
      VERIFY_RESET_CODE: `/api/${import.meta.env.VITE_API_VERSION}/auth/verify-reset-code`,
      RESET_PASSWORD: `/api/${import.meta.env.VITE_API_VERSION}/auth/reset-password`,
      CHANGE_PASSWORD: `/api/${import.meta.env.VITE_API_VERSION}/auth/change-password`,
    },
    USERS: {
      LIST: `/api/${import.meta.env.VITE_API_VERSION}/users/`,
      CREATE: `/api/${import.meta.env.VITE_API_VERSION}/users/`,
      UPDATE: (userId: string) =>
        `/api/${import.meta.env.VITE_API_VERSION}/users/${userId}`,
      STATUS: (userId: string) =>
        `/api/${import.meta.env.VITE_API_VERSION}/users/${userId}/status`,
    },
    RBAC: {
      ROLES: `/api/${import.meta.env.VITE_API_VERSION}/rbac/roles`,
      ROLES_DROPDOWN: `/api/${import.meta.env.VITE_API_VERSION}/rbac/roles/dropdown`,
      USER_ROLES: `/api/${import.meta.env.VITE_API_VERSION}/rbac/user-roles`,
      USERS_WITH_ROLES: `/api/${import.meta.env.VITE_API_VERSION}/rbac/users-with-roles`,
    },
    MASTER_DATA: {
      SOURCES: `/api/${import.meta.env.VITE_API_VERSION}/master-data/`,
      ITEMS: (slug: string) =>
        `/api/${import.meta.env.VITE_API_VERSION}/${slug}/`,
      ITEM: (slug: string, id: number) =>
        `/api/${import.meta.env.VITE_API_VERSION}/${slug}/${id}`,
    },
    NOTIFICATIONS: {
      CREATE: `/api/${import.meta.env.VITE_API_VERSION}/notifications`,
      LIST: `/api/${import.meta.env.VITE_API_VERSION}/notifications`,
      MY_NOTIFICATIONS: `/api/${import.meta.env.VITE_API_VERSION}/user-notifications/my-notifications`,
      UNREAD_COUNT: `/api/${import.meta.env.VITE_API_VERSION}/user-notifications/unread-count`,
      MARK_READ: (notificationId: string) =>
        `/api/${import.meta.env.VITE_API_VERSION}/user-notifications/${notificationId}/mark-read`,
      MARK_ALL_READ: `/api/${import.meta.env.VITE_API_VERSION}/user-notifications/mark-all-read`,
      TEMPLATES: `/api/${import.meta.env.VITE_API_VERSION}/notification-templates`,
      TEMPLATES_DROPDOWN: `/api/${import.meta.env.VITE_API_VERSION}/notification-templates/dropdown`,
    },
  },
} as const;

export interface ApiError extends Error {
  message: string;
  status: number;
  details?: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
  type: string;
  input: unknown;
  context: {
    error: string;
  };
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success?: boolean;
}

// Common error handling utility functions
export function extractValidationErrors(error: ApiError): string {
  if (!error.details || !Array.isArray(error.details)) {
    return error.message;
  }

  const validationErrors = error.details as ValidationError[];

  if (validationErrors.length > 0 && validationErrors[0].context?.error) {
    return validationErrors[0].context.error;
  }

  if (validationErrors.length > 0 && validationErrors[0].message) {
    return validationErrors[0].message;
  }

  return error.message;
}

export function handleApiError(
  error: unknown,
  fallbackMessage: string
): string {
  return error instanceof Error && "details" in error
    ? extractValidationErrors(error as ApiError)
    : error instanceof Error
      ? error.message
      : fallbackMessage;
}

function createApiError(status: number, data: any): ApiError {
  const error = new Error(
    data.message || `HTTP error! status: ${status}`
  ) as ApiError;

  error.status = status;
  error.details = data;

  return error;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = sessionStorage.getItem("access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response) {
          const apiError = createApiError(
            error.response.status,
            error.response.data || {}
          );
          return Promise.reject(apiError);
        } else if (error.request) {
          const apiError = createApiError(500, {
            message: "Network error - no response received",
          });
          return Promise.reject(apiError);
        } else {
          const apiError = createApiError(500, {
            message: error.message || "An unexpected error occurred",
          });
          return Promise.reject(apiError);
        }
      }
    );
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(endpoint, config);
    return response.data;
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data, config);
    return response.data;
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, data, config);
    return response.data;
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint, config);
    return response.data;
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.patch<T>(endpoint, data, config);
    return response.data;
  }

  async postFormData<T>(
    endpoint: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, formData, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async putFormData<T>(
    endpoint: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, formData, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();

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

export const notificationApi = {
  createNotification: async (payload: {
    subject: string;
    message: string;
    notification_types: string[];
    recipient_role_ids: number[];
  }): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.CREATE,
      payload
    );
  },

  getNotifications: async (
    page: number = 1,
    size: number = 10,
    search?: string
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      items: Array<{
        id: number;
        title: string;
        sent_to: string[];
        sent_by: string;
        date: string;
        type: string[];
        recipients: number;
        status: string;
      }>;
      pagination: {
        page: number;
        size: number;
        total: number;
        pages: number;
        has_next: boolean;
        has_prev: boolean;
      };
    };
  }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const endpoint = `${API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST}?${params.toString()}`;
    return apiClient.get(endpoint);
  },

  getNotificationTemplates: async (
    page: number = 1,
    size: number = 10
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      items: Array<{
        id: number;
        template_name: string;
        template_subject: string;
        template_content: string;
        is_active: boolean;
        created_at: string;
        creator: {
          id: number;
          first_name: string;
          last_name: string;
          email: string;
        };
      }>;
      pagination: {
        page: number;
        size: number;
        total: number;
        pages: number;
        has_next: boolean;
        has_prev: boolean;
      };
    };
  }> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.NOTIFICATIONS.TEMPLATES}?${params.toString()}`;
    return apiClient.get(endpoint);
  },

  createNotificationTemplate: async (payload: {
    template_name: string;
    template_subject: string;
    template_content: string;
  }): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.TEMPLATES,
      payload
    );
  },

  updateNotificationTemplate: async (
    templateId: string,
    payload: {
      template_name: string;
      template_subject: string;
      template_content: string;
    }
  ): Promise<ApiResponse> => {
    return apiClient.put<ApiResponse>(
      `${API_CONFIG.ENDPOINTS.NOTIFICATIONS.TEMPLATES}/${templateId}`,
      payload
    );
  },

  getNotificationTemplatesDropdown: async (): Promise<{
    success: boolean;
    message: string;
    data: Array<{
      id: number;
      template_name: string;
      template_subject: string;
      template_content: string;
    }>;
  }> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.TEMPLATES_DROPDOWN);
  },

  getMyNotifications: async (
    page: number = 1,
    size: number = 10
  ): Promise<import("../types/notification").NotificationApiResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.NOTIFICATIONS.MY_NOTIFICATIONS}?${params.toString()}`;
    return apiClient.get<
      import("../types/notification").NotificationApiResponse
    >(endpoint);
  },

  getUnreadCount: async (): Promise<{
    success: boolean;
    message: string;
    data: {
      unread_count: number;
    };
  }> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  },

  markNotificationAsRead: async (
    notificationId: string
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    return apiClient.patch(
      API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId),
      {
        notification_id: notificationId,
      }
    );
  },

  markAllNotificationsAsRead: async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    return apiClient.patch(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  },
};

export const masterDataApi = {
  getMasterDataSources: async (): Promise<{
    success: boolean;
    message: string;
    data: Array<{
      slug: string;
      title: string;
      description: string;
    }>;
  }> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.MASTER_DATA.SOURCES);
  },

  getMasterData: async (
    slug: string
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      items: Array<{
        id: number;
        created_by: number;
        updated_by: number;
        created_at: string;
        updated_at: string;
        creator: {
          id: number;
          first_name: string;
          last_name: string;
          email: string;
        };
        updator: {
          id: number;
          first_name: string;
          last_name: string;
          email: string;
        };
        createdBy: string;
        updatedBy: string;
        [key: string]: any;
      }>;
      total: number;
      page: number;
      size: number;
      pages: number;
    };
  }> => {
    const response = (await apiClient.get(
      API_CONFIG.ENDPOINTS.MASTER_DATA.ITEMS(slug)
    )) as {
      success: boolean;
      message: string;
      data: {
        items: Array<any>;
        total: number;
        page: number;
        size: number;
        pages: number;
      };
    };

    if (response.success && response.data && response.data.items) {
      response.data.items = response.data.items.map((item: any) => ({
        ...item,
        createdBy: item.creator?.email || "",
        updatedBy: item.updator?.email || "",
      }));
    }

    return response;
  },

  createMasterDataItem: async (
    slug: string,
    data: Record<string, any>
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      id: number;
      created_by: number;
      updated_by: number;
      created_at: string;
      updated_at: string;
      creator: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
      };
      updator: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
      };
      createdBy: string;
      updatedBy: string;
      [key: string]: any;
    };
  }> => {
    const response = (await apiClient.post(
      API_CONFIG.ENDPOINTS.MASTER_DATA.ITEMS(slug),
      data
    )) as {
      success: boolean;
      message: string;
      data: any;
    };

    if (response.success && response.data) {
      response.data = {
        ...response.data,
        createdBy: response.data.creator?.email || "",
        updatedBy: response.data.updator?.email || "",
      };
    }

    return response;
  },

  updateMasterDataItem: async (
    slug: string,
    id: number,
    data: Record<string, any>
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      id: number;
      created_by: number;
      updated_by: number;
      created_at: string;
      updated_at: string;
      creator: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
      };
      updator: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
      };
      createdBy: string;
      updatedBy: string;
      [key: string]: any;
    };
  }> => {
    const response = (await apiClient.put(
      API_CONFIG.ENDPOINTS.MASTER_DATA.ITEM(slug, id),
      data
    )) as {
      success: boolean;
      message: string;
      data: any;
    };

    if (response.success && response.data) {
      response.data = {
        ...response.data,
        createdBy: response.data.creator?.email || "",
        updatedBy: response.data.updator?.email || "",
      };
    }

    return response;
  },

  deleteMasterDataItem: async (
    slug: string,
    id: number
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    return apiClient.delete(API_CONFIG.ENDPOINTS.MASTER_DATA.ITEM(slug, id));
  },
};

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
      roles: any[];
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
