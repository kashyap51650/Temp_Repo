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
} as const;

export const DATA_TYPE = {
  WEIGHT_SHEET: "Weight Sheet",
  CALLIPERING_SHEET: "Callipering Sheet",
  ORGAN_WEIGHT_SHEET: "Organ Weight Sheet",
  AGC_SHEET: "AGC Sheet",
} as const;

// Type definitions for the constants
export type SpecializationType =
  (typeof SPECIALIZATION)[keyof typeof SPECIALIZATION];
export type StudyType = (typeof STUDY_TYPE)[keyof typeof STUDY_TYPE];

export const REACT_QUERY_CONFIG = {
  STALE_TIME_OPTIONS: {
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

// File type constants
export const FILE_TYPES = {
  EXCEL: {
    EXTENSIONS: [".xlsx"],
    MIME_TYPES: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    ACCEPT:
      ".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
} as const;

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
