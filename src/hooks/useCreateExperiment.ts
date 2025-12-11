import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  type CreateExperimentPayload,
  type CreateExperimentResponse,
  experimentApi,
  handleApiError,
} from "../lib/api";

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

export const useCreateExperiment = (
  props?: UseCreateExperimentProps
): UseCreateExperimentReturn => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateExperimentPayload) =>
      experimentApi.createExperiment(payload),
    retry: 0,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate related queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["experiments"] });
        queryClient.invalidateQueries({ queryKey: ["experiments-dropdown"] });

        toast.success("Experiment created successfully", {
          description: `"${response.data.experiment_name}" has been created`,
        });

        props?.onSuccess?.(response.data);
      } else {
        const errorMessage = response.message || "Failed to create experiment";
        toast.error("Failed to create experiment", {
          description: errorMessage,
        });
        throw new Error(errorMessage);
      }
    },
    onError: (error) => {
      console.error("Error creating experiment:", error);
      const errorMessage = handleApiError(error, "Failed to create experiment");
      toast.error("Failed to create experiment", {
        description: errorMessage,
      });
      props?.onError?.(error);
    },
  });

  const createExperiment = async (
    payload: CreateExperimentPayload
  ): Promise<CreateExperimentResponse["data"] | null> => {
    try {
      const response = await createMutation.mutateAsync(payload);
      return response.success ? response.data : null;
    } catch (error) {
      console.error("Error creating experiment:", error);
      return null;
    }
  };

  return {
    createExperiment,
    isCreating: createMutation.isPending,
    error: createMutation.error?.message || null,
  };
};
