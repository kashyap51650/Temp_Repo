import { API_CONFIG, apiClient } from "@/lib/api";
import type {
  RandomizationPreviewData,
  RandomizationPreviewResponse,
  ViewRandomizationGroupResponse,
} from "@/types/randomization";

export const randomizationApi = {
  previewRandomization: async (payload: {
    experiment_id: number;
    mice_per_group: number;
    randomization_type: string;
    buffer_groups?: string[]; // Optional for dose range finding weight sheets
  }): Promise<RandomizationPreviewResponse> => {
    return apiClient.post(API_CONFIG.ENDPOINTS.RANDOMIZATION.PREVIEW, {
      ...payload,
    });
  },
  confirmRandomization: async (payload: RandomizationPreviewData) => {
    return apiClient.post(API_CONFIG.ENDPOINTS.RANDOMIZATION.CONFIRM, {
      ...payload,
    });
  },
  viewRandomizationDetails: async (experimentId: number) => {
    return apiClient.get<ViewRandomizationGroupResponse>(
      API_CONFIG.ENDPOINTS.RANDOMIZATION.VIEW(experimentId)
    );
  },
};
