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
    sourceExperimentId: number,
    studyTypeId?: number
  ): Promise<import("@/types/moveMice").TargetExperimentsResponse> => {
    return apiClient.get<import("@/types/moveMice").TargetExperimentsResponse>(
      API_CONFIG.ENDPOINTS.MOVE_MICE.GET_TARGET_EXPERIMENTS(sourceExperimentId),
      {
        params: {
          study_type_id: studyTypeId,
        },
      }
    );
  },

  confirmMoveMice: async (
    payload: import("@/types/moveMice").MoveMicePayload
  ): Promise<import("@/types/moveMice").MoveMiceConfirmResponse> => {
    return apiClient.post<import("@/types/moveMice").MoveMiceConfirmResponse>(
      API_CONFIG.ENDPOINTS.MOVE_MICE.MOVE_MICE(payload.source_experiment_id),
      {
        target_experiment_id: payload.target_experiment_id,
        mouse_ids: payload.mouse_ids,
      }
    );
  },
};
