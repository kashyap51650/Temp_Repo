import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiClient, type ApiResponse, handleApiError } from "@/lib/api";

export interface BodyWeightMeasurementUpdate {
  id: number;
  body_weight_grams: number;
}

export interface WorksheetUpdate {
  worksheet?: {
    id: number;
    measurement_date?: string;
    treatment_date?: string;
    sex?: string;
    mouse_strain_id?: number;
    cell_line_id?: number;
    cell_injection_date?: string;
  };
  measurements?: BodyWeightMeasurementUpdate[];
}

export interface BulkUpdateBodyWeightsRequest {
  worksheets: WorksheetUpdate[];
}

interface BulkUpdateBodyWeightsResponse {
  message: string;
  total: number;
  successful: number;
  failed: number;
}

const bulkUpdateBodyWeights = async (
  request: BulkUpdateBodyWeightsRequest,
  experimentDataId: string
): Promise<ApiResponse<BulkUpdateBodyWeightsResponse>> => {
  const endpoint = `/api/v1/body-weight-measurements/${experimentDataId}/bulk-update`;

  // Validate all worksheets
  request.worksheets.forEach((worksheet) => {
    const invalidMeasurements = worksheet?.measurements?.filter(
      (measurement) => !measurement.id || measurement.body_weight_grams <= 0
    );

    if (invalidMeasurements?.length) {
      throw new Error("Invalid measurement data provided");
    }
  });

  return apiClient.patch<BulkUpdateBodyWeightsResponse>(endpoint, request);
};

export default function useBulkUpdateBodyWeights() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      request,
      experimentDataId,
    }: {
      request: BulkUpdateBodyWeightsRequest;
      experimentDataId: string;
    }) => bulkUpdateBodyWeights(request, experimentDataId),
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
