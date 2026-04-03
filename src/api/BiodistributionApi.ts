import { API_CONFIG, apiClient } from "@/lib/api";
import type {
  BiodistributionFilters,
  BiodistributionFiltersResponse,
  BiodistributionGraphParams,
  BiodistributionSummaryResponse,
} from "@/types/biodistribution";

/**
 * Biodistribution API Client
 *
 * Handles API calls for biodistribution data, uptake summaries, and graph visualizations.
 */
export const biodistributionApi = {
  /**
   * Get biodistribution summary data with optional filters
   *
   * @param filters - Optional filters for drug, strain, time point, group
   * @returns Promise with biodistribution dataset
   */
  getSummary: async (
    filters?: BiodistributionFilters
  ): Promise<BiodistributionSummaryResponse> => {
    const response = await apiClient.get<BiodistributionSummaryResponse>(
      API_CONFIG.ENDPOINTS.BIODISTRIBUTION.SUMMARY,
      { params: filters }
    );
    return response;
  },

  /**
   * Get biodistribution graph data for a specific experiment
   *
   * Endpoint: /api/v1/graphs/biod/uptake-summary/{experiment_id}/dataset
   *
   * @param experimentId - Experiment ID (required, minimum: 1)
   * @param params - Optional query parameters for filtering
   * @returns Promise with biodistribution dataset for the experiment
   *
   * @example
   * ```typescript
   * // Just experiment ID
   * const data = await biodistributionApi.getSummaryByExperiment(123);
   *
   * // With optional filters
   * const filtered = await biodistributionApi.getSummaryByExperiment(123, {
   *   group_ids: '10,11,12',
   *   organ_ids: '1,2,3',
   *   time_point_hours: '1,4,24'
   * });
   * ```
   */
  getSummaryByExperiment: async (
    experimentId: number,
    params?: BiodistributionGraphParams
  ): Promise<BiodistributionSummaryResponse> => {
    const response = await apiClient.get<BiodistributionSummaryResponse>(
      API_CONFIG.ENDPOINTS.BIODISTRIBUTION.UPTAKE_SUMMARY(experimentId),
      { params }
    );
    return response;
  },

  /**
   * Export uptake-by-group biodistribution data as CSV for a specific experiment
   *
   * Endpoint: /api/v1/graphs/biod/uptake-summary/{experiment_id}/export-csv/uptake-by-group
   *
   * @param experimentId - Experiment ID (required, minimum: 1)
   * @param params - Optional query parameters for filtering
   * @returns Promise with CSV file blob
   */
  exportUptakeByGroupCsvByExperiment: async (
    experimentId: number,
    params?: BiodistributionGraphParams
  ): Promise<Blob> => {
    const response = await apiClient.get<Blob>(
      API_CONFIG.ENDPOINTS.BIODISTRIBUTION.UPTAKE_BY_GROUP_EXPORT_CSV(
        experimentId
      ),
      {
        params,
        responseType: "blob",
      }
    );
    return response;
  },

  /**
   * Export uptake-by-group-mice biodistribution data as CSV for a specific experiment
   *
   * Endpoint: /api/v1/graphs/biod/uptake-summary/{experiment_id}/export-csv/uptake-by-group-mice
   *
   * @param experimentId - Experiment ID (required, minimum: 1)
   * @param params - Optional query parameters for filtering
   * @returns Promise with CSV file blob
   */
  exportUptakeByGroupMiceCsvByExperiment: async (
    experimentId: number,
    params?: BiodistributionGraphParams
  ): Promise<Blob> => {
    const response = await apiClient.get<Blob>(
      API_CONFIG.ENDPOINTS.BIODISTRIBUTION.UPTAKE_BY_GROUP_MICE_EXPORT_CSV(
        experimentId
      ),
      {
        params,
        responseType: "blob",
      }
    );
    return response;
  },

  /**
   * Export uptake-by-mice biodistribution data as CSV for a specific experiment
   *
   * Endpoint: /api/v1/graphs/biod/uptake-summary/{experiment_id}/export-csv/uptake-by-mice
   *
   * @param experimentId - Experiment ID (required, minimum: 1)
   * @param params - Optional query parameters for filtering
   * @returns Promise with CSV file blob
   */
  exportUptakeByMiceCsvByExperiment: async (
    experimentId: number,
    params?: BiodistributionGraphParams
  ): Promise<Blob> => {
    const response = await apiClient.get<Blob>(
      API_CONFIG.ENDPOINTS.BIODISTRIBUTION.UPTAKE_BY_MICE_EXPORT_CSV(
        experimentId
      ),
      {
        params,
        responseType: "blob",
      }
    );
    return response;
  },

  /**
   * Get available filters for biodistribution graph
   *
   * Endpoint: /api/v1/graphs/biod/uptake-summary/{experiment_id}/filters
   *
   * @param experimentId - Experiment ID (required, minimum: 1)
   * @returns Promise with available filter options (timepoints, mouse_groups, organs, cell_lines, experiment_drugs, mouse_strains)
   *
   * @example
   * ```typescript
   * const filters = await biodistributionApi.getFilters(123);
   * ```
   */
  getFilters: async (
    experimentId: number
  ): Promise<BiodistributionFiltersResponse> => {
    const response = await apiClient.get<BiodistributionFiltersResponse>(
      API_CONFIG.ENDPOINTS.BIODISTRIBUTION.UPTAKE_FILTERS(experimentId)
    );
    return response;
  },
};
