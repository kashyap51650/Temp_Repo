import { useQuery } from "@tanstack/react-query";

import { mouseGroupApi } from "@/lib/api";
import { REACT_QUERY_CONFIG } from "@/lib/constants";

export const useMouseGroupsByExperiment = (experimentId?: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["randomized-mouse-groups", experimentId],
    queryFn: async () => {
      if (!experimentId) return [];

      const response =
        await mouseGroupApi.getMouseGroupsByExperiment(experimentId);

      return response.data?.map((group) => {
        return {
          id: group.id,
          name: group.group_name,
          cellLineId: group.cell_line_id,
          mouseStrainId: group.mouse_strain_id,
        };
      });
    },
    enabled: !!experimentId,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.SHORT,
  });

  return { mouseGroups: data, isLoading, error };
};
