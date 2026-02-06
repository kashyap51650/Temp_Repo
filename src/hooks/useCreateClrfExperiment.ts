import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { clrfExperimentApi } from "@/api";
import type {
  CreateClrfExperimentPayload,
  CreateClrfExperimentResponse,
} from "@/types/clrfExperiment";

interface UseCreateClrfExperimentOptions {
  onSuccess?: (data: CreateClrfExperimentResponse) => void;
  onError?: (error: Error) => void;
}

export function useCreateClrfExperiment(
  options?: UseCreateClrfExperimentOptions
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateClrfExperimentPayload) =>
      await clrfExperimentApi.createClrfExperiment(payload),
    onSuccess: (data: CreateClrfExperimentResponse) => {
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
      queryClient.invalidateQueries({ queryKey: ["experiments-dropdown"] });

      if (data?.data) {
        toast.success("CLRF Experiment Created", {
          description: `${data?.data?.experiment_name} has been created successfully.`,
        });

        options?.onSuccess?.(data);
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to Create Experiment", {
        description:
          error.message ||
          "An error occurred while creating the Clrf experiment.",
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
