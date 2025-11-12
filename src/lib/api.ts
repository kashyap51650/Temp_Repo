import type { RolesResponse, UserFilters, UsersResponse } from "../types/auth";

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VERSION: import.meta.env.VITE_API_VERSION,
  ENDPOINTS: {
    AUTH: {
      LOGIN: `/api/${import.meta.env.VITE_API_VERSION}/auth/login`,
      LOGOUT: `/api/${import.meta.env.VITE_API_VERSION}/auth/logout`,
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
      USER_ROLES: `/api/${import.meta.env.VITE_API_VERSION}/rbac/user-roles`,
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

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    const token = sessionStorage.getItem("access_token");
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        ) as ApiError;

        error.status = response.status;
        error.details = errorData;

        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && "status" in error) {
        throw error;
      }

      if (error instanceof Error) {
        const apiError = error as ApiError;
        apiError.status = 500;
        throw apiError;
      }

      const genericError = new Error(
        "An unexpected error occurred"
      ) as ApiError;
      genericError.status = 500;
      throw genericError;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
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
  getRoles: async (): Promise<RolesResponse> => {
    return apiClient.get<RolesResponse>(API_CONFIG.ENDPOINTS.RBAC.ROLES);
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
};
