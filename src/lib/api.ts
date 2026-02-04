import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

import type {
  BloodChemistryPDFPayload,
  BloodChemistryPDFUploadResponse,
  GetBloodChemistryReportResponse,
  SaveBloodChemistryDataResponse,
  SaveBloodChemistryPDFPayload,
} from "@/types/bloodChemistry";
import type {
  CreateDoseRangeFindingPayload,
  CreateDoseRangeFindingResponse,
} from "@/types/doseRangeFinding";
import type {
  ExperimentListFilters,
  ExperimentsListResponse,
} from "@/types/experiment";
import type {
  GetHematologyReportResponse,
  HematologyPDFPayload,
  HematologyPDFUploadResponse,
  SaveHematologyDataResponse,
  SaveHematologyPDFPayload,
} from "@/types/hematology";
import type {
  CalliperingNotesListParams,
  CalliperingNotesListResponse,
  ConfirmExperimentMouseGroupsPayload,
  ConfirmExperimentMouseGroupsResponse,
  CreateCalliperingNotesCommentPayload,
  CreateCalliperingNotesCommentResponse,
  CreateModelStudyPayload,
  CreateModelStudyResponse,
  ModelStudyExperimentMouseGroupsPayload,
  ModelStudyExperimentMouseGroupsResponse,
} from "@/types/modelStudy";
import type { MyPermissionResponse } from "@/types/permissions";
import type {
  RandomizationPreviewData,
  RandomizationPreviewResponse,
  ViewRandomizationGroupResponse,
} from "@/types/randomization";

import type { UserFilters, UsersResponse } from "../types/auth";
import type { ProjectFilters, ProjectsListResponse } from "../types/project";
import {
  API_CUSTOM_TIMEOUT,
  FILE_SIZE_LIMITS,
  type StudyTypeCode,
} from "./constants";
import { validatePDFFile } from "./utils";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthToken?: boolean;
  }
}

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
      MY_PERMISSIONS: `/api/${import.meta.env.VITE_API_VERSION}/rbac/my-permissions`,
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
      LIST: `/api/${import.meta.env.VITE_API_VERSION}/projects`,
      DROPDOWN: `/api/${import.meta.env.VITE_API_VERSION}/projects/dropdown`,
      SEARCH: `/api/${import.meta.env.VITE_API_VERSION}/projects/dropdown`,
      CREATE: `/api/${import.meta.env.VITE_API_VERSION}/projects/`,
      STATUS_UPDATE: (projectId: number) =>
        `/api/${import.meta.env.VITE_API_VERSION}/projects/${projectId}/status`,
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
      LIST: `/api/${import.meta.env.VITE_API_VERSION}/experiments`,
      STATUS_UPDATE: (experimentId: number) =>
        `/api/${import.meta.env.VITE_API_VERSION}/experiments/${experimentId}/status`,
    },
    BIOD_EXPERIMENTS: {
      CREATE: `/api/${import.meta.env.VITE_API_VERSION}/biod-experiments/`,
    },
    MODEL_STUDY_EXPERIMENTS: {
      CREATE: `/api/${import.meta.env.VITE_API_VERSION}/model-study-experiments/`,
      MOUSE_GROUPS: `/api/${import.meta.env.VITE_API_VERSION}/model-study-experiments/mouse-groups/preview`,
      CONFIRM_MOUSE_GROUPS: `/api/${import.meta.env.VITE_API_VERSION}/model-study-experiments/mouse-groups/confirm`,
    },
    DOSE_RANGE_FINDING_EXPERIMENTS: {
      CREATE: `/api/${import.meta.env.VITE_API_VERSION}/drf-experiments/`,
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
      IMPORT_AGC_EXPERIMENT_DATA: `/api/${import.meta.env.VITE_API_VERSION}/experiment-data/import-agc-experiment-data`,
      IMPORT_NECROPSY_EXPERIMENT_DATA: `/api/${import.meta.env.VITE_API_VERSION}/experiment-data/import-necropsy-experiment-data`,
    },
    EXPERIMENT_DRUGS: {
      DROPDOWN: `/api/${import.meta.env.VITE_API_VERSION}/experiment-drugs/dropdown`,
    },
    DOSES: {
      DROPDOWN: `/api/${import.meta.env.VITE_API_VERSION}/doses/dropdown`,
    },
    RANDOMIZATION: {
      PREVIEW: `/api/${import.meta.env.VITE_API_VERSION}/randomization/preview`,
      CONFIRM: `/api/${import.meta.env.VITE_API_VERSION}/randomization/confirm`,
      VIEW: (experimentId: number) =>
        `/api/${import.meta.env.VITE_API_VERSION}/randomization/view/${experimentId}`,
    },
    MOUSE_GROUPS: {
      MOUSE_GROUPS_BY_EXPERIMENT: (experimentId: number) =>
        `/api/${import.meta.env.VITE_API_VERSION}/mouse-groups/experiment/${experimentId}/groups`,
      MOUSE_GROUPS_WITH_ORGAN_WEIGHTS: (experimentId: number) =>
        `api/${import.meta.env.VITE_API_VERSION}/mouse-groups/experiment/${experimentId}/groups-with-organ-weights`,
    },
    EXCEL_EXPORT: {
      EXPORT_CALIPER_SHEET: `/api/${import.meta.env.VITE_API_VERSION}/caliper-sheet/export-caliper-sheet`,
      EXPORT_WEIGHT_SHEET: `/api/${import.meta.env.VITE_API_VERSION}/weight-sheet/export-weight-sheet`,
    },
    HEMATOLOGY: {
      SAVE_HEMATOLOGY_REPORT: `/api/${import.meta.env.VITE_API_VERSION}/hematology/save-hematology-report`,
      EXTRACT_HEMATOLOGY: `/api/${import.meta.env.VITE_API_VERSION}/hematology/extract-hematology-report`,
      GET_HEMATOLOGY_REPORT: (experimentId: number) =>
        `/api/${import.meta.env.VITE_API_VERSION}/experiment-data/${experimentId}/hematology`,
    },
    BLOOD_CHEMISTRY: {
      SAVE_BLOOD_CHEMISTRY_REPORT: `/api/${import.meta.env.VITE_API_VERSION}/blood-chemistry/save-blood-chemistry-report`,
      EXTRACT_BLOOD_CHEMISTRY: `/api/${import.meta.env.VITE_API_VERSION}/blood-chemistry/extract-blood-chemistry-report`,
      GET_BLOOD_CHEMISTRY_REPORT: (experimentId: number) =>
        `/api/${import.meta.env.VITE_API_VERSION}/experiment-data/${experimentId}/blood-chemistry`,
    },
    NECROPSY: {
      EXPORT_ORGAN_WEIGHT_SHEET: `/api/${import.meta.env.VITE_API_VERSION}/necropsy/export-organ-weight-sheet`,
    },
    ORGAN_WEIGHTS: {
      BULK_UPDATE: (experimentId: number) =>
        `/api/${import.meta.env.VITE_API_VERSION}/organ-weights/${experimentId}/bulk-update`,
    },
    CELL_INJECTION_COUNTS: {
      LIST: `/api/${import.meta.env.VITE_API_VERSION}/cell-injection-counts/dropdown`,
    },
    VEHICLES: {
      LIST: `/api/${import.meta.env.VITE_API_VERSION}/vehicles/dropdown`,
    },
    MOVE_MICE: {
      GET_MICE: (sourceExperimentId: number) =>
        `/api/${import.meta.env.VITE_API_VERSION}/move-mice/${sourceExperimentId}/mice`,
      GET_TARGET_EXPERIMENTS: (sourceExperimentId: number) =>
        `/api/${import.meta.env.VITE_API_VERSION}/move-mice/${sourceExperimentId}/experiments`,
      MOVE_MICE: (sourceExperimentId: number) =>
        `/api/${import.meta.env.VITE_API_VERSION}/move-mice/${sourceExperimentId}/move`,
    },
    CALLIPER_MEASUREMENT_COMMENTS: {
      LIST: `/api/${import.meta.env.VITE_API_VERSION}/caliper-measurement-comments`,
      CREATE: `/api/${import.meta.env.VITE_API_VERSION}/caliper-measurement-comments`,
    },
    MICE_TERMINATION: {
      TERMINATE_MICE: `/api/${import.meta.env.VITE_API_VERSION}/mice-termination`,
    },
    CALIPER_MEASUREMENTS: {
      HISTORY_BY_MOUSE: (experimentId: number) =>
        `/api/${import.meta.env.VITE_API_VERSION}/caliper-measurements/experiment/${experimentId}/history-by-mouse`,
      HISTORY_BY_GROUP: (experimentId: number) =>
        `/api/${import.meta.env.VITE_API_VERSION}/caliper-measurements/experiment/${experimentId}/history-by-group`,
    },
    PERFORM_BIOD: `/api/${import.meta.env.VITE_API_VERSION}/perform-biod`,
    CELL_LINE_VALIDATION: {
      VALIDATE_MOUSE_STRAIN: (cellLineId: number) =>
        `/api/${import.meta.env.VITE_API_VERSION}/cell-lines/${cellLineId}/mouse-strain/validate`,
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

export type RandomizationStatus = "completed" | "pending";

export interface ExperimentsDropdownResponse {
  success: boolean;
  message: string;
  data: ExperimentDropdownItem[];
}
export interface ExperimentFilters {
  project_id: number;
  study_type_id: number;
  specialization: string;
  cell_line_id?: number[];
  mouse_strain_id?: number[];
  status?: string;
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
  if (error instanceof Error && "details" in error) {
    return extractValidationErrors(error as ApiError);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
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
  private readonly axiosInstance: AxiosInstance;

  constructor(baseURL: string = API_CONFIG.BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL,
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
        if (token && !config.skipAuthToken) {
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

export const permissionsApi = {
  getMyPermissions: async () => {
    const response = await apiClient.get<MyPermissionResponse>(
      API_CONFIG.ENDPOINTS.RBAC.MY_PERMISSIONS
    );
    return response.data;
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
    slug: string,
    filters: {
      page: number;
      size: number;
    }
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
      `${API_CONFIG.ENDPOINTS.MASTER_DATA.ITEMS(slug)}?page=${filters.page}&size=${filters.size}`
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

    if (response.success && response.data?.items) {
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
  study_type_code: StudyTypeCode;
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
    randomization_status: RandomizationStatus;
  };
}

export interface CreateBiodExperimentPayload {
  cell_line_ids: number[];
  experiment_name: string;
  isotope_id: number;
  project_id: number;
  specialization: string;
  study_type_id: number;
}

export type BiodExperimentResponse = ApiResponse<{
  cell_lines: Array<{
    cell_line_name: string;
    id: number;
    vendor_name: string;
  }>;
  created_at: string;
  created_by: number;
  end_date: string;
  experiment_name: string;
  randomization_status: RandomizationStatus;
  fda_tag: boolean;
  id: number;
  isotope: {
    half_life_hours: number;
    id: number;
    isotope_name: string;
  };
  isotope_id: number;
  mouse_strains: Array<{
    mouse_strain_description: string;
    mouse_strain_id: number;
    mouse_strain_name: string;
  }>;
  project: {
    id: number;
    project_name: string;
    project_status: string;
  };
  project_id: number;
  protocol_number: string;
  specialization: string;
  start_date: string;
  status: string;
  study_type: {
    id: number;
    study_type_name: string;
  };
  study_type_id: number;
}>;

export interface ExperimentDropdownItem {
  id: number;
  experiment_name: string;
  randomization_status?: RandomizationStatus;
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
  study_type?: string;
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
    randomization_status?: string;
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
  // upload_date to be kept for future use if needed
  upload_date: string;
  created_at: string;
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
    return apiClient.get<ProjectsResponse>(
      API_CONFIG.ENDPOINTS.PROJECTS.DROPDOWN
    );
  },

  getProjectsList: async (
    filters?: ProjectFilters
  ): Promise<ProjectsListResponse> => {
    const params = new URLSearchParams();

    if (filters?.page !== undefined) {
      params.append("page", filters.page.toString());
    }
    if (filters?.size !== undefined) {
      params.append("size", filters.size.toString());
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.project_status) {
      params.append("project_status", filters.project_status);
    }

    const endpoint = params.toString()
      ? `${API_CONFIG.ENDPOINTS.PROJECTS.LIST}?${params.toString()}`
      : API_CONFIG.ENDPOINTS.PROJECTS.LIST;

    const response = await apiClient.get<ProjectsListResponse>(endpoint);
    return response;
  },

  searchProjects: async (searchTerm: string): Promise<ProjectsResponse> => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.append("search", searchTerm);
    }

    const endpoint = searchTerm
      ? `${API_CONFIG.ENDPOINTS.PROJECTS.SEARCH}?${params.toString()}`
      : API_CONFIG.ENDPOINTS.PROJECTS.DROPDOWN;

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

  updateProjectStatus: async (
    projectId: number,
    status: string
  ): Promise<ApiResponse> => {
    return apiClient.patch<ApiResponse>(
      API_CONFIG.ENDPOINTS.PROJECTS.STATUS_UPDATE(projectId),
      { project_status: status }
    );
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
  getCellLines: async (experimentId?: string): Promise<CellLinesResponse> => {
    return apiClient.get<CellLinesResponse>(
      API_CONFIG.ENDPOINTS.CELL_LINES.LIST,
      {
        params: { experiment_id: experimentId },
      }
    );
  },
};

export const mouseStrainApi = {
  getMouseStrains: async (
    experimentId?: string
  ): Promise<MouseStrainsResponse> => {
    return apiClient.get<MouseStrainsResponse>(
      API_CONFIG.ENDPOINTS.MOUSE_STRAINS.LIST,
      {
        params: { experiment_id: experimentId },
      }
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

  createBiodExperiment: async (
    payload: CreateBiodExperimentPayload
  ): Promise<BiodExperimentResponse> => {
    return apiClient.post<BiodExperimentResponse>(
      API_CONFIG.ENDPOINTS.BIOD_EXPERIMENTS.CREATE,
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

    // Add optional filters only if they are provided
    if (filters.cell_line_id && filters.cell_line_id.length > 0) {
      params.append("cell_line_id", filters.cell_line_id.join(","));
    }

    if (filters.mouse_strain_id && filters.mouse_strain_id.length > 0) {
      params.append("mouse_strain_id", filters.mouse_strain_id.join(","));
    }

    if (filters.status) {
      params.append("status", filters.status);
    }

    const endpoint = `${API_CONFIG.ENDPOINTS.EXPERIMENTS.DROPDOWN}?${params.toString()}`;
    return apiClient.get<ExperimentsDropdownResponse>(endpoint);
  },

  getExperimentsList: async (
    filters?: ExperimentListFilters
  ): Promise<ExperimentsListResponse> => {
    const params = new URLSearchParams();

    if (filters?.project_id !== undefined && filters.project_id !== null) {
      params.append("project_id", filters.project_id.toString());
    }
    if (filters?.page !== undefined) {
      params.append("page", filters.page.toString());
    }
    if (filters?.size !== undefined) {
      params.append("size", filters.size.toString());
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }

    if (filters?.status) {
      params.append("status", filters.status);
    }

    const endpoint = params.toString()
      ? `${API_CONFIG.ENDPOINTS.EXPERIMENTS.LIST}?${params.toString()}`
      : API_CONFIG.ENDPOINTS.EXPERIMENTS.LIST;

    const response = await apiClient.get<ExperimentsListResponse>(endpoint);
    return response;
  },

  updateExperimentStatus: async (
    experimentId: number,
    status: string
  ): Promise<ApiResponse> => {
    return apiClient.patch<ApiResponse>(
      API_CONFIG.ENDPOINTS.EXPERIMENTS.STATUS_UPDATE(experimentId),
      { status }
    );
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

export interface ImportAGCDataPayload {
  experiment_id: number;
  group_ids: string[];
  file: File;
}

export interface ImportPDFDataPayload {
  experiment_id: number;
  file: File;
}

export type ImportNecropsyDataPayload = ImportPDFDataPayload;
export type ImportNecropsyDataResponse = ApiResponse<{
  filename: string;
  experiment_id: number;
  uploaded_by: number;
}>;

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
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    } catch (error) {
      console.error("Experiment data import error:", error);
      throw error;
    }
  },

  importAGCExperimentData: async (payload: ImportAGCDataPayload) => {
    if (!payload.file) {
      throw new Error("File is required");
    }

    const fileName = payload.file.name.toLowerCase();

    if (!fileName.endsWith(".xlsx")) {
      throw new Error("Only .xlsx files are allowed");
    }

    const formData = new FormData();

    formData.append("experiment_id", payload.experiment_id.toString());
    formData.append("group_ids", payload.group_ids.join(","));
    formData.append("file", payload.file, payload.file.name);

    try {
      return await apiClient.postFormData(
        API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.IMPORT_AGC_EXPERIMENT_DATA,
        formData,
        {
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    } catch (error) {
      console.error("Experiment agc data import error:", error);
      throw error;
    }
  },

  importNecropsyData: async (
    payload: ImportNecropsyDataPayload
  ): Promise<ImportNecropsyDataResponse> => {
    validatePDFFile(payload.file);

    const formData = new FormData();

    formData.append("experiment_id", payload.experiment_id.toString());
    formData.append("file", payload.file, payload.file.name);

    try {
      return await apiClient.postFormData(
        API_CONFIG.ENDPOINTS.EXPERIMENT_DATA.IMPORT_NECROPSY_EXPERIMENT_DATA,
        formData,
        {
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    } catch (error) {
      console.error("Experiment necropsy data import error:", error);
      throw error;
    }
  },

  importHematologyData: async (
    payload: HematologyPDFPayload
  ): Promise<HematologyPDFUploadResponse> => {
    validatePDFFile(payload.file);

    const formData = new FormData();

    formData.append("experiment_id", payload.experiment_id.toString());
    formData.append("file", payload.file, payload.file.name);

    try {
      return await apiClient.postFormData(
        API_CONFIG.ENDPOINTS.HEMATOLOGY.EXTRACT_HEMATOLOGY,
        formData,
        {
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    } catch (error) {
      console.error("Experiment hematology data import error:", error);
      throw error;
    }
  },

  importBloodChemistryData: async (
    payload: BloodChemistryPDFPayload
  ): Promise<BloodChemistryPDFUploadResponse> => {
    validatePDFFile(payload.file);

    const formData = new FormData();

    formData.append("experiment_id", payload.experiment_id.toString());
    formData.append("file", payload.file, payload.file.name);

    try {
      return await apiClient.postFormData(
        API_CONFIG.ENDPOINTS.BLOOD_CHEMISTRY.EXTRACT_BLOOD_CHEMISTRY,
        formData,
        {
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    } catch (error) {
      console.error("Experiment blood chemistry data import error:", error);
      throw error;
    }
  },

  saveHematologyData: async (
    payload: SaveHematologyPDFPayload
  ): Promise<ApiResponse<SaveHematologyDataResponse>> => {
    return apiClient.post<ApiResponse<SaveHematologyDataResponse>>(
      API_CONFIG.ENDPOINTS.HEMATOLOGY.SAVE_HEMATOLOGY_REPORT,
      payload
    );
  },

  saveBloodChemistryData: async (
    payload: SaveBloodChemistryPDFPayload
  ): Promise<ApiResponse<SaveBloodChemistryDataResponse>> => {
    return apiClient.post<ApiResponse<SaveBloodChemistryDataResponse>>(
      API_CONFIG.ENDPOINTS.BLOOD_CHEMISTRY.SAVE_BLOOD_CHEMISTRY_REPORT,
      payload
    );
  },

  getExperimentData: async (
    filters?: ExperimentDataFilters
  ): Promise<ExperimentDataResponse> => {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.data_type) params.append("data_type_id", filters.data_type);
    if (filters?.study_type) params.append("study_type_id", filters.study_type);
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
    buffer_groups?: string[]; // Optional for dose range finding weight sheets
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
  viewRandomizationDetails: async (experimentId: number) => {
    return apiClient.get<ViewRandomizationGroupResponse>(
      API_CONFIG.ENDPOINTS.RANDOMIZATION.VIEW(experimentId)
    );
  },
};
export interface MouseGroup {
  id: number;
  experiment_id: number;
  group_code: string;
  group_name: string;
  group_type: string;
  cell_line_id: number | null;
  mouse_strain_id: number | null; // 👈 Add this property
  cell_dose: number | null;
  strain: string | null;
  is_locked: boolean;
  description: string;
  created_at: string;
  updated_at: string;
}

export const mouseGroupApi = {
  getMouseGroupsByExperiment: async (
    experimentId: number
  ): Promise<ApiResponse<MouseGroup[]>> => {
    return await apiClient.get(
      API_CONFIG.ENDPOINTS.MOUSE_GROUPS.MOUSE_GROUPS_BY_EXPERIMENT(experimentId)
    );
  },
  getMouseGroupWithOrganWeights: async (
    experimentId: number
  ): Promise<ApiResponse<MouseGroup[]>> => {
    return await apiClient.get(
      API_CONFIG.ENDPOINTS.MOUSE_GROUPS.MOUSE_GROUPS_WITH_ORGAN_WEIGHTS(
        experimentId
      )
    );
  },
};

export const necropsyApi = {
  downloadOrganSheet: async (payload: {
    experimentId: number;
    groupIds: number[];
  }): Promise<Blob> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.NECROPSY.EXPORT_ORGAN_WEIGHT_SHEET,
      {
        experiment_id: payload.experimentId,
        group_ids: payload.groupIds,
      },
      {
        responseType: "blob",
      }
    );
  },
};

export const exportSheetApi = {
  caliperSheet: async (payload: { experimentId: number }): Promise<Blob> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.EXCEL_EXPORT.EXPORT_CALIPER_SHEET,
      {
        experiment_id: payload.experimentId,
      },
      {
        responseType: "blob",
      }
    );
  },

  weightSheet: async (payload: { experimentId: number }): Promise<Blob> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.EXCEL_EXPORT.EXPORT_WEIGHT_SHEET,
      {
        experiment_id: payload.experimentId,
      },
      {
        responseType: "blob",
      }
    );
  },
};

export const cellInjectionCountsApi = {
  getCellInjectionCounts: async (): Promise<
    ApiResponse<{ items: Array<{ id: number; value: string }> }>
  > => {
    return apiClient.get(API_CONFIG.ENDPOINTS.CELL_INJECTION_COUNTS.LIST);
  },
};

export const vehiclesDropdownApi = {
  getVehiclesDropdown: async (): Promise<
    ApiResponse<{
      vehicles: Array<{ id: number; vehicle_name: string }>;
    }>
  > => {
    return apiClient.get(API_CONFIG.ENDPOINTS.VEHICLES.LIST);
  },
};

export const modelStudyExperimentApi = {
  createModelStudyExperiment: async (
    payload: CreateModelStudyPayload
  ): Promise<CreateModelStudyResponse> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.MODEL_STUDY_EXPERIMENTS.CREATE,
      payload
    );
  },

  experimentMouseGroups: async (
    payload: ModelStudyExperimentMouseGroupsPayload
  ): Promise<ModelStudyExperimentMouseGroupsResponse> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.MODEL_STUDY_EXPERIMENTS.MOUSE_GROUPS,
      payload
    );
  },

  confirmMouseGroups: async (
    payload: ConfirmExperimentMouseGroupsPayload
  ): Promise<ConfirmExperimentMouseGroupsResponse> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.MODEL_STUDY_EXPERIMENTS.CONFIRM_MOUSE_GROUPS,
      payload
    );
  },
};

export const moveMiceApi = {
  getMiceFromExperiment: async (
    sourceExperimentId: number
  ): Promise<import("@/types/moveMice").MoveMiceResponse> => {
    return apiClient.get<import("@/types/moveMice").MoveMiceResponse>(
      API_CONFIG.ENDPOINTS.MOVE_MICE.GET_MICE(sourceExperimentId)
    );
  },

  getTargetExperiments: async (
    sourceExperimentId: number
  ): Promise<import("@/types/moveMice").TargetExperimentsResponse> => {
    return apiClient.get<import("@/types/moveMice").TargetExperimentsResponse>(
      API_CONFIG.ENDPOINTS.MOVE_MICE.GET_TARGET_EXPERIMENTS(sourceExperimentId)
    );
  },

  confirmMoveMice: async (
    payload: import("@/types/moveMice").MoveMicePayload
  ): Promise<import("@/types/moveMice").MoveMiceConfirmResponse> => {
    return apiClient.post<import("@/types/moveMice").MoveMiceConfirmResponse>(
      API_CONFIG.ENDPOINTS.MOVE_MICE.MOVE_MICE(payload.source_experiment_id)
    );
  },
};
export const calliperingNotesCommentsApi = {
  getNotesComments: async ({
    id,
    params,
  }: {
    id: number;
    params: CalliperingNotesListParams;
  }): Promise<CalliperingNotesListResponse> => {
    const queryParams = new URLSearchParams();
    if (params.desc !== undefined)
      queryParams.append("desc", params.desc.toString());
    if (params.page !== undefined)
      queryParams.append("page", params.page.toString());
    if (params.size !== undefined)
      queryParams.append("size", params.size.toString());

    const queryString = queryParams.toString();

    const baseEndpoint = `${API_CONFIG.ENDPOINTS.CALLIPER_MEASUREMENT_COMMENTS.LIST}/${id}`;
    const endpoint = queryString
      ? `${baseEndpoint}?${queryString}`
      : baseEndpoint;

    return apiClient.get(endpoint);
  },

  createNoteComment: async (
    payload: CreateCalliperingNotesCommentPayload
  ): Promise<CreateCalliperingNotesCommentResponse> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.CALLIPER_MEASUREMENT_COMMENTS.CREATE,
      payload
    );
  },
};

export const doseRangeFindingExperimentApi = {
  createDoseRangeExperiment: async (
    payload: CreateDoseRangeFindingPayload
  ): Promise<CreateDoseRangeFindingResponse> => {
    return apiClient.post(
      API_CONFIG.ENDPOINTS.DOSE_RANGE_FINDING_EXPERIMENTS.CREATE,
      payload
    );
  },
};

export const dosesApi = {
  getDosesDropdown: async (): Promise<
    ApiResponse<
      Array<{
        id: number;
        name: string;
      }>
    >
  > => {
    return apiClient.get(API_CONFIG.ENDPOINTS.DOSES.DROPDOWN);
  },
};

export const hematologyApi = {
  getHematologyReportData: async (
    experimentDataId: number
  ): Promise<GetHematologyReportResponse> => {
    return apiClient.get(
      API_CONFIG.ENDPOINTS.HEMATOLOGY.GET_HEMATOLOGY_REPORT(experimentDataId)
    );
  },
};

export const bloodChemistryApi = {
  getBloodChemistryReportData: async (
    experimentDataId: number
  ): Promise<GetBloodChemistryReportResponse> => {
    return apiClient.get(
      API_CONFIG.ENDPOINTS.BLOOD_CHEMISTRY.GET_BLOOD_CHEMISTRY_REPORT(
        experimentDataId
      )
    );
  },
};

export interface PerformBioDPayload {
  group_ids: number[];
  source_experiment_id: number;
  target_experiment_id: number;
}

export interface PerformBioDResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const performBioDApi = {
  performBioD: async (
    payload: PerformBioDPayload
  ): Promise<PerformBioDResponse> => {
    return apiClient.post<PerformBioDResponse>(
      API_CONFIG.ENDPOINTS.PERFORM_BIOD,
      payload
    );
  },
};

export interface CaliperHistoryMeasurement {
  width_mm: number;
  length_mm: number;
  volume_mm3: number;
}

export interface CaliperHistoryMouseData {
  id: number;
  mouse_code: string;
  delivery_id: string;
}

export interface CaliperHistoryTab {
  tab_id: string;
  tab_label: string;
  metadata: {
    sex: string;
    strain: string;
    date_of_birth: string;
    cell_line: string;
    cell_injection_date: string;
  };
  mouse_data_by_delivery_id: Record<string, CaliperHistoryMouseData>;
  caliper_measurements: Record<
    string,
    Record<string, CaliperHistoryMeasurement>
  >;
  caliper_measurements_dates: string[];
}

export interface CaliperHistoryByMouseResponse {
  success: boolean;
  message: string;
  data: {
    tabs: CaliperHistoryTab[];
  };
}

export interface CaliperHistoryGroupData {
  id: number;
  group_code: string;
  group_name: string;
}

export interface CaliperHistoryGroupTab {
  tab_id: string;
  tab_label: string;
  metadata: {
    sex: string;
    strain: string;
    date_of_birth: string;
    cell_line: string;
    cell_injection_date: string;
  };
  group_data_by_group_id: Record<string, CaliperHistoryGroupData>;
  mouse_data_by_delivery_id: Record<string, CaliperHistoryMouseData>;
  caliper_measurements: Record<
    string,
    Record<string, Record<string, CaliperHistoryMeasurement>>
  >;
  caliper_measurements_dates: string[];
}

export interface CaliperHistoryByGroupResponse {
  success: boolean;
  message: string;
  data: {
    tabs: CaliperHistoryGroupTab[];
  };
}

export const caliperMeasurementsApi = {
  getHistoryByMouse: async (
    experimentId: number
  ): Promise<CaliperHistoryByMouseResponse> => {
    return apiClient.get<CaliperHistoryByMouseResponse>(
      API_CONFIG.ENDPOINTS.CALIPER_MEASUREMENTS.HISTORY_BY_MOUSE(experimentId)
    );
  },

  getHistoryByGroup: async (
    experimentId: number
  ): Promise<CaliperHistoryByGroupResponse> => {
    return apiClient.get<CaliperHistoryByGroupResponse>(
      API_CONFIG.ENDPOINTS.CALIPER_MEASUREMENTS.HISTORY_BY_GROUP(experimentId)
    );
  },
};

export interface ValidateCellLineMouseStrainPayload {
  mouse_strain_id: number;
}

export interface ValidateCellLineMouseStrainResponse {
  success: boolean;
  message: string;
  data: {
    is_valid: boolean;
    cell_line_name: string;
    mouse_strain_name: string;
    message: string;
  };
}

export const cellLineValidationApi = {
  validateMouseStrain: async (
    cellLineId: number,
    payload: ValidateCellLineMouseStrainPayload
  ): Promise<ValidateCellLineMouseStrainResponse> => {
    return apiClient.post<ValidateCellLineMouseStrainResponse>(
      API_CONFIG.ENDPOINTS.CELL_LINE_VALIDATION.VALIDATE_MOUSE_STRAIN(
        cellLineId
      ),
      payload
    );
  },
};
