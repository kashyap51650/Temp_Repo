import type { ApiResponse } from "@/lib/api";

export interface Mouse {
  id: number;
  mouse_delivery_id: string;
}

export interface MoveMiceResponse {
  success: boolean;
  message: string;
  data: Mouse[];
}

export interface TargetExperiment {
  id: number;
  experiment_name: string;
  project_id: number;
  study_type: string;
  study_type_id: number;
  specialization: string;
}

export interface TargetExperimentsResponse {
  success: boolean;
  message: string;
  data: TargetExperiment[];
}

export interface MoveMicePayload {
  source_experiment_id: number;
  target_experiment_id: number;
  mouse_ids: number[];
}

export type MoveMiceConfirmResponse = ApiResponse<{
  moved_count: number;
  target_experiment_id: number;
  source_experiment_id: number;
}>;

export const MoveMiceStep = {
  SELECT_MICE: 1,
  SELECT_TARGET_EXPERIMENT: 2,
  CREATE_EXPERIMENT: 3,
  STUDY_TYPE_FORM: 4,
} as const;

export type MoveMiceStepType = (typeof MoveMiceStep)[keyof typeof MoveMiceStep];
