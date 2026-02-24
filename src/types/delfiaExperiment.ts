import type { RandomizationStatus } from "@/api";
import type { ApiResponse } from "@/lib";

export interface CreateDelfiaExperimentPayload {
  experiment_name: string;
  project_id: number;
  specialization: string;
  study_type_id: number;
}

export interface DelfiaExperiment {
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

export type CreateDelfiaExperimentResponse = ApiResponse<DelfiaExperiment>;

export interface DelfiaWorksheetMetadata {
  id: number;
  worksheet_name: string;
}

export interface DelfiaData {
  sample: string;
  measurements: { subtracted_wells: number }[];
  average?: number;
  sd?: number;
}

export interface KDValueData {
  key: string;
  value: string;
}

export interface DelfiaWorksheetData {
  worksheet: DelfiaWorksheetMetadata;
  delfia_data: DelfiaData[];
  metadata?: {
    isotope: { isotope_name: string };
    no_of_replica: number;
    peptide_cells: string;
    peptide_title: string;
  } | null;
  kd_values: KDValueData[];
}

export interface DelfiaExperimentDataResponse {
  id: number;
  uploaded_data: {
    worksheets: DelfiaWorksheetData[];
  };
}

export interface DelfiaSheetRowData {
  id: number;
  sample: string;
  measurements: number[];
  average?: number;
  sd?: number;
}

export interface TransformedDelfiaWorksheetData {
  worksheetId: number;
  worksheetName: string;
  nValue: number;
  isotopeName: string;
  peptideCells: string;
  kdValues: KDValueData[];
  tableData: DelfiaSheetRowData[];
}
