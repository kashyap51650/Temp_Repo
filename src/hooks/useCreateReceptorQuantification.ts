import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { receptorQuantificationExperimentApi } from "@/api";
import type {
  CreateReceptorQuantificationExperimentPayload,
  CreateReceptorQuantificationExperimentResponse,
} from "@/types/receptorQuantification";

interface UseCreateReceptorQuantificationOptions {
  onSuccess?: (data: CreateReceptorQuantificationExperimentResponse) => void;
  onError?: (error: Error) => void;
}

export function useCreateReceptorQuantification(
  options?: UseCreateReceptorQuantificationOptions
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (
      payload: CreateReceptorQuantificationExperimentPayload
    ) =>
      await receptorQuantificationExperimentApi.createReceptorQuantificationExperiment(
        payload
      ),
    onSuccess: (data: CreateReceptorQuantificationExperimentResponse) => {
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
      queryClient.invalidateQueries({ queryKey: ["experiments-dropdown"] });

      if (data?.data) {
        toast.success("Receptor Quantification Experiment Created", {
          description: `${data?.data?.experiment_name} has been created successfully.`,
        });

        options?.onSuccess?.(data);
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to Create Experiment", {
        description:
          error.message ||
          "An error occurred while creating the receptor quantification experiment.",
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
