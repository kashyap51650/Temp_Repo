import { useMemo } from "react";

import type {
  DelfiaOrSBAExperimentDataResponse,
  DelfiaOrSBAWorksheetData,
  TransformedWorksheetData,
  WorksheetMeasurementData,
} from "@/types/delfiaAndSBA";

function getWorksheetExperimentData(
  worksheet: DelfiaOrSBAWorksheetData
): WorksheetMeasurementData[] {
  return "delfia_data" in worksheet
    ? worksheet.delfia_data
    : worksheet.saturation_binding_data;
}

export function useDelfiaAndSBASheetData(
  apiData?: DelfiaOrSBAExperimentDataResponse
) {
  const transformedWorksheets = useMemo<TransformedWorksheetData[]>(() => {
    if (!apiData?.uploaded_data?.worksheets) return [];

    return apiData.uploaded_data.worksheets.map(
      (worksheetData: DelfiaOrSBAWorksheetData) => {
        const { worksheet, kd_values, metadata } = worksheetData;
        const experimentData = getWorksheetExperimentData(worksheetData);

        return {
          worksheetId: worksheet.id,
          worksheetName: worksheet.worksheet_name,
          kdValues: kd_values,
          nValue: metadata?.no_of_replica ?? 1,
          isotopeName: metadata?.isotope?.isotope_name ?? "N/A",
          peptideCells: metadata?.peptide_cells ?? "N/A",
          tableData: experimentData.map((data, index) => ({
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
