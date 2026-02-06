import type { RandomizationStatus } from "@/api";
import type { ApiResponse } from "@/lib/api";

export interface CreateConjugationExperimentPayload {
  experiment_name: string;
  project_id: number;
  specialization: string;
  study_type_id: number;
}

export interface ConjugationExperiment {
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

export type CreateConjugationExperimentResponse =
  ApiResponse<ConjugationExperiment>;
