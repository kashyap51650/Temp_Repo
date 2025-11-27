import { useQuery } from "@tanstack/react-query";

import { masterDataApi } from "@/lib/api";
import { REACT_QUERY_CONFIG } from "@/lib/constants";

export interface MasterDataSource {
  slug: string;
  title: string;
  description: string;
}

export const useMasterDataSources = () => {
  return useQuery({
    queryKey: ["master-data-sources"],
    queryFn: async () => {
      const response = await masterDataApi.getMasterDataSources();
      return response.data;
    },
    staleTime: REACT_QUERY_CONFIG.STALE_TIME,
    gcTime: REACT_QUERY_CONFIG.CACHE_TIME,
  });
};
