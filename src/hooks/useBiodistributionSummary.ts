import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { biodistributionApi } from "@/api";
import type { ApiError } from "@/lib/api";
import type {
  BiodistributionFilters,
  BiodistributionGraphParams,
  BiodistributionSummaryResponse,
} from "@/types/biodistribution";

/**
 * Custom hook to fetch biodistribution summary data
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useBiodistributionSummary({
 *   drug_name: "DOTAM",
 *   mouse_strain_name: "ATH"
 * });
 * ```
 *
 * @param filters - Optional filters for drug, strain, time point, group
 * @param options - TanStack Query options for customization
 * @returns Query result with biodistribution data, loading state, and error
 */
export function useBiodistributionSummary(
  filters?: BiodistributionFilters,
  options?: Omit<
    UseQueryOptions<BiodistributionSummaryResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<BiodistributionSummaryResponse, ApiError>({
    queryKey: ["biodistribution", "summary", filters],
    queryFn: () => biodistributionApi.getSummary(filters),
    ...options,
  });
}

/**
 * Custom hook to fetch biodistribution summary data for a specific experiment
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useBiodistributionSummaryByExperiment(123);
 * ```
 *
 * @param experimentId - Experiment ID to fetch data for
 * @param options - TanStack Query options for customization
 * @returns Query result with biodistribution data for the experiment
 */
export function useBiodistributionSummaryByExperiment(
  experimentId: number,
  options?: Omit<
    UseQueryOptions<BiodistributionSummaryResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<BiodistributionSummaryResponse, ApiError>({
    queryKey: ["biodistribution", "experiment", experimentId],
    queryFn: () => biodistributionApi.getSummaryByExperiment(experimentId),
    enabled: !!experimentId,
    ...options,
  });
}

/**
 * Custom hook to fetch biodistribution graph data for a specific experiment
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useBiodistributionGraph(123, {
 *   experiment_data_ids: '456'
 * });
 * ```
 *
 * @param experimentId - Experiment ID to fetch data for
 * @param params - Optional query parameters (experiment_data_ids, group_ids, etc.)
 * @param options - TanStack Query options for customization
 * @returns Query result with biodistribution graph data for the experiment
 */
export function useBiodistributionGraph(
  experimentId: number | null | undefined,
  params?: BiodistributionGraphParams,
  options?: Omit<
    UseQueryOptions<BiodistributionSummaryResponse, ApiError>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery<BiodistributionSummaryResponse, ApiError>({
    queryKey: ["biodistribution", "graph", experimentId, params],
    queryFn: () =>
      biodistributionApi.getSummaryByExperiment(experimentId!, params),
    enabled: !!experimentId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
