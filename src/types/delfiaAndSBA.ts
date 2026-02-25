import type {
  DelfiaData,
  DelfiaExperimentDataResponse,
  DelfiaSheetRowData,
  DelfiaWorksheetData,
  TransformedDelfiaWorksheetData,
} from "./delfiaExperiment";
import type {
  SaturationBindingAssayData,
  SaturationBindingAssayExperimentDataResponse,
  SaturationBindingAssaySheetRowData,
  SBAWorksheetData,
  TransformedSBAWorksheetData,
} from "./saturationBindingAssay";

export type DelfiaOrSBAWorksheetData = DelfiaWorksheetData | SBAWorksheetData;

export type DelfiaOrSBAExperimentDataResponse =
  | DelfiaExperimentDataResponse
  | SaturationBindingAssayExperimentDataResponse;

export type WorksheetMeasurementData = DelfiaData | SaturationBindingAssayData;

export type WorksheetSheetRowData =
  | DelfiaSheetRowData
  | SaturationBindingAssaySheetRowData;

export type TransformedWorksheetData =
  | TransformedDelfiaWorksheetData
  | TransformedSBAWorksheetData;
