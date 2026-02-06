import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { modelStudyExperimentApi } from "@/api";
import type {
  ConfirmExperimentMouseGroupsPayload,
  ConfirmExperimentMouseGroupsResponse,
} from "@/types/modelStudy";

interface UseConfirmExperimentMouseGroupsOptions {
  onSuccess?: (data: ConfirmExperimentMouseGroupsResponse) => void;
  onError?: (error: Error) => void;
}
export default function useConfirmExperimentMouseGroups(
  options?: UseConfirmExperimentMouseGroupsOptions
) {
  const mutation = useMutation({
    mutationFn: async (payload: ConfirmExperimentMouseGroupsPayload) =>
      await modelStudyExperimentApi.confirmMouseGroups(payload),
    onSuccess: (data: ConfirmExperimentMouseGroupsResponse) => {
      toast.success(
        "Model Study Experiment groups have been created successfully."
      );

      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast.error("Failed to create groups", {
        description:
          error.message ||
          "An error occurred while creating groups for the model study experiment.",
      });

      options?.onError?.(error);
    },
  });
  return {
    createMouseGroups: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
