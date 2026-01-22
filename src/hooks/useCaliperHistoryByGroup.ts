import { useQuery } from "@tanstack/react-query";

import type { CaliperHistoryByGroupResponse } from "@/lib/api";
import { caliperMeasurementsApi } from "@/lib/api";
import { REACT_QUERY_CONFIG } from "@/lib/constants";

/**
 * Custom hook to fetch caliper measurement history by group for a specific experiment
 *
 * @param experimentId - The ID of the experiment to fetch caliper history for
 * @param enabled - Whether the query should be enabled (default: true when experimentId is valid)
 * @returns TanStack Query result with caliper history data grouped by mouse groups, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useCaliperHistoryByGroup(165, isModalOpen);
 *
 * if (isLoading) return <Skeleton />;
 * if (error) return <ErrorMessage message={error.message} />;
 * if (data) return <CaliperHistoryGroupTable data={data} />;
 * ```
 */
export function useCaliperHistoryByGroup(
  experimentId: number,
  enabled: boolean = true
) {
  return useQuery<CaliperHistoryByGroupResponse>({
    queryKey: ["caliperHistory", "byGroup", experimentId],
    queryFn: () => caliperMeasurementsApi.getHistoryByGroup(experimentId),
    enabled: enabled && experimentId > 0,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.LONG,
    retry: 2,
  });
}
