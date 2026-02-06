import { useQuery } from "@tanstack/react-query";

import { experimentApi } from "@/api";
import { REACT_QUERY_CONFIG } from "@/lib/constants";
import type { ExperimentListFilters } from "@/types/experiment";

/**
 * Custom hook to fetch experiments list with pagination and filtering
 *
 * @param filters - Optional filters for the experiments list
 * @param filters.project_id - Filter by project ID
 * @param filters.page - Page number (1-based), default: 1
 * @param filters.size - Number of items per page (max 100), default: 25
 * @param filters.search - Search term for filtering results
 *
 * @returns TanStack Query result with experiments data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useExperimentsList({
 *   project_id: 1,
 *   page: 1,
 *   size: 25,
 *   search: "Mouse Model"
 * });
 *
 * const experiments = data?.data?.experiments || [];
 * const total = data?.data?.total || 0;
 * ```
 */
export function useExperimentsList(filters?: ExperimentListFilters) {
  return useQuery({
    queryKey: ["experimentsList", filters],
    queryFn: () => experimentApi.getExperimentsList(filters),
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.SHORT,
    refetchOnWindowFocus: false,
  });
}
