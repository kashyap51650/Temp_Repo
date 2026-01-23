import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { performBioDApi, type PerformBioDPayload } from "@/lib/api";
import { handleApiError } from "@/lib/api";

interface UsePerformBioDOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePerformBioD(options?: UsePerformBioDOptions) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: PerformBioDPayload) =>
      performBioDApi.performBioD(payload),
    onSuccess: (data) => {
      toast.success("BioD performed successfully", {
        description:
          data.message || "Mouse groups have been processed for BioD analysis",
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["experiments"] });
      queryClient.invalidateQueries({ queryKey: ["experiment-data"] });
      queryClient.invalidateQueries({
        queryKey: ["validationData"],
      });

      options?.onSuccess?.();
    },
    onError: (error) => {
      const errorMessage = handleApiError(
        error,
        "Failed to perform BioD operation"
      );
      toast.error("Failed to perform BioD", {
        description: errorMessage,
      });

      options?.onError?.(error as Error);
    },
  });

  return {
    performBioD: mutation.mutateAsync,
    isPerforming: mutation.isPending,
    error: mutation.error,
  };
}
