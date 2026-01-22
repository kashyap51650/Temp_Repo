/**
 * Types for Callipering Sheet Multi-Worksheet View
 */

import type { ApiResponse } from "@/lib/api";

import type { CellLine, MouseStrain } from "./common";

/**
 * Mouse information in measurements
 */
export interface MouseInfo {
  id: number;
  mouse_delivery_id: string;
  mouse_code: string | null;
  experiment_id: number;
}

/**
 * Single callipering measurement from API
 */
export interface CalliperingMeasurement {
  id: number;
  mouse: MouseInfo;
  measurement_date: string;
  treatment_date: string | null;
  length_mm: number;
  width_mm: number;
  volume_mm3: number;
  is_flagged: boolean;
  notes: string | null;
}

/**
 * Worksheet metadata from API
 */
export interface CalliperingWorksheetMetadata {
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

/**
 * Single worksheet data from API (worksheet info + measurements)
 */
export interface CalliperingWorksheetData {
  worksheet: CalliperingWorksheetMetadata;
  measurements: CalliperingMeasurement[];
}

/**
 * Root API response structure
 */
export interface CalliperingSheetApiResponse {
  id: number;
  uploaded_data: {
    worksheets: CalliperingWorksheetData[];
  };
}

/**
 * Mouse row for display in DataTable
 */
export interface CalliperingMouseRow {
  id: string; // mouse_delivery_id
  length_mm: number;
  width_mm: number;
  volume_mm3: number;
  notes: string | null;
  measurement_id: number;
  is_flagged: boolean;
  mouseId: number;
}

/**
 * Transformed worksheet data for component display
 */
export interface TransformedCalliperingWorksheetData {
  worksheetId: number;
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
  mice: CalliperingMouseRow[];
}

/**
 * Worksheet edit data structure for mutations
 */
export interface CalliperingWorksheetEditData {
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
    measurement_id?: number;
    length_mm: number;
    width_mm: number;
    volume_mm3: number;
  }>;
}

/**
 * Mouse termination payload
 */
export interface TerminateMicePayload {
  experiment_id: number;
  mouse_ids: number[];
  termination_reason: string;
}

/**
 * Mouse termination response
 */
export type TerminateMiceResponse = ApiResponse<{
  message: string;
  terminated_count: number;
  terminated_mice: Array<{
    mouse_id: number;
    mouse_code: string | null;
    is_terminated: boolean;
    termination_date: string;
    termination_type: string;
    termination_reason: string;
  }>;
}>;
