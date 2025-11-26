import { useQuery } from "@tanstack/react-query";

import { masterDataApi } from "@/lib/api";

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
    staleTime: Number(import.meta.env.VITE_REACT_QUERY_STALE_TIME),
    gcTime: Number(import.meta.env.VITE_REACT_QUERY_CACHE_TIME),
  });
};
