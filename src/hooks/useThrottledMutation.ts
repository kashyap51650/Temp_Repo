import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { logger } from "@/lib/logger";

/**
 * Custom hook that wraps useMutation with request throttling
 *
 * Prevents rapid successive mutation requests by enforcing a minimum delay
 * between calls. Useful for preventing accidental duplicate submissions and
 * protecting against client-side DoS scenarios.
 *
 * @param options - Standard TanStack Query mutation options
 * @param throttleMs - Minimum milliseconds between mutation calls (default: 1000ms)
 * @returns Throttled mutation object
 *
 * @example
 * ```typescript
 * // Basic usage - prevents double-clicks
 * const createExperiment = useThrottledMutation(
 *   {
 *     mutationFn: experimentApi.create,
 *     onSuccess: () => toast.success('Created!'),
 *   },
 *   2000 // 2 second throttle
 * );
 *
 * // In component
 * <Button onClick={() => createExperiment.mutate(data)}>
 *   Create Experiment
 * </Button>
 * ```
 */
export function useThrottledMutation<TData, TError, TVariables, TContext>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
  throttleMs: number = 1000
) {
  const lastCallRef = useRef<number>(0);
  const pendingRef = useRef<boolean>(false);

  return useMutation<TData, TError, TVariables, TContext>({
    ...options,
    mutationFn: async (variables: TVariables) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      // Check if we're within throttle window
      if (timeSinceLastCall < throttleMs && lastCallRef.current !== 0) {
        const remainingTime = Math.ceil(
          (throttleMs - timeSinceLastCall) / 1000
        );

        logger.warn("[Throttled Mutation] Request blocked - too soon", {
          timeSinceLastCall,
          throttleMs,
          remainingTime,
        });

        toast.warning("Please wait before trying again", {
          description: `Wait ${remainingTime} second${remainingTime > 1 ? "s" : ""}`,
          duration: 2000,
        });

        throw new Error(
          `Request throttled. Please wait ${remainingTime} second(s).`
        );
      }

      // Check if already pending
      if (pendingRef.current) {
        logger.warn("[Throttled Mutation] Request blocked - already pending");
        toast.warning("Request in progress", {
          description: "Please wait for the current operation to complete",
          duration: 2000,
        });
        throw new Error("Request already in progress");
      }

      // Mark as pending and update timestamp
      pendingRef.current = true;
      lastCallRef.current = now;

      try {
        // Call the original mutation function
        if (!options.mutationFn) {
          throw new Error("mutationFn is required");
        }
        // @ts-expect-error - TanStack Query's mutationFn signature varies
        const result = await options.mutationFn(variables);
        pendingRef.current = false;
        return result;
      } catch (error) {
        pendingRef.current = false;
        throw error;
      }
    },
  });
}

/**
 * Hook for debouncing mutation calls (delays execution until user stops triggering)
 *
 * Useful for auto-save scenarios or search-as-you-type operations.
 * Unlike throttling (which limits frequency), debouncing waits for a pause.
 *
 * ✅ Properly cancels previous pending Promises when superseded by new calls
 * ✅ Cleans up timers on unmount to prevent memory leaks
 *
 * @param options - Standard TanStack Query mutation options
 * @param debounceMs - Milliseconds to wait after last call (default: 500ms)
 * @returns Debounced mutation object
 *
 * @example
 * ```typescript
 * // Auto-save draft every 500ms after user stops typing
 * const saveDraft = useDebouncedMutation(
 *   {
 *     mutationFn: draftApi.save,
 *     onSuccess: () => toast.success('Draft saved'),
 *   },
 *   500
 * );
 *
 * // In component
 * <Input onChange={(e) => saveDraft.mutate({ content: e.target.value })} />
 * ```
 */
export function useDebouncedMutation<TData, TError, TVariables, TContext>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
  debounceMs: number = 500
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  // ✅ Track the reject function of the currently pending Promise
  const pendingRejectRef = useRef<((reason?: any) => void) | null>(null);

  // ✅ Cleanup function to clear timers on unmount
  useEffect(() => {
    return () => {
      // Cancel any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Reject any pending Promise
      if (pendingRejectRef.current) {
        pendingRejectRef.current(new Error("Component unmounted"));
        pendingRejectRef.current = null;
      }
    };
  }, []);

  return useMutation<TData, TError, TVariables, TContext>({
    ...options,
    mutationFn: async (variables: TVariables) => {
      // ✅ Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // ✅ Reject the previous pending Promise if it exists
      if (pendingRejectRef.current) {
        logger.info("[Debounced Mutation] Cancelling previous pending call");
        pendingRejectRef.current(
          new Error("Debounced: superseded by new call")
        );
        pendingRejectRef.current = null;
      }

      // ✅ Return a new Promise that properly tracks reject for cancellation
      return new Promise((resolve, reject) => {
        // Store reject function so we can cancel this Promise later
        pendingRejectRef.current = reject;

        timeoutRef.current = setTimeout(async () => {
          // Clear the reject reference since this Promise is now executing
          pendingRejectRef.current = null;

          try {
            if (!options.mutationFn) {
              throw new Error("mutationFn is required");
            }
            // @ts-expect-error - TanStack Query's mutationFn signature varies
            const result = await options.mutationFn(variables);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, debounceMs);
      });
    },
  });
}
