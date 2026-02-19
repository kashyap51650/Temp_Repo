import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { delfiaExperimentApi } from "@/api";
import type {
  CreateDelfiaExperimentPayload,
  CreateDelfiaExperimentResponse,
} from "@/types/delfiaExperiment";

interface UseCreateDelfiaExperimentOptions {
  onSuccess?: (data: CreateDelfiaExperimentResponse) => void;
  onError?: (error: Error) => void;
}

export function useCreateDelfiaExperiment(
  options?: UseCreateDelfiaExperimentOptions
) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateDelfiaExperimentPayload) =>
      await delfiaExperimentApi.createDelfiaExperiment(payload),
    onSuccess: (data: CreateDelfiaExperimentResponse) => {
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
      queryClient.invalidateQueries({ queryKey: ["experiments-dropdown"] });

      if (data?.data) {
        toast.success("Delfia Experiment Created", {
          description: `${data?.data?.experiment_name} has been created successfully.`,
        });

        options?.onSuccess?.(data);
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to Create Experiment", {
        description:
          error.message ||
          "An error occurred while creating the Delfia experiment.",
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
