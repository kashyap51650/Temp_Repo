import { useEffect } from "react";

import { SESSION_STORAGE_KEYS } from "@/lib/constants";
import { logger } from "@/lib/logger";

/**
 * Configuration for tab close cleanup behavior
 */
export interface TabCloseCleanupConfig {
  /** Whether to clear sessionStorage on tab close (default: true) */
  clearSessionStorage?: boolean;
  /** Whether to clear on page refresh (default: false - preserve session on refresh) */
  clearOnRefresh?: boolean;
  /** Custom cleanup callback */
  onCleanup?: () => void;
}

/**
 * Hook for cleaning up session data when browser tab closes
 *
 * Automatically clears sessionStorage when the user closes the browser tab
 * or window. Preserves session on page refresh by default to maintain user
 * experience during development and normal navigation.
 *
 * @param config - Configuration options for cleanup behavior
 *
 * @example
 * ```tsx
 * // In App.tsx or root layout
 * function App() {
 *   useTabCloseCleanup({
 *     clearSessionStorage: true,
 *     clearOnRefresh: false, // Keep session on refresh
 *     onCleanup: () => {
 *       // perform cleanup
 *     }
 *   });
 *
 *   return <RouterProvider router={router} />;
 * }
 * ```
 */
export function useTabCloseCleanup(config: TabCloseCleanupConfig = {}) {
  const {
    clearSessionStorage = true,
    clearOnRefresh = false,
    onCleanup,
  } = config;

  useEffect(() => {
    /**
     * Detect if current navigation is a page refresh
     * Uses modern Navigation Timing API (replaces deprecated performance.navigation)
     */
    const isPageRefresh = (): boolean => {
      try {
        // ✅ Modern API: performance.getEntriesByType('navigation')
        const navEntry = performance.getEntriesByType("navigation")[0] as
          | PerformanceNavigationTiming
          | undefined;

        if (navEntry) {
          // type can be: 'navigate', 'reload', 'back_forward', 'prerender'
          return navEntry.type === "reload";
        }

        // ⚠️ Fallback for older browsers (still supported but deprecated)
        if (window.performance?.navigation?.type !== undefined) {
          return window.performance.navigation.type === 1; // TYPE_RELOAD
        }

        // If neither API is available, assume it's NOT a refresh (safer default)
        return false;
      } catch (error) {
        logger.warn(
          "[Tab Close Cleanup] Error detecting navigation type:",
          error
        );
        return false;
      }
    };

    /**
     * Handle page unload (tab close, window close, navigation away)
     * Unified handler that checks all conditions before clearing session
     */
    const handlePageUnload = () => {
      const isRefresh = isPageRefresh();

      // ✅ Skip cleanup if it's a refresh AND clearOnRefresh is disabled
      if (isRefresh && !clearOnRefresh) {
        logger.info(
          "[Tab Close Cleanup] Page refresh detected - preserving session"
        );
        return;
      }

      // ✅ Only clear if user has an active session (has token)
      const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.ACCESS_TOKEN);

      if (!token) {
        logger.info("[Tab Close Cleanup] No active session - skipping cleanup");
        return;
      }

      // ✅ Clear session storage if configured
      if (clearSessionStorage) {
        const action = isRefresh ? "page refresh" : "tab close";
        logger.info(
          `[Tab Close Cleanup] Clearing session storage on ${action}`
        );
        sessionStorage.clear();
      }

      // ✅ Call custom cleanup handler if provided
      if (onCleanup) {
        onCleanup();
      }
    };

    // ✅ Use only visibilitychange + pagehide for reliable tab close detection
    // visibilitychange fires when tab becomes hidden (more reliable than beforeunload)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // User switched tabs or minimized browser - don't clear immediately
        // Only clear on actual unload (pagehide event)
      }
    };

    // ✅ pagehide is the most reliable event for tab close/navigation
    // Fires when the page is about to be unloaded from memory
    const handlePageHide = (event: PageTransitionEvent) => {
      // event.persisted indicates if page is being cached (back/forward navigation)
      // If page is cached, we might want to preserve session for back navigation
      if (!event.persisted) {
        handlePageUnload();
      }
    };

    // Add event listeners
    // Note: visibilitychange is optional, mainly for logging/debugging
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    logger.info("[Tab Close Cleanup] Initialized", {
      clearSessionStorage,
      clearOnRefresh,
    });

    // Cleanup function
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [clearSessionStorage, clearOnRefresh, onCleanup]);
}
