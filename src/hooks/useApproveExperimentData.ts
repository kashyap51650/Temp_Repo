import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiClient, handleApiError } from "@/lib/api";

import { useThrottledMutation } from "./useThrottledMutation";

interface ApproveExperimentDataResponse {
  id: number;
  status: string;
  reviewer: {
    id: number;
    email: string;
    username: string;
    full_name: string;
    first_name: string;
    last_name: string;
  };
  rejection_reason: string | null;
  updated_at: string;
}

const approveExperimentData = async (
  experimentDataId: string
): Promise<ApproveExperimentDataResponse> => {
  const endpoint = `/api/v1/experiment-data/${experimentDataId}/approve`;
  return apiClient.patch<ApproveExperimentDataResponse>(endpoint);
};

/**
 * Hook for approving experiment data with throttling protection
 *
 * Prevents accidental double-approvals by enforcing a 2-second throttle
 * between approval requests. Uses standardized error handling with toast
 * notifications and automatic query invalidation.
 *
 * @returns Throttled mutation hook for experiment data approval
 *
 * @example
 * ```tsx
 * const approveMutation = useApproveExperimentData();
 *
 * // In component - safe from double-clicks
 * <Button
 *   onClick={() => approveMutation.mutate(experimentDataId)}
 *   disabled={approveMutation.isPending}
 * >
 *   Approve
 * </Button>
 * ```
 */
export default function useApproveExperimentData() {
  const queryClient = useQueryClient();

  return useThrottledMutation(
    {
      mutationFn: approveExperimentData,
      onSuccess: () => {
        // ✅ Invalidate validation data queries to refresh the list
        queryClient.invalidateQueries({
          queryKey: ["validationData"],
        });
      },
      onError: (error) => {
        // ✅ Standardized error handling with automatic toast notifications
        const errorMessage = handleApiError(
          error,
          "Failed to approve experiment data"
        );
        toast.error("Failed to approve experiment data", {
          description: errorMessage,
        });
      },
    },
    2000 // ✅ 2 second throttle - prevents accidental double-approvals
  );
}
