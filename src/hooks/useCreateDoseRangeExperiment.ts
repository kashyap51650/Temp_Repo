import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { doseRangeFindingExperimentApi } from "@/lib/api";
import type {
  CreateDoseRangeFindingPayload,
  CreateDoseRangeFindingResponse,
} from "@/types/doseRangeFinding";

interface UseCreateDoseRangeExperimentOptions {
  onSuccess?: (data: CreateDoseRangeFindingResponse) => void;
  onError?: (error: Error) => void;
}

export function useCreateDoseRangeExperiment(
  options?: UseCreateDoseRangeExperimentOptions
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateDoseRangeFindingPayload) =>
      await doseRangeFindingExperimentApi.createDoseRangeExperiment(payload),
    onSuccess: (data: CreateDoseRangeFindingResponse) => {
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
      queryClient.invalidateQueries({ queryKey: ["experiments-dropdown"] });

      if (data?.data) {
        toast.success("Dose Range Finding Experiment Created", {
          description: `${data?.data?.experiment_name} has been created successfully.`,
        });

        options?.onSuccess?.(data);
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to Create Experiment", {
        description:
          error.message ||
          "An error occurred while creating the dose range finding experiment.",
      });

      options?.onError?.(error);
    },
  });

  return {
    createExperiment: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
