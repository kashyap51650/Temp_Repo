import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

import { SESSION_STORAGE_KEYS } from "./constants";

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
        const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.ACCESS_TOKEN);
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
