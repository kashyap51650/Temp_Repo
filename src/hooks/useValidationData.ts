import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
  experimentDataApi,
  type ExperimentDataFilters,
  type ExperimentDataResponse,
} from "@/api";
import { DEFAULT_PAGE_SIZE, REACT_QUERY_CONFIG } from "@/lib/constants";

export interface UseValidationDataResult {
  data: ExperimentDataResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  setFilters: (filters: ExperimentDataFilters) => void;
  filters: ExperimentDataFilters;
}

export function useValidationData(): UseValidationDataResult {
  const [filters, setFilters] = useState<ExperimentDataFilters>({
    page: 1,
    size: DEFAULT_PAGE_SIZE,
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["validationData", filters],
    queryFn: () => experimentDataApi.getExperimentData(filters),
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.LONG,
    retry: 3,
  });

  const handleSetFilters = (newFilters: ExperimentDataFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1, // Reset to first page when filters change
    }));
  };

  return {
    data,
    isLoading,
    error: error as Error | null,
    refetch,
    setFilters: handleSetFilters,
    filters,
  };
}
