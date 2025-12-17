import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiClient, handleApiError } from "@/lib/api";

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

export default function useApproveExperimentData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveExperimentData,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["validationData"],
      });
    },
    onError: (error) => {
      const errorMessage = handleApiError(
        error,
        "Failed to approve experiment data"
      );
      toast.error("Failed to approve experiment data", {
        description: errorMessage,
      });
    },
  });
}
