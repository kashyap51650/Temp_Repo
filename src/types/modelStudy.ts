/**
 * Model Study Types
 * Types for Model Study Experiment creation and management
 */

import type { ApiResponse } from "@/lib/api";

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
}

export type CreateModelStudyResponse = ApiResponse<ModelStudyExperiment>;
