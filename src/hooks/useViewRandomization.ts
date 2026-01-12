import { useQuery } from "@tanstack/react-query";

import { randomizationApi } from "@/lib/api";
import { REACT_QUERY_CONFIG } from "@/lib/constants";

export const useViewRandomization = (experimentId: number) => {
  return useQuery({
    queryKey: ["viewRandomization", experimentId],
    queryFn: () => randomizationApi.viewRandomizationDetails(experimentId),
    enabled: !!experimentId,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.SHORT,
    refetchOnMount: false,
  });
};
