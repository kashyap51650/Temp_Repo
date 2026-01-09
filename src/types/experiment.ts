import type { ApiResponse } from "@/lib/api";
import type { ExperimentStatus } from "@/lib/constants";

export interface Project {
  id: number;
  project_name: string;
  project_status: "In Progress" | "Completed" | "On Hold" | string;
}
export interface CellLine {
  id: number;
  cell_line_name: string;
  vendor_name: string;
}
export interface MouseStrain {
  id: number;
  mouse_strain_name: string;
}
export interface Isotope {
  id: number;
  isotope_name: string;
  half_life_hours: number;
}
export interface StudyType {
  id: number;
  study_type_name: string;
}
export interface Experiment {
  id: number;

  experiment_name: string;
  protocol_number: string;

  specialization: "PRECLINICAL" | "CLINICAL" | string;
  status: ExperimentStatus;

  fda_tag: boolean;

  start_date: string | null;
  end_date: string | null;

  conclusion: string | null;
  next_steps: string | null;
  whoops: string | null;

  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;

  repeat_of: number | null;
  repeated_experiment: Experiment | null;

  project_id: number;
  project: Project;

  study_type_id: number;
  study_type: StudyType;

  isotope_id: number;
  isotope: Isotope;

  cell_lines: CellLine[];
  mouse_strains: MouseStrain[];
}

// Experiments list response with pagination
export type ExperimentsListResponse = ApiResponse<{
  experiments: Experiment[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}>;

// Filters for experiments API
export interface ExperimentListFilters {
  project_id?: number | null;
  page?: number;
  size?: number;
  search?: string;
  status?: ExperimentStatus;
}
