/**
 * Model Study Types
 * Types for Model Study Experiment creation and management
 */

import type { ApiResponse, RandomizationStatus } from "@/lib/api";

export interface CellLineStrainPair {
  cell_line_id: number;
  mouse_strain_id: number;
}

export interface CreateModelStudyPayload {
  experiment_name: string;
  project_id: number;
  specialization: string;
  study_type_id: number;
  cell_line_strain_pairs: CellLineStrainPair[];
  cell_injection_count_ids: number[];
  vehicle_ids: number[];
  cell_injection_date: string; // ISO date format: YYYY-MM-DD
}

export interface ModelStudyExperiment {
  id: number;
  experiment_name: string;
  project_id: number;
  specialization: string;
  study_type_id: number;
  cell_line_strain_pairs: CellLineStrainPair[];
  cell_injection_count_ids: number[];
  vehicle_ids: number[];
  cell_injection_date: string;
  created_at?: string;
  updated_at?: string;
  radomization_status: RandomizationStatus;
}

export type CreateModelStudyResponse = ApiResponse<ModelStudyExperiment>;

export interface ModelStudyExperimentMouseGroupsPayload {
  experiment_id: number | undefined;
}
export interface ExperimentMouseGroupsType {
  group_id: number;
  group_code: string | number;
  group_name: string;
  cell_line_id: number;
  cell_line_name: string;
  mouse_strain_id: number;
  mouse_strain_name: string;
  vehicle_id: number;
  vehicle_name: string;
  cell_injection_count_id: number;
  cell_injection_count_value: string;
}

export interface ExperimentMouseGroupsWithDragIdType
  extends ExperimentMouseGroupsType {
  dragId: number;
}

export interface ModelStudyExperimentMouseGroups {
  experiment_id: number;
  total_groups: number;
  groups: Array<ExperimentMouseGroupsType>;
}

export type ModelStudyExperimentMouseGroupsResponse =
  ApiResponse<ModelStudyExperimentMouseGroups>;

export interface ConfirmExperimentMouseGroupsPayload {
  experiment_id: number;
  group_ids: Array<number>;
}

export interface ConfirmExperimentMouseGroupsResponse {
  experiment_id: number;
  message: string;
  total_groups_created: number;
}

export interface CalliperingNotesListParams {
  desc?: boolean;
  page?: number;
  size?: number;
}

export interface CalliperNoteCommentItem {
  id: number;
  comment: string;
  created_at: string;
  updated_at: string;
  creator: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export type CalliperingNotesListResponse = ApiResponse<{
  items: Array<CalliperNoteCommentItem>;
  pagination: {
    page: number;
    size: number;
    total: number;
    pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}>;

export interface CreateCalliperingNotesCommentPayload {
  caliper_measurement_id: number;
  comment: string;
}
export type CreateCalliperingNotesCommentResponse =
  ApiResponse<CalliperNoteCommentItem>;
