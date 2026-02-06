import { useQuery } from "@tanstack/react-query";

import { projectApi } from "@/api";
import { REACT_QUERY_CONFIG } from "@/lib/constants";
import type { ProjectFilters } from "@/types/project";

/**
 * Custom hook to fetch the projects list with optional filtering.
 *
 * @param filters - Optional filters for the projects list
 * @param filters.name - Filter by project name
 * @param filters.status - Filter by project status
 * @param filters.page - Page number (1-based), default: 1
 * @param filters.size - Number of items per page (max 100), default: 25
 *
 * @returns TanStack Query result with projects data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useProjectsList({
 *   name: "Cancer Research",
 *   status: "active",
 *   page: 1,
 *   size: 10
 * });
 *
 * const projects = data?.data?.projects || [];
 * const total = data?.data?.total || 0;
 * ```
 */

export function useProjectsList(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ["projectsList", filters],
    queryFn: () => projectApi.getProjectsList(filters),
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.SHORT,
    refetchOnWindowFocus: false,
  });
}
