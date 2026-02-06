import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { directBindingAssayExperimentApi } from "@/api";
import type {
  CreateDirectBindingAssayExperimentPayload,
  CreateDirectBindingAssayExperimentResponse,
} from "@/types/directBindingAssay";

interface UseCreateDirectBindingAssayOptions {
  onSuccess?: (data: CreateDirectBindingAssayExperimentResponse) => void;
  onError?: (error: Error) => void;
}

export function useCreateDirectBindingAssay(
  options?: UseCreateDirectBindingAssayOptions
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateDirectBindingAssayExperimentPayload) =>
      await directBindingAssayExperimentApi.createDirectBindingAssayExperiment(
        payload
      ),
    onSuccess: (data: CreateDirectBindingAssayExperimentResponse) => {
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
      queryClient.invalidateQueries({ queryKey: ["experiments-dropdown"] });

      if (data?.data) {
        toast.success("Direct Binding Assay Experiment Created", {
          description: `${data?.data?.experiment_name} has been created successfully.`,
        });

        options?.onSuccess?.(data);
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to Create Experiment", {
        description:
          error.message ||
          "An error occurred while creating the direct binding assay experiment.",
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
