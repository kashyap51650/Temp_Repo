import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiClient, type ApiResponse, handleApiError } from "@/lib/api";

interface RejectExperimentDataResponse {
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
  rejection_reason: string;
  updated_at: string;
}

const rejectExperimentData = async (
  experimentDataId: string,
  rejectionReason: string
): Promise<ApiResponse<RejectExperimentDataResponse>> => {
  const endpoint = `/api/v1/experiment-data/${experimentDataId}/reject`;
  const payload = {
    rejection_reason: rejectionReason,
  };
  return apiClient.patch<ApiResponse<RejectExperimentDataResponse>>(
    endpoint,
    payload
  );
};

export default function useRejectExperimentData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      experimentDataId,
      rejectionReason,
    }: {
      experimentDataId: string;
      rejectionReason: string;
    }) => rejectExperimentData(experimentDataId, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["validationData"],
      });
    },
    onError: (error) => {
      const errorMessage = handleApiError(
        error,
        "Failed to reject experiment data"
      );
      toast.error("Failed to reject experiment data", {
        description: errorMessage,
      });
    },
  });
}
