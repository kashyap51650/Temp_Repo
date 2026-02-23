import type { RandomizationStatus } from "@/api";
import type { ApiResponse } from "@/lib";

export type CreateEfficacyExperimentPayload = {
  cell_line_ids: number[];
  experiment_name: string;
  groups: {
    cell_line_id: number | null;
    dose_frequency_id: number | null;
    experiment_drug_id: number | null;
    market_dose_id: number | null;
    no_of_doses: number | null;
    no_of_mice: number | null;
    radiation_dose_id: number | null;
    strain_id: number | null;
  }[];
  mouse_strain_ids: number[];
  project_id: number;
  specialization: string;
};

export type EfficacyExperimentResponse = ApiResponse<{
  experiment: {
    id: number;
    experiment_name: string;
    protocol_number: string;
    project_id: number;
    isotope_id: number | null;
    study_type_id: number;
    specialization: string;
    start_date: string | null;
    end_date: string | null;
    status: string;
    randomization_status: RandomizationStatus;
    fda_tag: boolean;
    whoops: string | null;
    conclusion: string | null;
    next_steps: string | null;
    repeat_of: number | null;
    isotope: unknown | null;

    cell_lines: {
      id: number;
      cell_line_name: string;
      vendor_name: string;
    }[];

    mouse_strains: {
      id: number;
      mouse_strain_name: string;
      mouse_strain_description: string;
    }[];

    study_type: {
      id: number;
      study_type_name: string;
    };

    repeated_experiment: unknown | null;

    project: {
      id: number;
      project_name: string;
      project_status: string;
    };

    created_by: number;
    updated_by: number;
    created_at: string;
    updated_at: string;
  };

  groups: {
    id: number;
    group_code: string;
    experiment_id: number;
    market_dose_id: number | null;
    experiment_drug_id: number | null;
    no_of_doses: number | null;
    dose_id: number | null;
    dose_frequency_id: number | null;
    mouse_strain_id: number;
    cell_line_id: number | null;
  }[];

  total_groups: number;
}>;
