import { useMemo } from "react";

import type {
  TransformedWorksheetData,
  WeightSheetApiResponse,
  WorksheetData,
} from "@/types/weight-sheet";

/**
 * Custom hook to transform BioDWeightSheet API data for multi-sheet tab view
 */
export function useBioDWeightSheetData(apiData?: WeightSheetApiResponse) {
  const transformedWorksheets = useMemo<TransformedWorksheetData[]>(() => {
    if (!apiData?.uploaded_data?.worksheets) return [];

    return apiData.uploaded_data.worksheets.map(
      (worksheetData: WorksheetData) => {
        const { worksheet, measurements } = worksheetData;

        return {
          worksheetId: worksheet.id,
          worksheetName: worksheet.worksheet_name,
          sex: worksheet.sex,
          strain: worksheet.mouse_strain.mouse_strain_name,
          strainId: worksheet.mouse_strain.id,
          dob: worksheet.date_of_birth,
          cellInjectionDate: worksheet?.cell_injection_date,
          cellLine: worksheet?.cell_line?.cell_line_name,
          cellLineId: worksheet?.cell_line?.id,
          treatmentDate: worksheet?.treatment_date || "N/A",
          measurementDate: worksheet.measurement_date,
          mice: measurements.map((measurement) => ({
            id: measurement.mouse.mouse_delivery_id,
            bodyWeight: measurement.body_weight_grams,
            measurementId: measurement.id,
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
