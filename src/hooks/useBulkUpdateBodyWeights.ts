import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiClient, type ApiResponse, handleApiError } from "@/lib/api";

import { useThrottledMutation } from "./useThrottledMutation";

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
  for (const worksheet of request.worksheets) {
    const invalidMeasurements = worksheet?.measurements?.filter(
      (measurement) => !measurement.id || measurement.body_weight_grams <= 0
    );

    if (invalidMeasurements?.length) {
      throw new Error("Invalid measurement data provided");
    }
  }

  return apiClient.patch<BulkUpdateBodyWeightsResponse>(endpoint, request);
};

/**
 * Hook for bulk updating body weight measurements with heavy throttling
 *
 * This is an expensive operation that updates multiple measurements at once.
 * Enforces a 5-second throttle to prevent accidental duplicate submissions
 * and protect server resources.
 *
 * @returns Throttled mutation hook for bulk body weight updates
 *
 * @example
 * ```tsx
 * const bulkUpdate = useBulkUpdateBodyWeights();
 *
 * // In component - protected from rapid submissions
 * <Button
 *   onClick={() => bulkUpdate.mutate({ request, experimentDataId })}
 *   disabled={bulkUpdate.isPending}
 * >
 *   Save All Changes
 * </Button>
 * ```
 */
export default function useBulkUpdateBodyWeights() {
  const queryClient = useQueryClient();

  return useThrottledMutation(
    {
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

        // ✅ Invalidate experiment data queries to refresh
        queryClient.invalidateQueries({
          queryKey: ["experimentData"],
        });
      },
      onError: (error) => {
        // ✅ Standardized error handling with automatic toast notifications
        const errorMessage = handleApiError(
          error,
          "Failed to update body weight measurements"
        );
        toast.error("Failed to update measurements", {
          description: errorMessage,
        });
      },
    },
    5000 // ✅ 5 second throttle - bulk operations are expensive, need heavy protection
  );
}
