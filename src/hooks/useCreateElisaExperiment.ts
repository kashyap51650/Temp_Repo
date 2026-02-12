import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { elisaExperimentApi } from "@/api";
import type {
  CreateElisaExperimentPayload,
  CreateElisaExperimentResponse,
} from "@/types/elisaExperiment";

interface UseCreateElisaExperimentOptions {
  onSuccess?: (data: CreateElisaExperimentResponse) => void;
  onError?: (error: Error) => void;
}

export function useCreateElisaExperiment(
  options?: UseCreateElisaExperimentOptions
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateElisaExperimentPayload) =>
      await elisaExperimentApi.createElisaExperiment(payload),
    onSuccess: (data: CreateElisaExperimentResponse) => {
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
      queryClient.invalidateQueries({ queryKey: ["experiments-dropdown"] });

      if (data?.data) {
        toast.success("Elisa Experiment Created", {
          description: `${data?.data?.experiment_name} has been created successfully.`,
        });

        options?.onSuccess?.(data);
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to Create Experiment", {
        description:
          error.message ||
          "An error occurred while creating the Elisa experiment.",
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
