import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  type CreateExperimentPayload,
  type CreateExperimentResponse,
  experimentApi,
} from "@/api";
import { type ApiError } from "@/lib/api";
import { logger } from "@/lib/logger";

import { useThrottledMutation } from "./useThrottledMutation";

export interface UseCreateExperimentProps {
  onSuccess?: (data: CreateExperimentResponse["data"]) => void;
  onError?: (error: Error) => void;
}

export interface UseCreateExperimentReturn {
  createExperiment: (
    payload: CreateExperimentPayload
  ) => Promise<CreateExperimentResponse["data"] | null>;
  isCreating: boolean;
  error: string | null;
}

/**
 * Hook for creating experiments with throttling protection
 *
 * Prevents duplicate experiment creation by enforcing a 3-second throttle
 * between creation requests. Automatically invalidates related queries and
 * provides user feedback via toast notifications.
 *
 * @param props - Optional success/error callbacks
 * @returns Throttled mutation hook with createExperiment function
 *
 * @example
 * ```tsx
 * const { createExperiment, isCreating } = useCreateExperiment({
 *   onSuccess: (experiment) => navigate(`/experiments/${experiment.id}`)
 * });
 *
 * // In form submit - protected from double-clicks
 * <Button
 *   onClick={() => createExperiment(formData)}
 *   disabled={isCreating}
 * >
 *   Create Experiment
 * </Button>
 * ```
 */
export const useCreateExperiment = (
  props?: UseCreateExperimentProps
): UseCreateExperimentReturn => {
  const queryClient = useQueryClient();

  const createMutation = useThrottledMutation(
    {
      mutationFn: (payload: CreateExperimentPayload) =>
        experimentApi.createExperiment(payload),
      retry: 0,
      onSuccess: (response) => {
        if (response.success && response.data) {
          // ✅ Invalidate related queries to refresh data
          queryClient.invalidateQueries({ queryKey: ["experiments"] });
          queryClient.invalidateQueries({ queryKey: ["experiments-dropdown"] });

          toast.success("Experiment created successfully", {
            description: `"${response.data.experiment_name}" has been created`,
          });

          props?.onSuccess?.(response.data);
        } else {
          const errorMessage =
            response.message || "Failed to create experiment";
          toast.error("Failed to create experiment", {
            description: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },
      onError: (error: unknown) => {
        // Cast error to ApiError type for proper handling
        const apiError = error as ApiError;
        logger.error("Error creating experiment:", apiError);

        // ✅ Show toast notification to user
        const errorMessage = apiError.message || "Failed to create experiment";
        toast.error("Failed to create experiment", {
          description: errorMessage,
        });

        // Cast error to Error type for callback
        props?.onError?.(
          apiError instanceof Error ? apiError : new Error(String(apiError))
        );
      },
    },
    3000 // ✅ 3 second throttle - prevents duplicate experiment creation
  );

  const createExperiment = async (
    payload: CreateExperimentPayload
  ): Promise<CreateExperimentResponse["data"] | null> => {
    try {
      const response = await createMutation.mutateAsync(payload);
      return response.success ? response.data : null;
    } catch (error) {
      logger.error("Error creating experiment:", error);
      return null;
    }
  };

  return {
    createExperiment,
    isCreating: createMutation.isPending,
    error: (createMutation.error as ApiError)?.message || null,
  };
};
