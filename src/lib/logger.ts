/**
 * Centralized logging utility for the application
 *
 * Provides consistent logging across development and production environments.
 * In production, console logging is disabled (silent); errors are sent to Sentry only.
 * In development, all log levels output to console for debugging.
 *
 * @example
 * ```typescript
 * import { logger } from '@/lib/logger';
 *
 * logger.debug('User data:', userData); // Console output in development only
 * logger.info('Operation completed'); // Console output in development only
 * logger.warn('Deprecated API used'); // Console output in development only
 * logger.error('Failed to save', error); // Console in dev, sent to Sentry in production
 * ```
 */

/**
 * Safely serialize a value to string, handling circular references and non-serializable types
 * @param value - Value to serialize
 * @returns String representation of the value
 */
function safeStringify(value: unknown): string {
  try {
    // Handle primitives
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean")
      return String(value);
    if (value === null) return "null";
    if (value === undefined) return "undefined";

    // Handle BigInt (can't use JSON.stringify)
    if (typeof value === "bigint") return `${value}n`;

    // Handle Error objects
    if (value instanceof Error) {
      return `${value.name}: ${value.message}\n${value.stack || ""}`;
    }

    // Try JSON.stringify with circular reference detection
    return JSON.stringify(value, (_key, val) => {
      // Handle circular references
      if (val instanceof Object && val !== null) {
        // Mark this object as visited
        if (seen.has(val)) {
          return "[Circular Reference]";
        }
        seen.add(val);
      }

      // Handle BigInt in nested objects
      if (typeof val === "bigint") {
        return `${val}n`;
      }

      return val;
    });
  } catch (error) {
    // Fallback for any serialization errors
    console.error(error);
    return String(value);
  }
}

// Track visited objects for circular reference detection
let seen = new WeakSet();

const isDevelopment = import.meta.env.DEV;

export const logger = {
  /**
   * Debug-level logging - only visible in development
   * Use for detailed debugging information
   */
  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      console.debug("[DEBUG]", ...args);
    }
  },

  /**
   * Info-level logging - only visible in development
   * Use for general informational messages
   */
  info: (...args: unknown[]) => {
    if (isDevelopment) {
      console.info("[INFO]", ...args);
    }
  },

  /**
   * Warning-level logging - only visible in development
   * Use for non-critical issues that should be addressed
   */
  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      console.warn("[WARN]", ...args);
    }
  },

  /**
   * Error-level logging - visible in development, sent to Sentry in production
   * Use for errors and exceptions
   *
   * ✅ Safely serializes all arguments (handles circular refs, BigInt, etc.)
   * ✅ Captures any Error instances in arguments (not just first arg)
   */
  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error("[ERROR]", ...args);
    }

    // Send to Sentry in production
    if (!isDevelopment && typeof window !== "undefined" && window.Sentry) {
      try {
        // Reset circular reference tracker for this error
        seen = new WeakSet();

        // ✅ Store Sentry reference to avoid type narrowing issues in callbacks
        const sentry = window.Sentry;

        // ✅ Find all Error instances in arguments (not just first one)
        const errors = args.filter((arg): arg is Error => arg instanceof Error);
        const nonErrors = args.filter((arg) => !(arg instanceof Error));

        if (errors.length > 0) {
          // ✅ Capture first Error with context
          sentry.captureException(errors[0], {
            extra: {
              // Include all additional errors
              additionalErrors: errors.slice(1).map((err) => ({
                name: err.name,
                message: err.message,
                stack: err.stack,
              })),
              // ✅ Safely serialize non-error arguments
              additionalArgs: nonErrors.map((arg) => safeStringify(arg)),
            },
          });

          // ✅ Capture any additional errors as separate exceptions
          errors.slice(1).forEach((error) => {
            sentry.captureException(error, {
              extra: {
                context: "Additional error from same logger.error call",
              },
            });
          });
        } else {
          // ✅ No Error objects - capture as message with safe serialization
          const message = args.map((arg) => safeStringify(arg)).join(" ");

          sentry.captureMessage(message, {
            level: "error",
            extra: {
              // ✅ Include original args safely serialized
              args: args.map((arg) => safeStringify(arg)),
            },
          });
        }
      } catch (sentryError) {
        // ✅ Prevent logger from throwing - log to console as fallback (development only)
        if (isDevelopment) {
          console.error("[ERROR] Failed to send error to Sentry:", sentryError);
        }
      }
    }
  },
};

// Make Sentry type available globally
declare global {
  interface Window {
    Sentry?: {
      captureException: (
        error: Error,
        context?: { extra?: Record<string, unknown> }
      ) => void;
      captureMessage: (
        message: string,
        context?: { level?: string; extra?: Record<string, unknown> }
      ) => void;
    };
  }
}
