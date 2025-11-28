// Demo login credentials for development and testing
export const DEMO_CREDENTIALS = {
  ADMIN: {
    email: "admin@oranomed.com",
    password: "SecurePass123!",
    role: "Admin",
  },
  DATA_UPLOADER: {
    email: "uploader@oranomed.com",
    password: "SecurePass123!",
    role: "Data Uploader",
  },
  SCIENTIST: {
    email: "scientist@oranomed.com",
    password: "SecurePass123!",
    role: "Scientist",
  },
} as const;

export const DEMO_ACCOUNTS = [
  DEMO_CREDENTIALS.ADMIN,
  DEMO_CREDENTIALS.DATA_UPLOADER,
  DEMO_CREDENTIALS.SCIENTIST,
] as const;

export const REACT_QUERY_CONFIG = {
  STALE_TIME: 1000 * 60 * 5, // 5 minutes in milliseconds
  CACHE_TIME: 1000 * 60 * 10, // 10 minutes in milliseconds
} as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
