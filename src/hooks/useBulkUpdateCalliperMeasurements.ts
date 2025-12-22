import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiClient, type ApiResponse, handleApiError } from "@/lib/api";

export interface CalliperMeasurementUpdate {
  id: number;
  length_mm: number;
  width_mm: number;
}

interface BulkUpdateCalliperMeasurementsRequest {
  measurements: CalliperMeasurementUpdate[];
}

interface BulkUpdateCalliperMeasurementsResponse {
  message: string;
  total: number;
  successful: number;
  failed: number;
}

const bulkUpdateCalliperMeasurements = async (
  request: BulkUpdateCalliperMeasurementsRequest
): Promise<ApiResponse<BulkUpdateCalliperMeasurementsResponse>> => {
  const endpoint = `/api/v1/caliper-measurements/bulk-update`;

  if (!request.measurements || request.measurements.length === 0) {
    throw new Error("No measurements provided for update");
  }

  const invalidMeasurements = request.measurements.filter(
    (measurement) =>
      !measurement.id || measurement.length_mm <= 0 || measurement.width_mm <= 0
  );

  if (invalidMeasurements.length > 0) {
    throw new Error("Invalid measurement data provided");
  }

  return apiClient.patch<BulkUpdateCalliperMeasurementsResponse>(
    endpoint,
    request
  );
};

export default function useBulkUpdateCalliperMeasurements() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUpdateCalliperMeasurements,
    onSuccess: (data) => {
      toast.success("Calliper measurements updated successfully", {
        description: `${data.data?.successful} measurements updated`,
      });

      queryClient.invalidateQueries({
        queryKey: ["experimentData"],
      });
    },
    onError: (error) => {
      const errorMessage = handleApiError(
        error,
        "Failed to update calliper measurements"
      );
      toast.error("Failed to update measurements", {
        description: errorMessage,
      });
    },
  });
}
