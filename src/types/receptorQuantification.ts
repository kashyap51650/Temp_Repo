import type { RandomizationStatus } from "@/api";
import type { ApiResponse } from "@/lib/api";

export interface CreateReceptorQuantificationExperimentPayload {
  experiment_name: string;
  project_id: number;
  specialization: string;
  study_type_id: number;
  cell_line_ids: number[];
  primary_antibody_id: number;
  secondary_antibody_id?: number;
  no_of_receptors: number;
}

export interface ReceptorQuantificationExperiment {
  id: number;
  experiment_name: string;
  project_id: number;
  specialization: string;
  study_type_id: number;
  created_at?: string;
  updated_at?: string;
  randomization_status?: RandomizationStatus;
  study_type: {
    id: number;
    study_type_name: string;
  };
  project: {
    id: number;
    project_name: string;
    project_status: string;
  };
}

export type CreateReceptorQuantificationExperimentResponse =
  ApiResponse<ReceptorQuantificationExperiment>;

export interface ReceptorQuantificationExperimentDataUploadPayload {
  experiment_id: number;
  file: File;
}

export type ReceptorQuantificationExperimentDataUploadResponse = ApiResponse<{
  filename: string;
  file_type: string;
  experiment_id: number;
  uploaded_by: number;
}>;
