import { API_CONFIG, apiClient } from "@/lib/api";
import type {
  EfficacyRandomizationConfirmPayload as EfficacyConfirmPayload,
  EfficacyRandomizationConfirmResponse as EfficacyConfirmResponse,
  EfficacyRandomizationGroupsParams as EfficacyGroupsParams,
  EfficacyRandomizationGroupsResponse as EfficacyGroupsResponse,
  EfficacyRandomizationPreviewPayload as EfficacyPreviewPayload,
  EfficacyRandomizationPreviewResponse as EfficacyPreviewResponse,
  EfficacyRandomizationStatusResponse as EfficacyStatusResponse,
} from "@/types/efficacy-randomization";
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
  getEfficacyMouseGroups: async (
    params: EfficacyGroupsParams
  ): Promise<EfficacyGroupsResponse> => {
    return apiClient.get<EfficacyGroupsResponse>(
      API_CONFIG.ENDPOINTS.EFFICACY_RANDOMIZATION.GROUPS,
      {
        params,
      }
    );
  },
  previewEfficacyRandomization: async (
    payload: EfficacyPreviewPayload
  ): Promise<EfficacyPreviewResponse> => {
    return apiClient.post<EfficacyPreviewResponse>(
      API_CONFIG.ENDPOINTS.EFFICACY_RANDOMIZATION.PREVIEW,
      payload
    );
  },
  confirmEfficacyRandomization: async (
    payload: EfficacyConfirmPayload
  ): Promise<EfficacyConfirmResponse> => {
    return apiClient.post<EfficacyConfirmResponse>(
      API_CONFIG.ENDPOINTS.EFFICACY_RANDOMIZATION.CONFIRM,
      payload
    );
  },
  getEfficacyRandomizationStatus: async (
    experimentId: number
  ): Promise<EfficacyStatusResponse> => {
    return apiClient.get<EfficacyStatusResponse>(
      API_CONFIG.ENDPOINTS.EFFICACY_RANDOMIZATION.STATUS(experimentId)
    );
  },
};
