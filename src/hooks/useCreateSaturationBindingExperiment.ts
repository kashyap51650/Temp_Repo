import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { saturationBindingExperimentApi } from "@/api";
import type {
  CreateSaturationBindingExperimentPayload,
  CreateSaturationBindingExperimentResponse,
} from "@/types/saturationBindingExperiment";

interface UseCreateSaturationBindingExperimentOptions {
  onSuccess?: (data: CreateSaturationBindingExperimentResponse) => void;
  onError?: (error: Error) => void;
}

export function useCreateSaturationBindingExperiment(
  options?: UseCreateSaturationBindingExperimentOptions
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateSaturationBindingExperimentPayload) =>
      await saturationBindingExperimentApi.createSaturationBindingExperiment(
        payload
      ),
    onSuccess: (data: CreateSaturationBindingExperimentResponse) => {
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
      queryClient.invalidateQueries({ queryKey: ["experiments-dropdown"] });

      if (data?.data) {
        toast.success("Saturation Binding Experiment Created", {
          description: `${data?.data?.experiment_name} has been created successfully.`,
        });

        options?.onSuccess?.(data);
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to Create Experiment", {
        description:
          error.message ||
          "An error occurred while creating the Saturation Binding experiment.",
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
