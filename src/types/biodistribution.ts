/**
 * Biodistribution API Types
 */

// Filters for biodistribution summary query
export interface BiodistributionFilters {
  drug_name?: string;
  mouse_strain_name?: string;
  time_point_display?: string;
  group_name?: string;
}

// Query parameters for experiment-specific graph endpoint
export interface BiodistributionGraphParams {
  experiment_data_ids?: string; // Comma-separated experiment data IDs
  group_ids?: string; // Comma-separated group IDs (e.g., '10,11,12')
  organ_ids?: string; // Comma-separated organ IDs (e.g., '1,2,3')
  cell_line_ids?: string; // Comma-separated cell line IDs (e.g., '1,2,3')
  experiment_drug_ids?: string; // Comma-separated experiment drug IDs (e.g., '10,11,12')
  mouse_strain_ids?: string; // Comma-separated mouse strain IDs (e.g., '1,2,3')
  time_point_hours?: string; // Time point hours filter
}

// Individual data point in the biodistribution dataset
export interface BiodistributionDataPoint {
  group_name: string;
  organ_name: string;
  drug_name: string;
  mouse_strain_name: string;
  time_point_hours: string;
  time_point_display: string; // Legacy time point display (e.g., "1H", "4H")
  datapoint_display_name: string; // Display name for chart legend (e.g., "1H", "Group A - 1H")
  mean_uptake_percent_per_g: string;
  std_dev: string;
  std_error: string;
  sample_count: number;
  min_value: string;
  max_value: string;
}

// API response structure
export interface BiodistributionSummaryResponse {
  success: boolean;
  message: string;
  data: {
    dataset: BiodistributionDataPoint[];
    total_count: number;
  };
}

/**
 * UI-friendly transformed data for charting
 */
export interface BiodistributionChartData {
  organ: string;
  [key: string]: number | string; // Dynamic keys for time points like "1H", "4H", etc.
}

export interface BiodistributionErrorBar {
  organ: string;
  timePoint: string;
  stdDev: number;
  meanValue: number;
}

/**
 * Filter option types for biodistribution graph
 */
export interface BiodistributionTimepoint {
  time_point_display: string;
  time_point_hours: number;
}

export interface BiodistributionMouseGroup {
  id: number;
  group_name: string;
}

export interface BiodistributionOrgan {
  id: number;
  organ_name: string;
}

export interface BiodistributionCellLine {
  id: number;
  cell_line_name: string;
  vendor_name: string;
}

export interface BiodistributionExperimentDrug {
  id: number;
  drug_name: string;
  om_number: string;
}

export interface BiodistributionMouseStrain {
  id: number;
  mouse_strain_name: string;
}

/**
 * API response for biodistribution filters
 */
export interface BiodistributionFiltersResponse {
  success: boolean;
  message: string;
  data: {
    timepoints: BiodistributionTimepoint[];
    mouse_groups: BiodistributionMouseGroup[];
    organs: BiodistributionOrgan[];
    cell_lines: BiodistributionCellLine[];
    experiment_drugs: BiodistributionExperimentDrug[];
    mouse_strains: BiodistributionMouseStrain[];
  };
}
