import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { conjugationExperimentApi } from "@/api";
import type {
  CreateConjugationExperimentPayload,
  CreateConjugationExperimentResponse,
} from "@/types/conjugationExperiment";

interface UseCreateConjugationExperimentOptions {
  onSuccess?: (data: CreateConjugationExperimentResponse) => void;
  onError?: (error: Error) => void;
}

export function useCreateConjugationExperiment(
  options?: UseCreateConjugationExperimentOptions
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateConjugationExperimentPayload) =>
      await conjugationExperimentApi.createConjugationExperiment(payload),
    onSuccess: (data: CreateConjugationExperimentResponse) => {
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
      queryClient.invalidateQueries({ queryKey: ["experiments-dropdown"] });

      if (data?.data) {
        toast.success("Conjugation Experiment Created", {
          description: `${data?.data?.experiment_name} has been created successfully.`,
        });

        options?.onSuccess?.(data);
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to Create Experiment", {
        description:
          error.message ||
          "An error occurred while creating the conjugation experiment.",
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
