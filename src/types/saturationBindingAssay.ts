export interface WorksheetMetadata {
  id: number;
  worksheet_name: string;
}

export interface SaturationBindingAssayData {
  sample: string;
  measurements: { subtracted_wells: number }[];
  average?: number;
  sd?: number;
}

export interface KDValueData {
  key: string;
  value: string;
}

export interface WorksheetData {
  worksheet: WorksheetMetadata;
  saturation_binding_data: SaturationBindingAssayData[];
  metadata?: {
    isotope: { isotope_name: string };
    no_of_replica: number;
    peptide_cells: string;
    peptide_title: string;
  } | null;
  kd_values: KDValueData[];
}

export interface SaturationBindingAssayExperimentDataResponse {
  id: number;
  uploaded_data: {
    worksheets: WorksheetData[];
  };
}

export interface SaturationBindingAssaySheetRowData {
  id: number;
  sample: string;
  measurements: number[];
  average?: number;
  sd?: number;
}

export interface TransformedWorksheetData {
  worksheetId: number;
  worksheetName: string;
  nValue: number;
  isotopeName: string;
  peptideCells: string;
  kdValues: KDValueData[];
  saturationBindingData: SaturationBindingAssaySheetRowData[];
}
