import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiClient, type ApiResponse, handleApiError } from "@/lib/api";

export interface CalliperMeasurementUpdate {
  id: number;
  length_mm: number;
  width_mm: number;
}

export interface CalliperingWorksheetUpdate {
  worksheet: {
    id: number;
    measurement_date?: string;
    treatment_date?: string;
    sex?: string;
    mouse_strain_id?: number;
    cell_line_id?: number;
    cell_injection_date?: string;
  };
  measurements: CalliperMeasurementUpdate[];
}

interface BulkUpdateCalliperMeasurementsRequest {
  worksheets: CalliperingWorksheetUpdate[];
}

interface BulkUpdateCalliperMeasurementsResponse {
  message: string;
  total: number;
  successful: number;
  failed: number;
}

const bulkUpdateCalliperMeasurements = async (
  request: BulkUpdateCalliperMeasurementsRequest,
  experimentDataId: string
): Promise<ApiResponse<BulkUpdateCalliperMeasurementsResponse>> => {
  const endpoint = `/api/v1/caliper-measurements/${experimentDataId}/bulk-update`;

  // Validate all worksheets
  request.worksheets.forEach((worksheet) => {
    const invalidMeasurements = worksheet.measurements.filter(
      (measurement) =>
        !measurement.id ||
        measurement.length_mm <= 0 ||
        measurement.width_mm <= 0
    );

    if (invalidMeasurements.length > 0) {
      throw new Error("Invalid measurement data provided");
    }
  });

  return apiClient.patch<BulkUpdateCalliperMeasurementsResponse>(
    endpoint,
    request
  );
};

export default function useBulkUpdateCalliperMeasurements() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      request,
      experimentDataId,
    }: {
      request: BulkUpdateCalliperMeasurementsRequest;
      experimentDataId: string;
    }) => bulkUpdateCalliperMeasurements(request, experimentDataId),
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
