import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

import type {
  RandomizationPreviewData,
  RandomizationPreviewResponse,
} from "@/types/randomization";

import type { UserFilters, UsersResponse } from "../types/auth";
import { FILE_SIZE_LIMITS } from "./constants";

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
    PROJECTS: {
      LIST: `/api/${import.meta.env.VITE_API_VERSION}/projects/dropdown`,
      SEARCH: `/api/${import.meta.env.VITE_API_VERSION}/projects/dropdown`,
      CREATE: `/api/${import.meta.env.VITE_API_VERSION}/projects/`,
    },
    STUDY_TYPES: {
      LIST: `/api/${import.meta.env.VITE_API_VERSION}/study-types/dropdown`,
    },
    ISOTOPES: {
      LIST: `/api/${import.meta.env.VITE_API_VERSION}/isotopes/dropdown`,
    },
    CELL_LINES: {
      LIST: `/api/${import.meta.env.VITE_API_VERSION}/cell-lines/dropdown`,
    },
    MOUSE_STRAINS: {
      LIST: `/api/${import.meta.env.VITE_API_VERSION}/mouse-strains/dropdown`,
    },
    EXPERIMENTS: {
      CREATE: `/api/${import.meta.env.VITE_API_VERSION}/experiments/`,
      DROPDOWN: `/api/${import.meta.env.VITE_API_VERSION}/experiments/dropdown`,
    },
    DATA_TYPES: {
      DROPDOWN: `/api/${import.meta.env.VITE_API_VERSION}/data-types/dropdown`,
    },
    SAMPLE_FILES: {
      DOWNLOAD: `/api/${import.meta.env.VITE_API_VERSION}/sample-file-download`,
    },
    EXPERIMENT_DATA: {
      IMPORT: `/api/${import.meta.env.VITE_API_VERSION}/experiment-data/import-experiment-data`,
      MY_EXPERIMENT_DATA: `/api/${import.meta.env.VITE_API_VERSION}/experiment-data/my-experiment-data`,
      LIST: `/api/${import.meta.env.VITE_API_VERSION}/experiment-data`,
      UPDATE_TREATMENT_DATE: (experimentDataId: string) =>
        `/api/${import.meta.env.VITE_API_VERSION}/experiment-data/${experimentDataId}/treatment-date`,
    },
    EXPERIMENT_DRUGS: {
      DROPDOWN: `/api/${import.meta.env.VITE_API_VERSION}/experiment-drugs/dropdown`,
    },
    RANDOMIZATION: {
      PREVIEW: `/api/${import.meta.env.VITE_API_VERSION}/randomization/preview`,
      CONFIRM: `/api/${import.meta.env.VITE_API_VERSION}/randomization/confirm`,
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

export interface ExperimentDropdownItem {
  id: number;
  experiment_name: string;
}

export interface ExperimentsDropdownResponse {
  success: boolean;
  message: string;
  data: ExperimentDropdownItem[];
}
export interface ExperimentFilters {
  project_id: number;
  study_type_id: number;
  specialization: string;
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

export interface Project {
  id: number;
  project_name: string;
}

export interface ProjectsResponse {
  success: boolean;
  message: string;
  data: Project[];
}

export interface StudyType {
  id: number;
  study_type_name: string;
  study_type_code: string;
}

export interface StudyTypesResponse {
  success: boolean;
  message: string;
  data: StudyType[];
}

export interface Isotope {
  id: number;
  isotope_name: string;
}

export interface IsotopesResponse {
  success: boolean;
  message: string;
  data: Isotope[];
}

export interface CellLine {
  id: number;
  cell_line_name: string;
  vendor_name: string;
}

export interface CellLinesResponse {
  success: boolean;
  message: string;
  data: CellLine[];
}

export interface MouseStrain {
  id: number;
  mouse_strain_name: string;
}

export interface MouseStrainsResponse {
  success: boolean;
  message: string;
  data: MouseStrain[];
}

export interface CreateExperimentPayload {
  cell_line_ids: number[];
  experiment_name: string;
  isotope_id: number;
  mouse_strain_ids: number[];
  project_id: number;
  specialization: string;
  study_type_id: number;
}

export interface CreateExperimentResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    experiment_name: string;
    project_id: number;
    specialization: string;
    study_type_id: number;
    isotope_id: number;
    cell_line_ids: number[];
    mouse_strain_ids: number[];
    created_at: string;
    updated_at: string;
  };
}

export interface ExperimentDropdownItem {
  id: number;
  experiment_name: string;
}

export interface ExperimentsDropdownResponse {
  success: boolean;
  message: string;
  data: ExperimentDropdownItem[];
}

export interface ExperimentFilters {
  project_id: number;
  study_type_id: number;
  specialization: string;
}

export interface ExperimentDataFilters {
  status?: string;
  data_type?: string;
  page?: number;
  size?: number;
}

export interface ExperimentDataItem {
  id: number;
  created_at: string;
  measurement_date?: string;
  treatment_date?: string;
  randomization_status: string;
  status: string;
  data_type: {
    id: number;
    data_type_code: string;
    data_type_name: string;
  };
  experiment: {
    id: number;
    experiment_name: string;
  };
  project: {
    id: number;
    project_name: string;
  };
  study_type: {
    id: number;
    study_type_code: string;
    study_type_name: string;
  };
  reviewer?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    username: string;
  };
}

export interface ExperimentDataResponse {
  items: ExperimentDataItem[];
  pagination: {
    page: number;
    size: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export type StatusType = "pending" | "approved" | "rejected";

export interface UploadedExperimentDataItem {
  id: number;
  project: {
    id: number;
    project_name: string;
  };
  experiment: {
    id: number;
    experiment_name: string;
  };
  data_type: {
    id: number;
    data_type_name: string;
    data_type_code: string;
  };
  study_type: {
    id: number;
    study_type_name: string;
    study_type_code: string;
  };
  upload_date: string;
  status: StatusType;
  reviewer: {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    full_name: string;
  } | null;
  rejection_reason: string;
  uploaded_data: any;
}

export interface UploadedExperimentDataResponse {
  items: UploadedExperimentDataItem[];
  pagination: {
    page: number;
    size: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface UploadedExperimentDataFilters {
  page?: number;
  size?: number;
  status?: string;
}

export const projectApi = {
  getProjects: async (): Promise<ProjectsResponse> => {
    return apiClient.get<ProjectsResponse>(API_CONFIG.ENDPOINTS.PROJECTS.LIST);
  },

  searchProjects: async (searchTerm: string): Promise<ProjectsResponse> => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.append("search", searchTerm);
    }

    const endpoint = searchTerm
      ? `${API_CONFIG.ENDPOINTS.PROJECTS.SEARCH}?${params.toString()}`
      : API_CONFIG.ENDPOINTS.PROJECTS.LIST;

    return apiClient.get<ProjectsResponse>(endpoint);
  },

  createProject: async (projectData: {
    project_name: string;
    description: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: Project;
  }> => {
    return apiClient.post<{
      success: boolean;
      message: string;
      data: Project;
    }>(API_CONFIG.ENDPOINTS.PROJECTS.CREATE, projectData);
  },
};

export const studyTypeApi = {
  getStudyTypes: async (): Promise<StudyTypesResponse> => {
    return apiClient.get<StudyTypesResponse>(
      API_CONFIG.ENDPOINTS.STUDY_TYPES.LIST
    );
  },
};

export const isotopeApi = {
  getIsotopes: async (): Promise<IsotopesResponse> => {
    return apiClient.get<IsotopesResponse>(API_CONFIG.ENDPOINTS.ISOTOPES.LIST);
  },
};

export const cellLineApi = {
  getCellLines: async (): Promise<CellLinesResponse> => {
    return apiClient.get<CellLinesResponse>(
      API_CONFIG.ENDPOINTS.CELL_LINES.LIST
    );
  },
};

export const mouseStrainApi = {
  getMouseStrains: async (): Promise<MouseStrainsResponse> => {
    return apiClient.get<MouseStrainsResponse>(
      API_CONFIG.ENDPOINTS.MOUSE_STRAINS.LIST
    );
  },
};

export const experimentApi = {
  createExperiment: async (
    payload: CreateExperimentPayload
  ): Promise<CreateExperimentResponse> => {
    return apiClient.post<CreateExperimentResponse>(
      API_CONFIG.ENDPOINTS.EXPERIMENTS.CREATE,
      payload
    );
  },

  getExperimentsDropdown: async (
    filters: ExperimentFilters
  ): Promise<ExperimentsDropdownResponse> => {
    const params = new URLSearchParams({
      project_id: filters.project_id.toString(),
      study_type_id: filters.study_type_id.toString(),
      specialization: filters.specialization,
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.EXPERIMENTS.DROPDOWN}?${params.toString()}`;
    return apiClient.get<ExperimentsDropdownResponse>(endpoint);
  },
};

export interface DataType {
  id: number;
  data_type_name: string;
  study_type_id: number;
}

export interface DataTypesResponse {
  success: boolean;
  message: string;
  data: DataType[];
}

export interface DataTypeFilters {
  study_type_id: number;
}

export const dataTypeApi = {
  getDataTypes: async (
    filters: DataTypeFilters
  ): Promise<DataTypesResponse> => {
    const params = new URLSearchParams({
      study_type_id: filters.study_type_id.toString(),
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.DATA_TYPES.DROPDOWN}?${params.toString()}`;
    return apiClient.get<DataTypesResponse>(endpoint);
  },
};

export interface SampleFileFilters {
  study_type_id: number;
  data_type_id: number;
}

export interface SampleFileResponse {
  success: boolean;
  message: string;
  data: {
    download_url: string;
    expires_in: number;
    file_name: string;
  };
}

export const sampleFileApi = {
  getSampleFileDownload: async (
    filters: SampleFileFilters
  ): Promise<SampleFileResponse> => {
    const params = new URLSearchParams({
      study_type_id: filters.study_type_id.toString(),
      data_type_id: filters.data_type_id.toString(),
    });

    const endpoint = `${API_CONFIG.ENDPOINTS.SAMPLE_FILES.DOWNLOAD}?${params.toString()}`;
    return apiClient.get<SampleFileResponse>(endpoint);
  },
};

export interface ImportExperimentDataPayload {
  experiment_id: number | null;
  data_type_id: number | null;
  file: File;
}

export interface ImportExperimentDataResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const experimentDataApi = {
  importExperimentData: async (
    payload: ImportExperimentDataPayload
  ): Promise<ImportExperimentDataResponse> => {
    if (!payload.file) {
      throw new Error("File is required");
    }

    if (payload.experiment_id === null || payload.experiment_id === undefined) {
      throw new Error("Experiment ID is required");
    }

    if (payload.data_type_id === null || payload.data_type_id === undefined) {
      throw new Error("Data Type ID is required");
    }

    const fileName = payload.file.name.toLowerCase();
    if (!fileName.endsWith(".xlsx")) {
      throw new Error("Only .xlsx files are allowed");
    }

    if (payload.file.size > FILE_SIZE_LIMITS.EXCEL_FILE) {
      throw new Error("File size must be less than 10MB");
    }

    if (payload.file.size === 0) {
      throw new Error("File cannot be empty");
    }

    const formData = new FormData();

    formData.append("experiment_id", payload.experiment_id.toString());
    formData.append("data_type_id", payload.data_type_id.toString());

    formData.append("file", payload.file, payload.file.name);

    try {
      return await apiClient.postFormData<ImportExperimentDataResponse>(
        API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.IMPORT,
        formData,
        {
          timeout: 60000,
        }
      );
    } catch (error) {
      console.error("Experiment data import error:", error);
      throw error;
    }
  },

  getExperimentData: async (
    filters?: ExperimentDataFilters
  ): Promise<ExperimentDataResponse> => {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.data_type) params.append("data_type", filters.data_type);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.size) params.append("size", filters.size.toString());

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.LIST}?${queryString}`
      : API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.LIST;

    return apiClient.get<ExperimentDataResponse>(endpoint);
  },

  updateTreatmentDate: async (
    experimentDataId: string,
    treatmentDate: string
  ): Promise<ApiResponse> => {
    return apiClient.patch<ApiResponse>(
      API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.UPDATE_TREATMENT_DATE(
        experimentDataId
      ),
      { treatment_date: treatmentDate }
    );
  },
};

// Add to experimentDataApi
export const uploadedExperimentDataApi = {
  getMyExperimentData: async (
    filters?: UploadedExperimentDataFilters
  ): Promise<UploadedExperimentDataResponse> => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.size) params.append("size", filters.size.toString());
    if (filters?.status && filters.status !== "All Status") {
      params.append("status", filters.status.toLowerCase());
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.MY_EXPERIMENT_DATA}?${queryString}`
      : API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.MY_EXPERIMENT_DATA;

    return apiClient.get<UploadedExperimentDataResponse>(endpoint);
  },
};

export const experimentDrugApi = {
  getExperimentDrugsDropdown: async (): Promise<{
    success: boolean;
    message: string;
    data: Array<{
      id: number;
      drug_name: string;
      om_number: string;
    }>;
  }> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.EXPERIMENT_DRUGS.DROPDOWN);
  },
};

export const randomizationApi = {
  previewRandomization: async (payload: {
    experiment_id: number;
    mice_per_group: number;
    randomization_type: string;
  }): Promise<RandomizationPreviewResponse> => {
    return apiClient.post(API_CONFIG.ENDPOINTS.RANDOMIZATION.PREVIEW, {
      ...payload,
    });
  },
  confirmRandomization: async (payload: RandomizationPreviewData) => {
    return apiClient.post(API_CONFIG.ENDPOINTS.RANDOMIZATION.CONFIRM, {
      ...payload,
    });
  },
};
