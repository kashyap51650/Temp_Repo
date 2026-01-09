import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { experimentApi } from "@/lib/api";

export function useUpdateExperimentStatus({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      experimentId,
      status,
    }: {
      experimentId: number;
      status: string;
    }) => experimentApi.updateExperimentStatus(experimentId, status),
    onSuccess: () => {
      toast.success("Experiment status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["experimentsList"] });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to update experiment status");
      if (onError) {
        onError(error);
      }
    },
  });
}
