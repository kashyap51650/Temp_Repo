import type { ApiResponse } from "@/lib/api";

export type RandomizationPreviewResponse =
  ApiResponse<RandomizationPreviewData>;

export interface RandomizationPreviewData {
  experiment_id: number;
  randomization_type: string;
  mice_per_group: number;
  total_mice: number;
  total_groups: number;
  excluded_mice_count: number;
  groups: Group[];
  algorithm_summary: AlgorithmSummary;
}

export interface Group {
  group_code: string;
  group_name: string;
  mice_count: number;
  average_measurement: number;
  std_deviation: number;
  cell_line_id: number | null;
  strain: string | null;
  experiment_drug_id: number | null;
  mice: Mouse[];
}

export interface Mouse {
  mouse_id: number;
  mouse_code: string | null;
  mouse_delivery_id: string;
  measurement_value: number;
}

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

export type RandomizationGroup = {
  key: string;
  label: string;
  avarage_measurement: number;
  std_deviation: number;
  data: Array<
    { [key: string]: string | number } & { mouse: string; tumorVol: number }
  >;
};
