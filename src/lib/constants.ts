// Specialization types
export const SPECIALIZATION = {
  HOTLAB: "hotlab",
  PRECLINICAL: "preclinical",
} as const;

// Study types
export const STUDY_TYPE = {
  EFFICACY: "Efficacy",
  BIO_DISTRIBUTION: "Bio Distribution",
  BIODISTRIBUTION: "Biodistribution",
  MODEL_STUDY: "Model Study",
  DOSE_RANGE_FINDING: "Dose Range Finding",
} as const;

export const STUDY_TYPE_CODE = {
  BIO_DISTRIBUTION: "BIO_DISTRIBUTION",
  DOSE_RANGE_FINDING: "DOSE_RANGE_FINDING",
  EFFICACY: "EFFICACY",
  MODEL_STUDY: "MODEL_STUDY",
  TOXICITY: "TOXICITY",
} as const;

export type StudyTypeCode =
  (typeof STUDY_TYPE_CODE)[keyof typeof STUDY_TYPE_CODE];

export const DATA_TYPE = {
  WEIGHT_SHEET: "Weight Sheet",
  CALLIPERING_SHEET: "Callipering Sheet",
  ORGAN_WEIGHT_SHEET: "Organ Weight Sheet",
  AGC_SHEET: "AGC Sheet",
  NECROPSY_SHEET: "Necropsy",
  HEMATOLOGY: "Hematology",
  BLOOD_CHEMISTRY: "Blood Chemistry",
} as const;

// Type definitions for the constants
export type SpecializationType =
  (typeof SPECIALIZATION)[keyof typeof SPECIALIZATION];
export type StudyType = (typeof STUDY_TYPE)[keyof typeof STUDY_TYPE];
export type ExperimentDataType = (typeof DATA_TYPE)[keyof typeof DATA_TYPE];

export const EXPERIMENT_STATUS = {
  PLANNED: "planned",
  COMPLETED: "completed",
  TERMINATED: "terminated",
  CLOSED: "closed",
} as const;

export type ExperimentStatus =
  (typeof EXPERIMENT_STATUS)[keyof typeof EXPERIMENT_STATUS];

export const REACT_QUERY_CONFIG = {
  STALE_TIME_OPTIONS: {
    VERY_SHORT: 1000 * 30, // 30 seconds - for highly dynamic data
    SHORT: 2 * 60 * 1000, // 2 minutes - for frequently changing data
    MEDIUM: 3 * 60 * 1000, // 3 minutes - for moderately stable data
    LONG: 5 * 60 * 1000, // 5 minutes - for stable data
  },
  CACHE_TIME: 1000 * 60 * 10, // 10 minutes in milliseconds
  RETRY: {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
  }, // Number of retry attempts for failed queries
} as const;

// File size constants
export const FILE_SIZE_LIMITS = {
  SMALL_FILE: 5 * 1024 * 1024, // 5MB in bytes
  LARGE_FILE: 10 * 1024 * 1024, // 10MB in bytes
  EXCEL_FILE: 10 * 1024 * 1024, // 10MB in bytes for Excel uploads
} as const;

export interface FileTypeConfig {
  EXTENSIONS: string[];
  MIME_TYPES: string[];
  ACCEPT: string;
  DISPLAY_NAME: string;
}

// File type constants
export const FILE_TYPES = {
  EXCEL: {
    EXTENSIONS: [".xlsx"],
    MIME_TYPES: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    ACCEPT:
      ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    DISPLAY_NAME: "Excel",
  },
  PDF: {
    EXTENSIONS: [".pdf"],
    MIME_TYPES: ["application/pdf"],
    ACCEPT: ".pdf,application/pdf",
    DISPLAY_NAME: "PDF",
  },
} as const satisfies Record<string, FileTypeConfig>;

// Legacy constant for backward compatibility
export const MAX_FILE_SIZE = FILE_SIZE_LIMITS.SMALL_FILE;

export const RANDOMIZATION_PREVIEW_TYPES = {
  VOLUME: "volume",
  BODY_WEIGHT: "body_weight",
} as const;

export const statusOptions = [
  { value: "All Status", label: "All Status" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

export const DEFAULT_RETRY_DELAY = (attemptIndex: number) =>
  Math.min(1000 * 2 ** attemptIndex, 30000);

export const API_CUSTOM_TIMEOUT = 60000;

export const DEFAULT_DEBOUNCE_DELAY = 500;

export const ORGAN_KEYS = {
  INJECTION_TIME: "Pb-212 Injection time",
  NECROPSY_TIME: "Necropsy time",
};

export const DEFAULT_PAGE_SIZE = 10;

export const SELECT_ALL = "all";

export const DataValidationFilter = {
  Status: "status",
  DataType: "data_type",
  StudyType: "study_type",
} as const;

export type DataValidationFilter =
  (typeof DataValidationFilter)[keyof typeof DataValidationFilter];

export const STUDY_TYPE_COLORS = [
  "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200",
  "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
  "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
  "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200",
  "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200",
] as const;

export const MAX_BODY_WEIGHT_GRAMS = 1000;
export const CUSTOM_EVENTS = {
  TOKEN_CHANGE: "tokenChange",
};

export const SESSION_STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;

export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: "connect", // Socket connected
  DISCONNECT: "disconnect", // Socket disconnected
  CONNECT_ERROR: "connect_error", // Connection error occurred
  RECONNECT_ATTEMPT: "reconnect_attempt", // Attempting to reconnect
  RECONNECT_FAILED: "reconnect_failed", // Reconnection failed
  RECONNECT: "reconnect", // Successfully reconnected

  // Error
  ERROR: "error", // General socket error

  // Notification events
  NOTIFICATION_NEW: "notification:new", // New notification received
  NOTIFICATION_READ: "notification:read", // Notification marked as read
  NOTIFICATION_UNREAD_COUNT: "notification:unread_count", // Unread count update
  NOTIFICATION_DELETE: "notification:delete", // Notification deleted

  // User activity events
  USER_ONLINE: "user:online", // User came online
  USER_OFFLINE: "user:offline", // User went offline

  // Data upload events
  DATA_UPLOAD: "data:upload", // New data uploaded
} as const;

export const SOCKET_CONFIG = {
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
} as const;
