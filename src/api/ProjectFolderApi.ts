import { API_CONFIG, apiClient } from "@/lib";

export const moveMiceApi = {
  getMiceFromExperiment: async (
    sourceExperimentId: number
  ): Promise<import("@/types/moveMice").MoveMiceResponse> => {
    return apiClient.get<import("@/types/moveMice").MoveMiceResponse>(
      API_CONFIG.ENDPOINTS.MOVE_MICE.GET_MICE(sourceExperimentId)
    );
  },

  getTargetExperiments: async (
    sourceExperimentId: number
  ): Promise<import("@/types/moveMice").TargetExperimentsResponse> => {
    return apiClient.get<import("@/types/moveMice").TargetExperimentsResponse>(
      API_CONFIG.ENDPOINTS.MOVE_MICE.GET_TARGET_EXPERIMENTS(sourceExperimentId)
    );
  },

  confirmMoveMice: async (
    payload: import("@/types/moveMice").MoveMicePayload
  ): Promise<import("@/types/moveMice").MoveMiceConfirmResponse> => {
    return apiClient.post<import("@/types/moveMice").MoveMiceConfirmResponse>(
      API_CONFIG.ENDPOINTS.MOVE_MICE.MOVE_MICE(payload.source_experiment_id)
    );
  },
};
