import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

import { SESSION_STORAGE_KEYS } from "@/lib/constants";
import { logger } from "@/lib/logger";

/**
 * Configuration for session timeout behavior
 */
export interface SessionTimeoutConfig {
  /** Timeout duration in milliseconds (default: 30 minutes) */
  timeoutMs?: number;
  /** Warning duration before timeout in milliseconds (default: 2 minutes) */
  warningMs?: number;
  /** Callback when session times out */
  onTimeout?: () => void;
  /** Callback when warning is shown */
  onWarning?: () => void;
}

const DEFAULT_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const DEFAULT_WARNING_MS = 2 * 60 * 1000; // 2 minutes before timeout

/**
 * Hook for automatic session timeout with inactivity detection
 *
 * Automatically logs user out after a period of inactivity. Shows a warning
 * toast notification before timeout. Resets timer on any user interaction
 * (mouse movement, keyboard, clicks, touch).
 *
 * @param config - Configuration options for timeout behavior
 *
 * @example
 * ```tsx
 * // In root layout or App.tsx
 * function DashboardLayout() {
 *   useSessionTimeout({
 *     timeoutMs: 30 * 60 * 1000, // 30 minutes
 *     warningMs: 2 * 60 * 1000,  // 2 minute warning
 *     onTimeout: () => {
 *       // Custom logout logic
 *       dispatch(logout());
 *       navigate('/login');
 *     }
 *   });
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useSessionTimeout(config: SessionTimeoutConfig = {}) {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    warningMs = DEFAULT_WARNING_MS,
    onTimeout,
    onWarning,
  } = config;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const warningRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const lastActivityRef = useRef<number>(Date.now());
  const warningShownRef = useRef<boolean>(false);

  /**
   * Handle session timeout - clear session and redirect to login
   */
  const handleTimeout = useCallback(() => {
    logger.warn("[Session Timeout] User session expired due to inactivity");

    // Clear session storage
    sessionStorage.clear();

    // Show toast notification
    toast.error("Session Expired", {
      description:
        "Your session has expired due to inactivity. Please log in again.",
      duration: 5000,
    });

    // Call custom timeout handler if provided
    if (onTimeout) {
      onTimeout();
    } else {
      // Default: redirect to login with reason
      window.location.href = "/login?reason=session_timeout";
    }
  }, [onTimeout]);

  /**
   * Show warning toast before timeout
   */
  const showWarning = useCallback(() => {
    if (warningShownRef.current) return;

    warningShownRef.current = true;
    const remainingMinutes = Math.ceil(warningMs / 1000 / 60);

    logger.info(
      `[Session Timeout] Warning shown - ${remainingMinutes} minutes remaining`
    );

    // Show warning toast with action to extend session
    toast.warning("Session Expiring Soon", {
      description: `Your session will expire in ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""} due to inactivity. Click to stay logged in.`,
      duration: warningMs,
      action: {
        label: "Stay Logged In",
        onClick: () => {
          logger.info('[Session Timeout] User clicked "Stay Logged In"');
          warningShownRef.current = false;
          resetTimer();
        },
      },
    });

    // Call custom warning handler if provided
    if (onWarning) {
      onWarning();
    }
  }, [warningMs, onWarning]);

  /**
   * Reset inactivity timer
   */
  const resetTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    // Reset warning flag
    warningShownRef.current = false;

    // Update last activity timestamp
    lastActivityRef.current = Date.now();

    // ✅ Validate warning timing configuration
    // Warning must be shown BEFORE timeout (warningMs < timeoutMs)
    // If invalid, skip warning and only set timeout
    const warningDelay = timeoutMs - warningMs;

    if (warningDelay > 0 && warningMs < timeoutMs) {
      // ✅ Valid configuration - set warning timer
      warningRef.current = setTimeout(() => {
        showWarning();
      }, warningDelay);
    } else {
      // ⚠️ Invalid configuration - log warning and skip warning toast
      logger.warn(
        "[Session Timeout] Invalid configuration: warningMs must be less than timeoutMs",
        {
          warningMs,
          timeoutMs,
          warningDelay,
        }
      );
    }

    // Set timeout timer (always runs regardless of warning validity)
    timeoutRef.current = setTimeout(() => {
      handleTimeout();
    }, timeoutMs);
  }, [timeoutMs, warningMs, handleTimeout, showWarning]);

  /**
   * Handle user activity events
   */
  const handleActivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;

    // Only reset timer if more than 1 second has passed (debounce)
    if (timeSinceLastActivity > 1000) {
      resetTimer();
    }
  }, [resetTimer]);

  useEffect(() => {
    // Check if user is logged in (has token)
    const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      logger.info("[Session Timeout] No token found, skipping timeout setup");
      return;
    }

    logger.info("[Session Timeout] Initializing session timeout", {
      timeoutMinutes: timeoutMs / 1000 / 60,
      warningMinutes: warningMs / 1000 / 60,
    });

    // Start timer
    resetTimer();

    // Activity event listeners
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    // Add event listeners with passive option for performance
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Cleanup function
    return () => {
      // Remove event listeners
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });

      // Clear timers
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }

      logger.info("[Session Timeout] Cleanup completed");
    };
  }, [timeoutMs, warningMs, resetTimer, handleActivity]);

  // Return control functions for advanced usage
  return {
    resetTimer,
    lastActivity: lastActivityRef.current,
  };
}
