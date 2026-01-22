/**
 * Type definitions for BioDWeightSheet API response
 */

import type { CellLine, MouseStrain } from "./common";

export interface Mouse {
  id: number;
  mouse_delivery_id: string;
  mouse_code: string | null;
  experiment_id: number;
}

export interface BodyWeightMeasurement {
  id: number;
  mouse: Mouse;
  measurement_date: string;
  body_weight_grams: number;
  baseline_weight_grams: number;
  percent_change: number;
  is_flagged: boolean;
  terminated: boolean;
  treatment_date: string | null;
  treatment_phase: string;
}

export interface WorksheetMetadata {
  id: number;
  worksheet_name: string;
  measurement_date: string;
  treatment_date: string | null;
  sex: string;
  date_of_birth: string;
  mouse_strain: MouseStrain;
  cell_line: CellLine;
  cell_injection_date: string;
}

export interface WorksheetData {
  worksheet: WorksheetMetadata;
  measurements: BodyWeightMeasurement[];
}

export interface WeightSheetApiResponse {
  id: number;
  uploaded_data: {
    worksheets: WorksheetData[];
  };
}

/**
 * Transformed data for display in the component
 */
export interface TransformedWorksheetData {
  worksheetId: number;
  worksheetName: string;
  sex: string;
  strain: string;
  strainId?: number;
  cellLineId?: number;
  dob: string;
  cellInjectionDate: string;
  cellLine: string;
  treatmentDate: string;
  measurementDate: string;
  mice: {
    id: string;
    bodyWeight: number;
    measurementId: number;
  }[];
}

/**
 * Mouse pair row for DataTable display
 */
export interface MousePairRow {
  id: string;
  leftId: string;
  leftWeight: number;
  rightId?: string;
  rightWeight?: number;
}

export interface WorksheetEditData {
  worksheetId?: number;
  worksheetName: string;
  sex: string;
  strain: string;
  strainId?: number;
  dob: string;
  cellInjectionDate: string;
  cellLine: string;
  cellLineId?: number;
  treatmentDate: string;
  measurementDate: string;
  mice: Array<{
    id: string;
    bodyWeight: number;
    measurementId?: number;
  }>;
}
