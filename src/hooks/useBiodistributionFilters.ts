import { useQuery } from "@tanstack/react-query";

import { biodistributionApi } from "@/api/BiodistributionApi";

/**
 * Custom hook to fetch biodistribution graph filters
 *
 * @param experimentId - Experiment ID to fetch filters for
 * @returns TanStack Query result with filter options
 *
 * @example
 * ```typescript
 * const { data, isLoading, error } = useBiodistributionFilters(123);
 * ```
 */
export function useBiodistributionFilters(experimentId: number | null) {
  return useQuery({
    queryKey: ["biodistribution-filters", experimentId],
    queryFn: () => biodistributionApi.getFilters(experimentId!),
    enabled: !!experimentId,
    staleTime: 5 * 60 * 1000, // 5 minutes - filters don't change often
  });
}
