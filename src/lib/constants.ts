// Demo login credentials for development and testing
export const DEMO_CREDENTIALS = {
  ADMIN: {
    email: "admin@oranomed.com",
    password: "admin@123",
    role: "Admin",
  },
  DATA_UPLOADER: {
    email: "jaiman@simformsolutions.com",
    password: "Admin@123",
    role: "Data Uploader",
  },
  SCIENTIST: {
    email: "jay.sheth@simformsolutions.com",
    password: "Admin@123",
    role: "Scientist",
  },
} as const;

export const DEMO_ACCOUNTS = [
  DEMO_CREDENTIALS.ADMIN,
  DEMO_CREDENTIALS.DATA_UPLOADER,
  DEMO_CREDENTIALS.SCIENTIST,
] as const;

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
  RETRY: 1, // Number of retry attempts for failed queries
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
