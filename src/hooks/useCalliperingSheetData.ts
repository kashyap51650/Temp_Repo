import { useMemo } from "react";

import type {
  CalliperingSheetApiResponse,
  CalliperingWorksheetData,
  TransformedCalliperingWorksheetData,
} from "@/types/callipering-sheet";

/**
 * Custom hook to transform Callipering Sheet API data for multi-sheet tab view
 *
 * @param apiData - Raw API response containing worksheets and measurements
 * @returns Transformed worksheets data, multi-sheet flag, and worksheet count
 *
 * @example
 * ```tsx
 * const { worksheets, hasMultipleWorksheets } = useCalliperingSheetData(apiData);
 *
 * if (hasMultipleWorksheets) {
 *   return <TabView worksheets={worksheets} />;
 * }
 * ```
 */
export function useCalliperingSheetData(apiData?: CalliperingSheetApiResponse) {
  const transformedWorksheets = useMemo<
    TransformedCalliperingWorksheetData[]
  >(() => {
    if (!apiData?.uploaded_data?.worksheets) return [];

    return apiData.uploaded_data.worksheets.map(
      (worksheetData: CalliperingWorksheetData) => {
        const { worksheet, measurements } = worksheetData;

        return {
          worksheetId: worksheet.id,
          worksheetName: worksheet.worksheet_name,
          sex: worksheet.sex,
          strain: worksheet.mouse_strain.mouse_strain_name,
          strainId: worksheet.mouse_strain.id,
          dob: worksheet.date_of_birth,
          cellInjectionDate: worksheet.cell_injection_date,
          cellLine: worksheet.cell_line.cell_line_name,
          cellLineId: worksheet.cell_line.id,
          treatmentDate: worksheet.treatment_date || "N/A",
          measurementDate: worksheet.measurement_date,
          mice: measurements.map((measurement) => ({
            id: measurement.mouse.mouse_delivery_id,
            mouseId: measurement.mouse.id,
            measurement_id: measurement.id,
            length_mm: measurement.length_mm,
            width_mm: measurement.width_mm,
            volume_mm3: measurement.volume_mm3,
            notes: measurement.notes || null,
            is_flagged: measurement.is_flagged,
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
