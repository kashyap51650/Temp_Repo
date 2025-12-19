import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiClient, type ApiResponse, handleApiError } from "@/lib/api";

export interface BodyWeightMeasurementUpdate {
  id: number;
  body_weight_grams: number;
}

interface BulkUpdateBodyWeightsRequest {
  measurements: BodyWeightMeasurementUpdate[];
}

interface BulkUpdateBodyWeightsResponse {
  message: string;
  total: number;
  successful: number;
  failed: number;
}

const bulkUpdateBodyWeights = async (
  request: BulkUpdateBodyWeightsRequest
): Promise<ApiResponse<BulkUpdateBodyWeightsResponse>> => {
  const endpoint = `/api/v1/body-weight-measurements/bulk-update`;

  if (!request.measurements || request.measurements.length === 0) {
    throw new Error("No measurements provided for update");
  }

  const invalidMeasurements = request.measurements.filter(
    (measurement) => !measurement.id || measurement.body_weight_grams <= 0
  );

  if (invalidMeasurements.length > 0) {
    throw new Error("Invalid measurement data provided");
  }

  return apiClient.patch<BulkUpdateBodyWeightsResponse>(endpoint, request);
};

export default function useBulkUpdateBodyWeights() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUpdateBodyWeights,
    onSuccess: (data) => {
      toast.success("Body weight measurements updated successfully", {
        description: `${data?.data?.successful} measurements updated`,
      });

      queryClient.invalidateQueries({
        queryKey: ["experimentData"],
      });
    },
    onError: (error) => {
      const errorMessage = handleApiError(
        error,
        "Failed to update body weight measurements"
      );
      toast.error("Failed to update measurements", {
        description: errorMessage,
      });
    },
  });
}
