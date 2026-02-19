import type { RandomizationStatus } from "@/api";
import type { ApiResponse } from "@/lib";

export interface CreateSaturationBindingExperimentPayload {
  experiment_name: string;
  project_id: number;
  specialization: string;
  study_type_id: number;
}

export interface SaturationBindingExperiment {
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

export type CreateSaturationBindingExperimentResponse =
  ApiResponse<SaturationBindingExperiment>;

export interface SaturationBindingExperimentDataUploadPayload {
  experiment_id: number;
  file: File;
  no_of_replica: number;
}

export type SaturationBindingExperimentDataUploadResponse = ApiResponse<{
  filename: string;
  file_type: string;
  experiment_id: number;
  uploaded_by: number;
}>;
