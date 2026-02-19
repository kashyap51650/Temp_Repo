import { useMemo } from "react";

import type {
  SaturationBindingAssayExperimentDataResponse,
  TransformedWorksheetData,
  WorksheetData,
} from "@/types/saturationBindingAssay";

export function useSaturationBindingAssaySheetData(
  apiData?: SaturationBindingAssayExperimentDataResponse
) {
  const transformedWorksheets = useMemo<TransformedWorksheetData[]>(() => {
    if (!apiData?.uploaded_data?.worksheets) return [];

    return apiData.uploaded_data.worksheets.map(
      (worksheetData: WorksheetData) => {
        const { worksheet, saturation_binding_data, kd_values, metadata } =
          worksheetData;

        return {
          worksheetId: worksheet.id,
          worksheetName: worksheet.worksheet_name,
          kdValues: kd_values,
          nValue: metadata?.no_of_replica ?? 1,
          isotopeName: metadata?.isotope?.isotope_name ?? "N/A",
          peptideCells: metadata?.peptide_cells ?? "N/A",
          saturationBindingData: saturation_binding_data.map((data, index) => ({
            id: index,
            sample: data.sample,
            measurements: data.measurements.map(
              (value) => value.subtracted_wells
            ),
            average: data?.average,
            sd: data?.sd,
          })),
        };
      }
    );
  }, [apiData]);

  const hasMultipleWorksheets = transformedWorksheets.length > 1;

  return {
    worksheets: transformedWorksheets,
    hasMultipleWorksheets,
    worksheetCount: transformedWorksheets.length,
  };
}
