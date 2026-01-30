import type { ApiResponse } from "@/lib/api";

/* ============================================================
 * Core Shared Models
 * ============================================================
 */

/** Mouse entity (used across all responses) */
export interface Mouse {
  mouse_id: number;
  mouse_code: string | null;
  mouse_delivery_id: string;
  measurement_value: number;
}

/** Base group shared by all randomization responses */
export interface BaseGroup {
  group_code: string;
  group_name: string;
  mice_count: number;
  average_measurement: number;
  std_deviation: number;
  cell_line_id: number | null;
  strain: string | null;
  mice: Mouse[];
}

/* ============================================================
 * Group Variants
 * ============================================================
 */

/** Group used in randomization preview */
export interface RandomizationGroup extends BaseGroup {
  experiment_drug_id: number | null;
}

/** Drug model (expanded form) */
export interface ExperimentDrug {
  id: number;
  drug_description: string;
  drug_name: string;
  om_number: string;
}

/** Group used in view randomization response */
export interface ViewRandomizationGroup extends BaseGroup {
  experiment_drug: ExperimentDrug | null;
}

/* ============================================================
 * Algorithm Summary
 * ============================================================
 */

export interface AlgorithmSummary {
  rule_1_cell_line_homogeneity: boolean;
  rule_2_strain_homogeneity: boolean;
  rule_3_measurement_balance: number;
  rule_4_std_dev_balance: number;
  overall_average: number;
  group_size_variance: number;
  total_groups: number;
  cell_line_violations: number;
  strain_violations: number;
}

/* ============================================================
 * Randomization Preview Response
 * ============================================================
 */

export interface RandomizationPreviewData {
  experiment_id: number;
  randomization_type: string;
  mice_per_group: number;
  total_mice: number;
  total_groups: number;
  excluded_mice_count: number;
  groups: RandomizationGroup[];
  algorithm_summary: AlgorithmSummary;
  buffer_groups?: string[]; // For dose range finding weight sheets
}

export type RandomizationPreviewResponse =
  ApiResponse<RandomizationPreviewData>;

/* ============================================================
 * View Randomization Group Response
 * ============================================================
 */

export interface ViewRandomizationGroupData {
  experiment_id: number;
  mice_per_group: number;
  total_mice: number;
  total_groups: number;
  groups: ViewRandomizationGroup[];
}

export type ViewRandomizationGroupResponse =
  ApiResponse<ViewRandomizationGroupData>;

/* ============================================================
 * UI / View Models (Derived, not API-bound)
 * ============================================================
 */

export type RandomizationGroupUI = {
  key: string;
  label: string;
  average_measurement: number;
  std_deviation: number;
  data: Array<
    {
      mouse: string;
      tumorVol: number;
    } & Record<string, string | number>
  >;
  experiment_drug_id?: number | null;
};
