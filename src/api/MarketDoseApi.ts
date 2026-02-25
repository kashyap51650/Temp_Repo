import { API_CONFIG, apiClient, type ApiResponse } from "@/lib";

export const marketDoseApi = {
  getMarketDosesDropdown: async (): Promise<
    ApiResponse<
      Array<{
        id: number;
        market_dose_name: string;
      }>
    >
  > => {
    return apiClient.get(API_CONFIG.ENDPOINTS.MARKET_DOSE.DROPDOWN);
  },
};
