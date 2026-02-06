import { API_CONFIG, apiClient } from "@/lib/api";
import type {
  CreateMasterDataItemResponse,
  MasterDataListResponse,
  UpdateMasterDataItemResponse,
} from "@/types/masterData";

export const masterDataApi = {
  getMasterDataSources: async (): Promise<{
    success: boolean;
    message: string;
    data: Array<{
      slug: string;
      title: string;
      description: string;
    }>;
  }> => {
    return apiClient.get(API_CONFIG.ENDPOINTS.MASTER_DATA.SOURCES);
  },

  getMasterData: async (
    slug: string,
    filters: {
      page: number;
      size: number;
    }
  ): Promise<MasterDataListResponse> => {
    const response = await apiClient.get<MasterDataListResponse>(
      `${API_CONFIG.ENDPOINTS.MASTER_DATA.ITEMS(slug)}?page=${filters.page}&size=${filters.size}`
    );

    if (response.success && response.data?.items) {
      response.data.items = response.data.items.map((item: any) => ({
        ...item,
        createdBy: item.creator?.email || "",
        updatedBy: item.updator?.email || "",
      }));
    }

    return response;
  },

  createMasterDataItem: async (
    slug: string,
    data: Record<string, any>
  ): Promise<CreateMasterDataItemResponse> => {
    const response = await apiClient.post<CreateMasterDataItemResponse>(
      API_CONFIG.ENDPOINTS.MASTER_DATA.ITEMS(slug),
      data
    );

    if (response.success && response.data) {
      response.data = {
        ...response.data,
        createdBy: response.data.creator?.email || "",
        updatedBy: response.data.updator?.email || "",
      };
    }

    return response;
  },

  updateMasterDataItem: async (
    slug: string,
    id: number,
    data: Record<string, any>
  ): Promise<UpdateMasterDataItemResponse> => {
    const response = await apiClient.put<UpdateMasterDataItemResponse>(
      API_CONFIG.ENDPOINTS.MASTER_DATA.ITEM(slug, id),
      data
    );

    if (response.success && response.data) {
      response.data = {
        ...response.data,
        createdBy: response.data.creator?.email || "",
        updatedBy: response.data.updator?.email || "",
      };
    }

    return response;
  },

  deleteMasterDataItem: async (
    slug: string,
    id: number
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    return apiClient.delete(API_CONFIG.ENDPOINTS.MASTER_DATA.ITEM(slug, id));
  },
};
