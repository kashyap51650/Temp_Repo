import type { ApiResponse } from "@/lib/api";

export interface EfficacyRandomizationGroupsParams {
  experiment_id: number;
}

export interface EfficacyRandomizationMouse {
  mouse_id: number;
  mouse_code: string | null;
  mouse_delivery_id: string;
  measurement_value: string | number;
}

interface EfficacyRandomizationGroupBase {
  group_id: number;
  group_code: string;
  group_name: string;
  parent_group_id: number | null;
  mice_count: number;
  cell_line_id: number | null;
  mouse_strain_id: number | null;
  experiment_drug_id: number | null;
  dose_id: number | null;
  frequency_id: number | null;
  is_locked: boolean;
  ready_for_randomization: boolean;
}

export interface EfficacyRandomizationSubgroup
  extends EfficacyRandomizationGroupBase {
  average_measurement: number;
  std_deviation: number;
  no_of_doses: number;
  no_of_completed_doses: number;
  mice: EfficacyRandomizationMouse[];
}

export interface EfficacyRandomizationGroup
  extends EfficacyRandomizationGroupBase {
  subgroups: EfficacyRandomizationSubgroup[];
}

export interface EfficacyRandomizationGroupsData {
  experiment_id: number;
  groups: EfficacyRandomizationGroup[];
}

export type EfficacyRandomizationGroupsResponse =
  ApiResponse<EfficacyRandomizationGroupsData>;

export interface EfficacyRandomizationPreviewPayload {
  experiment_id: number;
  parent_group_id: number;
}

export interface EfficacyRandomizationPreviewGroup
  extends EfficacyRandomizationGroupBase {
  label: string;
  average_measurement: string;
  std_deviation: string;
  no_of_doses: number;
  no_of_completed_doses: number;
  mice: EfficacyRandomizationMouse[];
}

export interface EfficacyRandomizationPreviewData {
  experiment_id: number;
  parent_group_id: number;
  current_subgroup_id: number;
  next_subgroup_id: number;
  mice_to_fix: number;
  mice_to_move: number;
  no_of_completed_dose: number;
  no_of_doses: number;
  randomization_type: string;
  stay_group: EfficacyRandomizationPreviewGroup;
  move_group: EfficacyRandomizationPreviewGroup;
  algorithm_summary: Record<string, unknown>;
}

export type EfficacyRandomizationPreviewResponse =
  ApiResponse<EfficacyRandomizationPreviewData>;

export interface EfficacyRandomizationConfirmSubgroupMouse {
  mouse_id: number;
}

export interface EfficacyRandomizationConfirmSubgroup {
  group_id: number;
  mice: EfficacyRandomizationConfirmSubgroupMouse[];
  type: "stay_group" | "move_group";
}

export interface EfficacyRandomizationConfirmPayload {
  experiment_id: number;
  parent_group_id: number;
  subgroups: EfficacyRandomizationConfirmSubgroup[];
}

export interface EfficacyRandomizationConfirmData {
  experiment_id: number;
  parent_group_id: number;
  locked_subgroup_id: number;
  locked_subgroup_code: string;
  mice_fixed: number;
  mice_moved_to_next: number;
  next_subgroup_id: number;
  next_subgroup_code: string;
  all_subgroups_locked: boolean;
  experiment_completed: boolean;
  randomization_date: string;
}

export type EfficacyRandomizationConfirmResponse =
  ApiResponse<EfficacyRandomizationConfirmData>;

export interface EfficacyRandomizationStatusSubgroup {
  subgroup_id: number;
  group_code: string;
  group_name: string;
  is_active: boolean;
  is_locked: boolean;
  no_of_doses: number;
  no_of_completed_doses: number;
  no_of_mice: number;
  mice_currently_assigned: number;
}

export interface EfficacyRandomizationStatusParentGroup {
  parent_group_id: number;
  parent_group_code: string;
  all_locked: boolean;
  subgroups: EfficacyRandomizationStatusSubgroup[];
}

export interface EfficacyRandomizationStatusData {
  experiment_id: number;
  experiment_randomization_status: string;
  parent_groups: EfficacyRandomizationStatusParentGroup[];
}

export type EfficacyRandomizationStatusResponse =
  ApiResponse<EfficacyRandomizationStatusData>;
