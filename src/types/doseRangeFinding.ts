import type { ApiResponse, RandomizationStatus } from "@/lib/api";

export interface CreateDoseRangeFindingPayload {
  experiment_name: string;
  project_id: number;
  specialization: string;
  study_type_id: number;
  dose_ids: number[];
  experiment_drug_ids: number[];
}

export interface DoseRangeFindingExperiment {
  id: number;
  experiment_name: string;
  project_id: number;
  specialization: string;
  study_type_id: number;
  created_at?: string;
  updated_at?: string;
  radomization_status: RandomizationStatus;
  study_type: {
    id: number;
    study_type_name: string;
  };
  project: {
    id: number;
    project_name: string;
    project_status: string;
  };
  drugs: {
    id: number;
    drug_name: string;
    om_number: string;
    drug_description: string;
  }[];
  doses: {
    id: number;
    name: string;
  }[];
}

export type CreateDoseRangeFindingResponse =
  ApiResponse<DoseRangeFindingExperiment>;
