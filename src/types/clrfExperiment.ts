import type { RandomizationStatus } from "@/api";
import type { ApiResponse } from "@/lib/api";

export interface CreateClrfExperimentPayload {
  experiment_name: string;
  project_id: number;
  specialization: string;
  study_type_id: number;
}

export interface ClrfExperiment {
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

export type CreateClrfExperimentResponse = ApiResponse<ClrfExperiment>;

export interface ClrfExperimentDataUploadPayload {
  experiment_id: number;
  file: File;
}

export type ClrfExperimentDataUploadResponse = ApiResponse<{
  filename: string;
  file_type: string;
  experiment_id: number;
  uploaded_by: number;
}>;
