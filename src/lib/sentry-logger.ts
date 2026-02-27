import * as Sentry from "@sentry/react";

export type SentryLevel = Sentry.SeverityLevel;

export interface SentryUser {
  id?: string;
  email?: string;
  role?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface SentryContext {
  [key: string]: unknown;
}

export interface SentryBreadcrumb {
  message: string;
  category?: string;
  level?: SentryLevel;
  data?: Record<string, unknown>;
  timestamp?: number;
}

/**
 * Options for logging errors with Sentry
 */
export interface LogErrorOptions {
  level?: SentryLevel;
  tags?: Record<string, string | number | boolean>;
  context?: SentryContext;
}

/**
 * List of sensitive field names that should be redacted in Sentry logs
 */
const SENSITIVE_FIELD_PATTERNS = [
  "password", // NOSONAR - This is a field name, not a hardcoded password
  "currentPassword", // NOSONAR - This is a field name, not a hardcoded password
  "newPassword", // NOSONAR - This is a field name, not a hardcoded password
  "confirmPassword", // NOSONAR - This is a field name, not a hardcoded password
  "token",
  "accessToken",
  "refreshToken",
  "authorization",
  "secret",
  "apiKey",
  "privateKey",
  "sessionId",
  "jwt",
];

/**
 * Helper function to sanitize a string that might contain JSON
 * only attempts JSON.parse on strings that look like JSON
 *
 * @param str - String to sanitize
 * @returns Sanitized string (re-stringified if it was valid JSON, otherwise as-is)
 */
function sanitizeStringValue(str: string): string {
  const trimmed = str.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(str);
      const sanitized = sanitizeSentryData(parsed);
      return JSON.stringify(sanitized);
    } catch {
      // Not valid JSON despite looking like it - return as-is
      return str;
    }
  }
  // Plain string - return as-is without parsing attempt
  return str;
}

/**
 * Recursively sanitize sensitive data from objects before sending to Sentry
 * Replaces sensitive field values with "[REDACTED]" to prevent data leaks
 *
 * @param data - Data to sanitize (can be object, array, or primitive)
 * @returns Sanitized data with sensitive fields redacted
 */
export function sanitizeSentryData(data: unknown): unknown {
  // Handle JSON strings (e.g., Axios post-transform request bodies)
  if (typeof data === "string") {
    return sanitizeStringValue(data);
  }

  if (!data || typeof data !== "object") {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeSentryData(item));
  }

  // Handle objects
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();

    // Check if field name matches any sensitive pattern
    const isSensitive = SENSITIVE_FIELD_PATTERNS.some((pattern) =>
      lowerKey.includes(pattern.toLowerCase())
    );

    if (isSensitive) {
      sanitized[key] = "[REDACTED]";
    } else if (value && typeof value === "object") {
      // Recursively sanitize nested objects/arrays
      sanitized[key] = sanitizeSentryData(value);
    } else if (typeof value === "string") {
      // Handle nested JSON strings (e.g., stringified request bodies within objects)
      sanitized[key] = sanitizeStringValue(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sentry initialization configuration options
 */
export interface SentryInitOptions {
  /** Sentry DSN (Data Source Name) - required for Sentry to work */
  dsn?: string;
  /** Environment name (development, staging, production) */
  environment?: string;
  /** Application version/release identifier */
  release?: string;
  /** Percentage of transactions to trace (0.0 to 1.0) */
  tracesSampleRate?: number;
  /** Percentage of error sessions to replay (0.0 to 1.0) */
  replaysOnErrorSampleRate?: number;
  /** Percentage of normal sessions to replay (0.0 to 1.0) */
  replaysSessionSampleRate?: number;
  /** Enable debug mode (logs to console) */
  debug?: boolean;
}

export function initSentry(options: SentryInitOptions = {}): void {
  const {
    dsn = import.meta.env.VITE_SENTRY_DSN,
    environment = import.meta.env.VITE_APP_ENV || "development",
    release = import.meta.env.VITE_APP_VERSION,
    tracesSampleRate = 1,
    replaysOnErrorSampleRate = 1.0,
    replaysSessionSampleRate = 0.1,
    debug = false,
  } = options;

  // Skip initialization if no DSN provided
  if (!dsn) {
    console.warn("⚠️ Sentry DSN not provided. Error tracking is disabled.");
    return;
  }

  Sentry.init({
    dsn,
    environment,
    release,
    debug,

    // Performance Monitoring
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],

    // Performance sampling rates
    tracesSampleRate,
    replaysOnErrorSampleRate,
    replaysSessionSampleRate,

    // Filter out known non-critical errors and sanitize sensitive data
    beforeSend(event) {
      // Don't send events when running on localhost (local development)
      const hostname = window.location.hostname;
      if (hostname === "localhost" || hostname === "127.0.0.1") {
        return null;
      }

      // Filter out specific known errors
      if ((event?.exception?.values?.length ?? 0) > 0) {
        const { value: errorMessage, type: errorType } =
          event.exception?.values?.[0] || {};

        // Filter: Browser extension conflicts (Guardian, etc.)
        if (
          errorMessage?.includes(
            "Identifier 'originalOpen' has already been declared"
          ) &&
          errorType === "SyntaxError"
        ) {
          return null;
        }

        // Filter: ResizeObserver loop errors (common browser issue)
        if (
          errorMessage?.includes("ResizeObserver loop") ||
          errorMessage?.includes("ResizeObserver loop limit exceeded")
        ) {
          return null;
        }

        // Filter: Network errors from browser extensions
        if (
          errorMessage?.includes("Extension context invalidated") ||
          errorMessage?.includes("chrome-extension://")
        ) {
          return null;
        }
      }

      // Sanitize sensitive data in event contexts
      if (event.contexts) {
        event.contexts = sanitizeSentryData(event.contexts) as Sentry.Contexts;
      }

      // Sanitize extra data
      if (event.extra) {
        event.extra = sanitizeSentryData(event.extra) as Sentry.Contexts;
      }

      // Sanitize breadcrumbs data
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => ({
          ...breadcrumb,
          data: breadcrumb.data
            ? (sanitizeSentryData(breadcrumb.data) as Record<string, unknown>)
            : breadcrumb.data,
        }));
      }

      return event;
    },

    // Ignore specific URLs (browser extensions, etc.)
    ignoreErrors: [
      // Browser extension errors
      "top.GLOBALS",
      "originalPrompt",
      "canvas.contentDocument",
      "MyApp_RemoveAllHighlights",
      "Can't find variable: ZiteReader",
      "jigsaw is not defined",
      "ComboSearch is not defined",
      "atomicFindClose",
      // React internal errors that are usually false positives
      "ChunkLoadError",
      "Loading chunk",
    ],
  });

  // Initialize logger utility with app metadata
  initSentryLogger();
}

function isSentryAvailable(): boolean {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  return (
    typeof Sentry !== "undefined" &&
    typeof dsn === "string" &&
    dsn.trim() !== "" &&
    Sentry.getClient() !== undefined
  );
}

export function logError(
  error: Error | string,
  options?: LogErrorOptions
): void {
  if (!isSentryAvailable()) {
    console.error("Sentry not available:", error, options);
    return;
  }

  const { level = "error", tags, context } = options || {};

  Sentry.withScope((scope) => {
    scope.setLevel(level);

    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context) {
      scope.setContext("additional_info", context);
    }

    if (typeof error === "string") {
      Sentry.captureMessage(error, level);
    } else {
      Sentry.captureException(error);
    }
  });
}

export function logWarning(message: string, context?: SentryContext): void {
  if (!isSentryAvailable()) {
    console.warn("Sentry not available:", message, context);
    return;
  }

  Sentry.withScope((scope) => {
    scope.setLevel("warning");

    if (context) {
      scope.setContext("warning_context", context);
    }

    Sentry.captureMessage(message, "warning");
  });
}

export function logInfo(message: string, context?: SentryContext): void {
  if (!isSentryAvailable()) {
    console.info("Sentry not available:", message, context);
    return;
  }

  Sentry.withScope((scope) => {
    scope.setLevel("info");

    if (context) {
      scope.setContext("info_context", context);
    }

    Sentry.captureMessage(message, "info");
  });
}

export function logDebug(message: string, context?: SentryContext): void {
  if (!isSentryAvailable()) {
    console.debug("Sentry not available:", message, context);
    return;
  }

  Sentry.withScope((scope) => {
    scope.setLevel("debug");

    if (context) {
      scope.setContext("debug_context", context);
    }

    Sentry.captureMessage(message, "debug");
  });
}

export function setUserContext(user: SentryUser | null): void {
  if (!isSentryAvailable()) {
    console.debug("Sentry not available");
    return;
  }

  if (user === null) {
    Sentry.setUser(null);
  } else {
    Sentry.setUser(user);
  }
}

export function clearUserContext(): void {
  setUserContext(null);
}

/**
 * Add a breadcrumb to Sentry
 *
 * Breadcrumbs are a trail of events that happened prior to an error,
 * helping you understand the context leading up to the issue.
 *
 * @param breadcrumb - Breadcrumb configuration
 *
 * @example
 * ```typescript
 * addBreadcrumb({
 *   message: "User navigated to settings page",
 *   category: "navigation",
 *   level: "info",
 *   data: { from: "/dashboard", to: "/settings" }
 * });
 *
 * addBreadcrumb({
 *   message: "API request started",
 *   category: "http",
 *   level: "info",
 *   data: {
 *     url: "/api/experiments",
 *     method: "GET"
 *   }
 * });
 * ```
 */
export function addBreadcrumb(breadcrumb: SentryBreadcrumb): void {
  if (!isSentryAvailable()) {
    console.debug("Sentry not available - cannot add breadcrumb:", breadcrumb);
    return;
  }

  Sentry.addBreadcrumb({
    message: breadcrumb.message,
    category: breadcrumb.category || "custom",
    level: breadcrumb.level || "info",
    data: breadcrumb.data,
    timestamp: breadcrumb.timestamp || Date.now() / 1000,
  });
}

export function setContext(key: string, value: SentryContext): void {
  if (!isSentryAvailable()) {
    console.debug("Sentry not available - cannot set context:", key, value);
    return;
  }

  Sentry.setContext(key, value);
}

export function setTag(key: string, value: string | number | boolean): void {
  if (!isSentryAvailable()) {
    console.debug("Sentry not available - cannot set tag:", key, value);
    return;
  }

  Sentry.setTag(key, value);
}

export function setTags(tags: Record<string, string | number | boolean>): void {
  if (!isSentryAvailable()) {
    console.debug("Sentry not available - cannot set tags:", tags);
    return;
  }

  Sentry.setTags(tags);
}

export function initSentryLogger(): void {
  if (isSentryAvailable()) {
    setTags({
      app_version: import.meta.env.VITE_APP_VERSION || "unknown",
      environment: import.meta.env.VITE_APP_ENV || "development",
    });
  } else {
    console.warn("⚠️ Sentry is not available");
  }
}
