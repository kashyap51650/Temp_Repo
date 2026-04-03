import { useQuery } from "@tanstack/react-query";

import { experimentDrugApi } from "@/api";

export const useExperimentsDrugsDropdown = (projectId: number) => {
  const { data, isLoading } = useQuery({
    queryKey: ["experiments-drugs-dropdown", projectId],
    queryFn: async () => {
      const response =
        await experimentDrugApi.getExperimentDrugsDropdown(projectId);
      return response.data;
    },
  });

  return {
    experimentDrugs: data || [],
    loading: isLoading,
  };
};
