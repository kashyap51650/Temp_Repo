import { useQuery } from "@tanstack/react-query";

import { API_CONFIG, apiClient, type ApiResponse } from "@/lib";
import type { Experiment } from "@/types/experiment";

export const useExperimentDetails = (experimentId: number | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["experiment-details", experimentId],
    queryFn: async () => {
      if (!experimentId) return null;
      const response = await apiClient.get<ApiResponse<Experiment>>(
        API_CONFIG.ENDPOINTS.EXPERIMENTS.EXPERIMENT_DETAILS(experimentId)
      );
      return response.data;
    },
    enabled: !!experimentId, // Only run the query if experimentId is provided
  });

  return {
    experimentDetails: data,
    isLoading,
    error,
  };
};
