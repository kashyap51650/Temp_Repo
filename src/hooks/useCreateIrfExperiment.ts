import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { irfExperimentApi } from "@/api";
import type {
  CreateIrfExperimentPayload,
  CreateIrfExperimentResponse,
} from "@/types/irfExperiment";

interface UseCreateIrfExperimentOptions {
  onSuccess?: (data: CreateIrfExperimentResponse) => void;
  onError?: (error: Error) => void;
}

export function useCreateIrfExperiment(
  options?: UseCreateIrfExperimentOptions
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateIrfExperimentPayload) =>
      await irfExperimentApi.createIrfExperiment(payload),
    onSuccess: (data: CreateIrfExperimentResponse) => {
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
      queryClient.invalidateQueries({ queryKey: ["experiments-dropdown"] });

      if (data?.data) {
        toast.success("IRF Experiment Created", {
          description: `${data?.data?.experiment_name} has been created successfully.`,
        });

        options?.onSuccess?.(data);
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to Create Experiment", {
        description:
          error.message ||
          "An error occurred while creating the Irf experiment.",
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
