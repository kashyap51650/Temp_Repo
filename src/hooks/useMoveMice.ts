import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { moveMiceApi } from "@/api";
import { handleApiError } from "@/lib/api";
import { REACT_QUERY_CONFIG } from "@/lib/constants";
import type { MoveMicePayload } from "@/types/moveMice";

export function useGetMiceFromExperiment(
  sourceExperimentId: number,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["moveMice", "sourceMice", sourceExperimentId],
    queryFn: () => moveMiceApi.getMiceFromExperiment(sourceExperimentId),
    enabled: enabled && !!sourceExperimentId,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.LONG, // 5 minutes
    select: (data) => {
      return data.data.map((mouse) => ({
        id: String(mouse.id),
        label: mouse.mouse_delivery_id,
      }));
    },
  });
}

export function useGetTargetExperiments(
  sourceExperimentId: number,
  enabled: boolean = false
) {
  return useQuery({
    queryKey: ["moveMice", "targetExperiments", sourceExperimentId],
    queryFn: () => moveMiceApi.getTargetExperiments(sourceExperimentId),
    enabled: enabled && !!sourceExperimentId,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.SHORT, // 2 minutes
    select: (data) => {
      return data.data.map((exp) => ({
        id: exp.id.toString(),
        name: exp.experiment_name,
        cellLines: [],
        isotope: "",
        projectId: exp?.project_id?.toString(),
        studyType: exp?.study_type,
      }));
    },
  });
}

export function useMoveMice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MoveMicePayload) =>
      moveMiceApi.confirmMoveMice(payload),
    onSuccess: (response, variables) => {
      toast.success(
        response.message ||
          `Successfully moved ${variables.mouse_ids.length} mice`
      );

      queryClient.invalidateQueries({
        queryKey: ["moveMice", "sourceMice", variables.source_experiment_id],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "moveMice",
          "targetExperiments",
          variables.target_experiment_id,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["experiments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["mouseGroups"],
      });
    },
    onError: (error) => {
      const errorMessage = handleApiError(error, "Failed to move mice");
      toast.error(errorMessage);
    },
  });
}
