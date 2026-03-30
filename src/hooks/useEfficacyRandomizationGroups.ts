import { useQuery } from "@tanstack/react-query";

import { randomizationApi } from "@/api";

export const useEfficacyRandomizationGroups = (experimentId?: number) => {
  return useQuery({
    queryKey: ["efficacy-randomization-groups", experimentId],
    queryFn: () =>
      randomizationApi.getEfficacyMouseGroups({
        experiment_id: experimentId as number,
      }),
    enabled: !!experimentId,
  });
};
