import { useQuery } from "@tanstack/react-query";

import { experimentDrugApi } from "@/api";

export const useExperimentsDrugsDropdown = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["experiments-drugs-dropdown"],
    queryFn: async () => {
      const response = await experimentDrugApi.getExperimentDrugsDropdown();
      return response.data;
    },
  });

  return {
    experimentDrugs: data || [],
    loading: isLoading,
  };
};
