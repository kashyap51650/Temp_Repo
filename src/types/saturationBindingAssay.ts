export interface SBAWorksheetMetadata {
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

export interface SBAWorksheetData {
  worksheet: SBAWorksheetMetadata;
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
    worksheets: SBAWorksheetData[];
  };
}

export interface SaturationBindingAssaySheetRowData {
  id: number;
  sample: string;
  measurements: number[];
  average?: number;
  sd?: number;
}

export interface TransformedSBAWorksheetData {
  worksheetId: number;
  worksheetName: string;
  nValue: number;
  isotopeName: string;
  peptideCells: string;
  kdValues: KDValueData[];
  tableData: SaturationBindingAssaySheetRowData[];
}
