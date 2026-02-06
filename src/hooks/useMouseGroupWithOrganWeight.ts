import { useQuery } from "@tanstack/react-query";

import { mouseGroupApi } from "@/api";
import { REACT_QUERY_CONFIG } from "@/lib/constants";

export const useMouseGroupWithOrganWeight = (experimentId?: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["mouse-groups-with-organ-weights", experimentId],
    queryFn: async () => {
      if (!experimentId) return [];

      const response =
        await mouseGroupApi.getMouseGroupWithOrganWeights(experimentId);

      return response.data?.map((group) => {
        return {
          id: group.id,
          name: group.group_name,
        };
      });
    },
    enabled: !!experimentId,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.SHORT,
  });

  return { mouseGroupsWithOrganWeights: data, isLoading, error };
};
