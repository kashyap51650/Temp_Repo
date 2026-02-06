import { useMutation, useQueryClient } from "@tanstack/react-query";

import { modelStudyExperimentApi } from "@/api";
import { toast } from "@/components/atoms/Sonner/toast";
import type {
  CreateModelStudyPayload,
  CreateModelStudyResponse,
} from "@/types/modelStudy";

interface UseCreateModelStudyExperimentOptions {
  onSuccess?: (data: CreateModelStudyResponse) => void;
  onError?: (error: Error) => void;
}

export function useCreateModelStudyExperiment(
  options?: UseCreateModelStudyExperimentOptions
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateModelStudyPayload) =>
      await modelStudyExperimentApi.createModelStudyExperiment(payload),
    onSuccess: (data: CreateModelStudyResponse) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
      queryClient.invalidateQueries({ queryKey: ["experiments-dropdown"] });

      if (data?.data) {
        toast.success("Model Study Experiment Created", {
          description: `${data?.data?.experiment_name} has been created successfully.`,
        });

        options?.onSuccess?.(data);
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to Create Experiment", {
        description:
          error.message ||
          "An error occurred while creating the model study experiment.",
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
