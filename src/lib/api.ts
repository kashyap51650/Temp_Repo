import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

import { API_CUSTOM_TIMEOUT, SESSION_STORAGE_KEYS } from "./constants";
import { getEncryptedItem } from "./crypto";
import { logger } from "./logger";
import { logError, sanitizeSentryData } from "./sentry-logger";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuthToken?: boolean;
  }
}

/**
 * Decode JWT token and extract payload
 * Used for checking token expiration before API requests
 *
 * ✅ Handles base64url encoding with missing padding
 * ✅ Uses TextDecoder for proper UTF-8 decoding (avoids edge cases)
 */
function decodeJWT(token: string): { exp?: number } | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    // ✅ Convert base64url to base64
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // ✅ Add required padding so length is a multiple of 4
    // JWT payloads often omit padding - atob() requires it
    const paddingNeeded = (4 - (base64.length % 4)) % 4;
    const normalizedBase64 = base64 + "=".repeat(paddingNeeded);

    // ✅ Decode base64 into bytes, then UTF-8 decode into a string
    // Using TextDecoder instead of decodeURIComponent trick avoids UTF-8 edge cases
    const binaryString = atob(normalizedBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const jsonPayload = new TextDecoder("utf-8").decode(bytes);

    return JSON.parse(jsonPayload);
  } catch (error) {
    logger.error("[JWT] Failed to decode token:", error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 * @param token - JWT token string
 * @returns true if token is expired or invalid
 */
function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded?.exp) return true;

  // exp is in seconds, Date.now() is in milliseconds
  const expirationTime = decoded.exp * 1000;
  const now = Date.now();

  // Add 30 second buffer to avoid edge cases
  return now >= expirationTime - 30000;
}

const API_VERSION = import.meta.env.VITE_API_VERSION as string;

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VERSION: API_VERSION,
  ENDPOINTS: {
    AUTH: {
      LOGIN: `/api/${API_VERSION}/auth/login`,
      LOGOUT: `/api/${API_VERSION}/auth/logout`,
      PROFILE: `/api/${API_VERSION}/auth/profile`,
      FORGOT_PASSWORD: `/api/${API_VERSION}/auth/forgot-password`,
      VERIFY_RESET_CODE: `/api/${API_VERSION}/auth/verify-reset-code`,
      RESET_PASSWORD: `/api/${API_VERSION}/auth/reset-password`,
      CHANGE_PASSWORD: `/api/${API_VERSION}/auth/change-password`,
    },
    USERS: {
      LIST: `/api/${API_VERSION}/users/`,
      CREATE: `/api/${API_VERSION}/users/`,
      UPDATE: (userId: string) => `/api/${API_VERSION}/users/${userId}`,
      STATUS: (userId: string) => `/api/${API_VERSION}/users/${userId}/status`,
    },
    RBAC: {
      ROLES: `/api/${API_VERSION}/rbac/roles`,
      ROLES_DROPDOWN: `/api/${API_VERSION}/rbac/roles/dropdown`,
      USER_ROLES: `/api/${API_VERSION}/rbac/user-roles`,
      USERS_WITH_ROLES: `/api/${API_VERSION}/rbac/users-with-roles`,
      MY_PERMISSIONS: `/api/${API_VERSION}/rbac/my-permissions`,
    },
    MASTER_DATA: {
      SOURCES: `/api/${API_VERSION}/master-data/`,
      ITEMS: (slug: string) => `/api/${API_VERSION}/${slug}/`,
      ITEM: (slug: string, id: number) => `/api/${API_VERSION}/${slug}/${id}`,
    },
    NOTIFICATIONS: {
      CREATE: `/api/${API_VERSION}/notifications`,
      LIST: `/api/${API_VERSION}/notifications`,
      MY_NOTIFICATIONS: `/api/${API_VERSION}/user-notifications/my-notifications`,
      UNREAD_COUNT: `/api/${API_VERSION}/user-notifications/unread-count`,
      MARK_READ: (notificationId: string) =>
        `/api/${API_VERSION}/user-notifications/${notificationId}/mark-read`,
      MARK_ALL_READ: `/api/${API_VERSION}/user-notifications/mark-all-read`,
      TEMPLATES: `/api/${API_VERSION}/notification-templates`,
      TEMPLATES_DROPDOWN: `/api/${API_VERSION}/notification-templates/dropdown`,
    },
    PROJECTS: {
      LIST: `/api/${API_VERSION}/projects`,
      DROPDOWN: `/api/${API_VERSION}/projects/dropdown`,
      SEARCH: `/api/${API_VERSION}/projects/dropdown`,
      CREATE: `/api/${API_VERSION}/projects/`,
      STATUS_UPDATE: (projectId: number) =>
        `/api/${API_VERSION}/projects/${projectId}/status`,
    },
    STUDY_TYPES: {
      LIST: `/api/${API_VERSION}/study-types/dropdown`,
    },
    ISOTOPES: {
      LIST: `/api/${API_VERSION}/isotopes/dropdown`,
    },
    CELL_LINES: {
      LIST: `/api/${API_VERSION}/cell-lines/dropdown`,
    },
    MOUSE_STRAINS: {
      LIST: `/api/${API_VERSION}/mouse-strains/dropdown`,
    },
    EXPERIMENTS: {
      CREATE: `/api/${API_VERSION}/experiments/`,
      DROPDOWN: `/api/${API_VERSION}/experiments/dropdown`,
      LIST: `/api/${API_VERSION}/experiments`,
      STATUS_UPDATE: (experimentId: number) =>
        `/api/${API_VERSION}/experiments/${experimentId}/status`,
      EXPERIMENT_DETAILS: (experimentId: number) =>
        `/api/${API_VERSION}/experiments/${experimentId}`,
    },
    BIOD_EXPERIMENTS: {
      CREATE: `/api/${API_VERSION}/biod-experiments/`,
    },
    MODEL_STUDY_EXPERIMENTS: {
      CREATE: `/api/${API_VERSION}/model-study-experiments/`,
      MOUSE_GROUPS: `/api/${API_VERSION}/model-study-experiments/mouse-groups/preview`,
      CONFIRM_MOUSE_GROUPS: `/api/${API_VERSION}/model-study-experiments/mouse-groups/confirm`,
    },
    DOSE_RANGE_FINDING_EXPERIMENTS: {
      CREATE: `/api/${API_VERSION}/drf-experiments/`,
    },
    TOXICITY: {
      CREATE: `/api/${API_VERSION}/toxicity-experiments/`,
    },
    CLRF_EXPERIMENTS: {
      CREATE: `/api/${API_VERSION}/clrf-experiments/`,
    },
    DIRECT_BINDING_ASSAY_EXPERIMENTS: {
      CREATE: `/api/${API_VERSION}/direct-binding-assay-experiments/`,
    },
    CONJUGATION_EXPERIMENTS: {
      CREATE: `/api/${API_VERSION}/conjugation-experiments/`,
    },
    IRF: {
      CREATE: `/api/${API_VERSION}/irf-experiments/`,
    },
    RECEPTOR_QUANTIFICATION: {
      CREATE: `/api/${API_VERSION}/receptor-quantification-experiments/`,
    },
    DELFIA_EXPERIMENTS: {
      CREATE: `/api/${API_VERSION}/delfia-experiments/`,
    },
    ELISA_EXPERIMENTS: {
      CREATE: `/api/${API_VERSION}/elisa-experiments/`,
    },
    SATURATION_BINDING_ASSAY_EXPERIMENTS: {
      CREATE: `/api/${API_VERSION}/saturation-binding-assay-experiments/`,
    },
    DATA_TYPES: {
      DROPDOWN: `/api/${API_VERSION}/data-types/dropdown`,
    },
    SAMPLE_FILES: {
      DOWNLOAD: `/api/${API_VERSION}/sample-file-download`,
    },
    EXPERIMENT_DATA: {
      IMPORT: `/api/${API_VERSION}/experiment-data/import-experiment-data`,
      MY_EXPERIMENT_DATA: `/api/${API_VERSION}/experiment-data/my-experiment-data`,
      LIST: `/api/${API_VERSION}/experiment-data`,
      UPDATE_TREATMENT_DATE: (experimentDataId: string) =>
        `/api/${API_VERSION}/experiment-data/${experimentDataId}/treatment-date`,
      WEIGHT_SHEET_DATA: (experimentDataId: string) =>
        `/api/${API_VERSION}/experiment-data/${experimentDataId}/weight-sheet`,
      CALLIPERING_SHEET_DATA: (experimentDataId: string) =>
        `/api/${API_VERSION}/experiment-data/${experimentDataId}/callipering-sheet`,
      ORGAN_WEIGHT_SHEET_DATA: (experimentDataId: string) =>
        `/api/${API_VERSION}/experiment-data/${experimentDataId}/organ-weight-sheet`,
      NECROPSY_DATA: (experimentDataId: string) =>
        `/api/${API_VERSION}/experiment-data/${experimentDataId}/necropsy-data`,
      HOTLAB_DATA: (experimentDataId: string) =>
        `/api/${API_VERSION}/experiment-data/${experimentDataId}/hotlab-pdf`,
      CMC_DATA: (experimentDataId: string) =>
        `/api/${API_VERSION}/experiment-data/${experimentDataId}/cmc-data`,
      SATURATION_BINDING_ASSAY_DATA: (experimentDataId: string) =>
        `/api/${API_VERSION}/experiment-data/${experimentDataId}/saturation-binding-assay`,
      ELISA_DATA: (experimentDataId: string) =>
        `/api/${API_VERSION}/experiment-data/${experimentDataId}/elisa-data`,
      DELFIA_DATA: (experimentDataId: string) =>
        `/api/${API_VERSION}/experiment-data/${experimentDataId}/delfia-data`,
      IMPORT_AGC_EXPERIMENT_DATA: `/api/${API_VERSION}/experiment-data/import-agc-experiment-data`,
      IMPORT_NECROPSY_EXPERIMENT_DATA: `/api/${API_VERSION}/experiment-data/import-necropsy-experiment-data`,
      IMPORT_CLRF_EXPERIMENT_DATA: `/api/${API_VERSION}/experiment-data/cmc/clrf/import-clrf-experiment-data`,
      IMPORT_CONJUGATION_EXPERIMENT_DATA: `/api/${API_VERSION}/experiment-data/cmc/conjugation/import-conjugation-experiment-data`,
      IMPORT_CONJUGATION_GEL_IMAGE_DATA: `/api/${API_VERSION}/experiment-data/cmc/conjugation/import-gel-image-experiment-data`,
      IMPORT_DIRECT_BINDING_ASSAY_EXPERIMENT_DATA: `/api/${API_VERSION}/experiment-data/cmc/direct-binding-assay/import-direct-binding-assay-experiment-data`,
      IMPORT_IRF_EXPERIMENT_DATA: `/api/${API_VERSION}/experiment-data/cmc/irf/import-irf-experiment-data`,
      IMPORT_RECEPTOR_QUANTIFICATION_EXPERIMENT_DATA: `/api/${API_VERSION}/experiment-data/cmc/receptor-quantification/import-receptor-quantification-experiment-data`,
    },
    EXPERIMENT_DRUGS: {
      DROPDOWN: `/api/${API_VERSION}/experiment-drugs/dropdown`,
    },
    DOSES: {
      DROPDOWN: `/api/${API_VERSION}/doses/dropdown`,
    },
    ANTIBODIES: {
      DROPDOWN: `/api/${API_VERSION}/antibodies/dropdown`,
    },
    RANDOMIZATION: {
      PREVIEW: `/api/${API_VERSION}/randomization/preview`,
      CONFIRM: `/api/${API_VERSION}/randomization/confirm`,
      VIEW: (experimentId: number) =>
        `/api/${API_VERSION}/randomization/view/${experimentId}`,
    },
    EFFICACY_RANDOMIZATION: {
      GROUPS: `/api/${API_VERSION}/efficacy-randomization/groups`,
      PREVIEW: `/api/${API_VERSION}/efficacy-randomization/preview`,
      CONFIRM: `/api/${API_VERSION}/efficacy-randomization/confirm`,
      STATUS: (experimentId: number) =>
        `/api/${API_VERSION}/efficacy-randomization/status/${experimentId}`,
    },
    MOUSE_GROUPS: {
      MOUSE_GROUPS_BY_EXPERIMENT: (experimentId: number) =>
        `/api/${API_VERSION}/mouse-groups/experiment/${experimentId}/groups`,
      MOUSE_GROUPS_WITH_ORGAN_WEIGHTS: (experimentId: number) =>
        `/api/${API_VERSION}/mouse-groups/experiment/${experimentId}/groups-with-organ-weights`,
      UPDATE_MOUSE_GROUP_NO_OF_MICE: (mouseGroupId: number) =>
        `/api/${API_VERSION}/mouse-groups/${mouseGroupId}/no-of-mice`,
    },
    EXCEL_EXPORT: {
      EXPORT_CALIPER_SHEET: `/api/${API_VERSION}/caliper-sheet/export-caliper-sheet`,
      EXPORT_WEIGHT_SHEET: `/api/${API_VERSION}/weight-sheet/export-weight-sheet`,
    },
    HEMATOLOGY: {
      SAVE_HEMATOLOGY_REPORT: `/api/${API_VERSION}/hematology/save-hematology-report`,
      EXTRACT_HEMATOLOGY: `/api/${API_VERSION}/hematology/extract-hematology-report`,
      GET_HEMATOLOGY_REPORT: (experimentId: number) =>
        `/api/${API_VERSION}/experiment-data/${experimentId}/hematology`,
    },
    BLOOD_CHEMISTRY: {
      SAVE_BLOOD_CHEMISTRY_REPORT: `/api/${API_VERSION}/blood-chemistry/save-blood-chemistry-report`,
      EXTRACT_BLOOD_CHEMISTRY: `/api/${API_VERSION}/blood-chemistry/extract-blood-chemistry-report`,
      GET_BLOOD_CHEMISTRY_REPORT: (experimentId: number) =>
        `/api/${API_VERSION}/experiment-data/${experimentId}/blood-chemistry`,
    },
    NECROPSY: {
      EXPORT_ORGAN_WEIGHT_SHEET: `/api/${API_VERSION}/necropsy/export-organ-weight-sheet`,
    },
    HOTLAB: {
      EXTRACT_REPORT: `/api/${API_VERSION}/hotlab/extract-report`,
      CREATE_EXPERIMENT: `/api/${API_VERSION}/hotlab-experiments`,
      GET_EXPERIMENT: (experimentId: number) =>
        `/api/${API_VERSION}/hotlab-experiments/${experimentId}`,
      UPDATE_EXPERIMENT: (experimentId: number) =>
        `/api/${API_VERSION}/hotlab-experiments/${experimentId}`,
      IMPORT_EXPERIMENT_DATA: `/api/${API_VERSION}/hotlab/import-hotlab-pdf`,
    },
    EFFICACY: {
      CREATE_EXPERIMENT: `/api/${API_VERSION}/efficacy-experiments/`,
    },
    ORGAN_WEIGHTS: {
      BULK_UPDATE: (experimentId: number) =>
        `/api/${API_VERSION}/organ-weights/${experimentId}/bulk-update`,
    },
    CELL_INJECTION_COUNTS: {
      LIST: `/api/${API_VERSION}/cell-injection-counts/dropdown`,
    },
    VEHICLES: {
      LIST: `/api/${API_VERSION}/vehicles/dropdown`,
    },
    MOVE_MICE: {
      GET_MICE: (sourceExperimentId: number) =>
        `/api/${API_VERSION}/move-mice/${sourceExperimentId}/mice`,
      GET_TARGET_EXPERIMENTS: (sourceExperimentId: number) =>
        `/api/${API_VERSION}/move-mice/${sourceExperimentId}/experiments`,
      MOVE_MICE: (sourceExperimentId: number) =>
        `/api/${API_VERSION}/move-mice/${sourceExperimentId}/move`,
    },
    CALLIPER_MEASUREMENT_COMMENTS: {
      LIST: `/api/${API_VERSION}/caliper-measurement-comments`,
      CREATE: `/api/${API_VERSION}/caliper-measurement-comments`,
    },
    MICE_TERMINATION: {
      TERMINATE_MICE: `/api/${API_VERSION}/mice-termination`,
    },
    CALIPER_MEASUREMENTS: {
      HISTORY_BY_MOUSE: (experimentId: number) =>
        `/api/${API_VERSION}/caliper-measurements/experiment/${experimentId}/history-by-mouse`,
      HISTORY_BY_GROUP: (experimentId: number) =>
        `/api/${API_VERSION}/caliper-measurements/experiment/${experimentId}/history-by-group`,
    },
    PERFORM_BIOD: {
      LEGACY: `/api/${API_VERSION}/perform-biod`, // Deprecated: Legacy endpoint, no longer used and scheduled for removal in a future release.
      MODEL_STUDY: `/api/${API_VERSION}/perform-biod/model-study`,
      EFFICACY: `/api/${API_VERSION}/perform-biod/efficacy`,
    },
    CELL_LINE_VALIDATION: {
      VALIDATE_MOUSE_STRAIN: (cellLineId: number) =>
        `/api/${API_VERSION}/cell-lines/${cellLineId}/mouse-strain/validate`,
    },
    DOSE_FREQUENCIES: {
      DROPDOWN: `/api/${API_VERSION}/dose-frequencies/dropdown`,
      CREATE: `/api/${API_VERSION}/dose-frequencies/`,
    },
    MARKET_DOSE: {
      DROPDOWN: `/api/${API_VERSION}/market-doses/dropdown`,
    },
    USER_NOTIFICATION_SETTINGS: {
      GET_USER_NOTIFICATION_SETTINGS: `/api/${API_VERSION}/user-notification-settings`,
      UPDATE_USER_NOTIFICATION_SETTINGS: `/api/${API_VERSION}/user-notification-settings`,
    },
    DATA_UPLOAD: {
      PRECLINICAL: {
        BIOD: {
          WEIGHT_SHEET: `/api/${API_VERSION}/data-upload/preclinical/biod/weight-sheet`,
          CALLIPERING_SHEET: `/api/${API_VERSION}/data-upload/preclinical/biod/callipering-sheet`,
          ORGAN_WEIGHT_SHEET: `/api/${API_VERSION}/data-upload/preclinical/biod/organ-weight-sheet`,
          AGC_SHEET: `/api/${API_VERSION}/data-upload/preclinical/biod/agc-sheet`,
          HOTLAB: `/api/${API_VERSION}/data-upload/preclinical/biod/hotlab`,
        },

        DRF: {
          WEIGHT_SHEET: `/api/${API_VERSION}/data-upload/preclinical/drf/weight-sheet`,
          NECROPSY: `/api/${API_VERSION}/data-upload/preclinical/drf/necropsy`,
          EXTRACT_HEMATOLOGY_REPORT: `/api/${API_VERSION}/data-upload/preclinical/drf/extract-hematology-report`,
          SAVE_HEMATOLOGY_REPORT: `/api/${API_VERSION}/data-upload/preclinical/drf/save-hematology-report`,
          EXTRACT_BLOOD_CHEMISTRY_REPORT: `/api/${API_VERSION}/data-upload/preclinical/drf/extract-blood-chemistry-report`,
          SAVE_BLOOD_CHEMISTRY_REPORT: `/api/${API_VERSION}/data-upload/preclinical/drf/save-blood-chemistry-report`,
          HOTLAB: `/api/${API_VERSION}/data-upload/preclinical/drf/hotlab`,
        },

        EFFICACY: {
          WEIGHT_SHEET: `/api/${API_VERSION}/data-upload/preclinical/efficacy/weight-sheet`,
          CALLIPERING_SHEET: `/api/${API_VERSION}/data-upload/preclinical/efficacy/callipering-sheet`,
          HOTLAB: `/api/${API_VERSION}/data-upload/preclinical/efficacy/hotlab`,
        },

        MODEL_STUDY: {
          WEIGHT_SHEET: `/api/${API_VERSION}/data-upload/preclinical/model-study/weight-sheet`,
          CALLIPERING_SHEET: `/api/${API_VERSION}/data-upload/preclinical/model-study/callipering-sheet`,
          HOTLAB: `/api/${API_VERSION}/data-upload/preclinical/model-study/hotlab`,
        },

        TOXICITY: {
          WEIGHT_SHEET: `/api/${API_VERSION}/data-upload/preclinical/toxicity/weight-sheet`,
          NECROPSY: `/api/${API_VERSION}/data-upload/preclinical/toxicity/necropsy`,
          EXTRACT_HEMATOLOGY_REPORT: `/api/${API_VERSION}/data-upload/preclinical/toxicity/extract-hematology-report`,
          SAVE_HEMATOLOGY_REPORT: `/api/${API_VERSION}/data-upload/preclinical/toxicity/save-hematology-report`,
          EXTRACT_BLOOD_CHEMISTRY_REPORT: `/api/${API_VERSION}/data-upload/preclinical/toxicity/extract-blood-chemistry-report`,
          SAVE_BLOOD_CHEMISTRY_REPORT: `/api/${API_VERSION}/data-upload/preclinical/toxicity/save-blood-chemistry-report`,
          HOTLAB: `/api/${API_VERSION}/data-upload/preclinical/toxicity/hotlab`,
        },
      },

      HOTLAB: {
        EXTRACT_HOTLAB_REPORT: `/api/${API_VERSION}/data-upload/hotlab/extract-hotlab-report`,
        SAVE_HOTLAB_REPORT: `/api/${API_VERSION}/data-upload/hotlab/save-hotlab-report`,
      },

      CMC: {
        CLRF: {
          CLRF_DATA: `/api/${API_VERSION}/data-upload/cmc/clrf/clrf-data`,
          HOTLAB: `/api/${API_VERSION}/data-upload/cmc/clrf/hotlab`,
        },

        CONJUGATION: {
          CONJUGATION_DATA: `/api/${API_VERSION}/data-upload/cmc/conjugation/conjugation-data`,
          GEL_IMAGE: `/api/${API_VERSION}/data-upload/cmc/conjugation/gel-image`,
          HOTLAB: `/api/${API_VERSION}/data-upload/cmc/conjugation/hotlab`,
        },

        DIRECT_BINDING_ASSAY: {
          DIRECT_BINDING_ASSAY_DATA: `/api/${API_VERSION}/data-upload/cmc/direct-binding-assay/direct-binding-assay-data`,
          HOTLAB: `/api/${API_VERSION}/data-upload/cmc/direct-binding-assay/hotlab`,
        },

        IRF: {
          IRF_DATA: `/api/${API_VERSION}/data-upload/cmc/irf/irf-data`,
          HOTLAB: `/api/${API_VERSION}/data-upload/cmc/irf/hotlab`,
        },

        RECEPTOR_QUANTIFICATION: {
          RECEPTOR_QUANTIFICATION_DATA: `/api/${API_VERSION}/data-upload/cmc/receptor-quantification/receptor-quantification-data`,
          HOTLAB: `/api/${API_VERSION}/data-upload/cmc/receptor-quantification/hotlab`,
        },
        SATURATION_BINDING_ASSAY: {
          SATURATION_BINDING_ASSAY_DATA: `/api/${API_VERSION}/data-upload/cmc/saturation-binding-assay/saturation-binding-assay-data`,
          HOTLAB: `/api/${API_VERSION}/data-upload/cmc/saturation-binding-assay/hotlab`,
        },
      },

      CHEMISTRY: {
        ELISA: {
          ELISA_DATA: `/api/${API_VERSION}/data-upload/chemistry/elisa/elisa-data`,
          HOTLAB: `/api/${API_VERSION}/data-upload/chemistry/elisa/hotlab`,
        },
        DELFIA: {
          DELFIA_DATA: `/api/${API_VERSION}/data-upload/chemistry/delfia/delfia-data`,
          HOTLAB: `/api/${API_VERSION}/data-upload/chemistry/delfia/hotlab`,
        },
      },
    },
    SPECIALIZATION: {
      DROPDOWN: `/api/${API_VERSION}/specializations/dropdown`,
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

export interface ApiErrorData {
  message?: string;
  details?: unknown;
  errors?: ValidationError[];
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

function createApiError(status: number, data: ApiErrorData): ApiError {
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
      timeout: API_CUSTOM_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // ✅ Get JWT token from sessionStorage
        const token = await getEncryptedItem(SESSION_STORAGE_KEYS.ACCESS_TOKEN);

        if (token && !config.skipAuthToken) {
          // ✅ Check if token is expired before making request
          if (isTokenExpired(token)) {
            logger.warn("[API] JWT token expired, clearing session");

            // Clear all session data
            sessionStorage.clear();

            // Redirect to login page
            window.location.href = "/auth/login";

            // Reject the request
            return Promise.reject(new Error("Token expired"));
          }

          // ✅ Token is valid - attach to Authorization header
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
        // ✅ Handle 401 Unauthorized responses (expired/invalid token on backend)
        if (error.response?.status === 401) {
          logger.warn("[API] Received 401 Unauthorized, clearing session");
          sessionStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        let apiError: ApiError;

        if (error.response) {
          apiError = createApiError(
            error.response.status,
            error.response.data || {}
          );

          // Log API error to Sentry (sanitization happens automatically in Sentry's beforeSend hook)
          logError(apiError, {
            level: error.response.status >= 500 ? "error" : "warning",
            tags: {
              api_error: "true",
              http_status: error.response.status.toString(),
              error_type: "api_response_error",
            },
            context: {
              api: {
                endpoint: error.config?.url || "unknown",
                method: error.config?.method?.toUpperCase() || "unknown",
                status: error.response.status,
                statusText: error.response.statusText,
                // ✅ Sanitized before sending — handles both objects and JSON strings
                responseData: sanitizeSentryData(error.response.data),
                requestData: sanitizeSentryData(error.config?.data),
              },
            },
          });
        } else if (error.request) {
          // Network error - request sent but no response received
          apiError = createApiError(500, {
            message: "Network error - no response received",
          });

          logError(apiError, {
            level: "error",
            tags: {
              api_error: "true",
              error_type: "network_error",
            },
            context: {
              api: {
                endpoint: error.config?.url || "unknown",
                method: error.config?.method?.toUpperCase() || "unknown",
                errorDetails: "No response received from server",
              },
            },
          });
        } else {
          // Request setup error
          apiError = createApiError(500, {
            message: error.message || "An unexpected error occurred",
          });

          logError(apiError, {
            level: "error",
            tags: {
              api_error: "true",
              error_type: "request_setup_error",
            },
            context: {
              api: {
                errorMessage: error.message || "Unknown error",
                errorDetails: "Error occurred while setting up the request",
              },
            },
          });
        }

        return Promise.reject(apiError);
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
