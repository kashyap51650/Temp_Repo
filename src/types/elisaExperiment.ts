import type { RandomizationStatus } from "@/api";
import type { ApiResponse } from "@/lib";

interface KdValuesType {
  kd_key: string;
  kd_value: string;
}

export interface CreateElisaExperimentPayload {
  experiment_name: string;
  project_id: number;
  specialization: string;
  study_type_id: number;
  kd_values: KdValuesType[];
}

export interface ElisaExperiment {
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

export type CreateElisaExperimentResponse = ApiResponse<ElisaExperiment>;
export interface ElisaFileType {
  file_type: string;
  file_url: string;
  filename: string;
  uploaded_at: string;
}

export type ElisaExperimentDataResponse = ApiResponse<{
  elisa_file: ElisaFileType;
  experiment_data_id: number;
}>;
