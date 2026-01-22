import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { CalliperingWorksheetEditData } from "@/types/callipering-sheet";

import { useCalliperingSheetData } from "./useCalliperingSheetData";
import { useExperimentDataByIdForCalliperingSheet } from "./useExperimentDataById";

/**
 * useCalliperingSheetEdit Hook
 *
 * Manages state and business logic for editing Calipering worksheets.
 * Handles multiple worksheets with independent state management.
 *
 * @param experimentDataId - ID of the experiment data
 * @returns Worksheet data and change handlers
 */
export function useCalliperingSheetEdit(experimentDataId?: string) {
  const {
    data: apiData,
    isLoading,
    error,
  } = useExperimentDataByIdForCalliperingSheet(experimentDataId || "");

  const { worksheets, hasMultipleWorksheets } =
    useCalliperingSheetData(apiData);

  const [worksheetData, setWorksheetData] = useState<
    Map<number, CalliperingWorksheetEditData>
  >(new Map());

  // Track if data has been initialized to prevent re-initialization
  const initializedRef = useRef(false);

  // Only initialize state ONCE when worksheets first load
  useEffect(() => {
    if (worksheets.length > 0 && !initializedRef.current) {
      const newWorksheetData = new Map<number, CalliperingWorksheetEditData>();

      worksheets.forEach((worksheet, index) => {
        newWorksheetData.set(index, {
          worksheetId: worksheet.worksheetId,
          worksheetName: worksheet.worksheetName,
          sex: worksheet.sex,
          strain: worksheet.strain,
          strainId: worksheet.strainId,
          dob: worksheet.dob,
          cellInjectionDate: worksheet.cellInjectionDate,
          cellLine: worksheet.cellLine,
          cellLineId: worksheet.cellLineId,
          treatmentDate: worksheet.treatmentDate,
          measurementDate: worksheet.measurementDate,
          mice: worksheet.mice.map((mouse) => ({
            id: mouse.id,
            measurement_id: mouse.measurement_id,
            length_mm: mouse.length_mm,
            width_mm: mouse.width_mm,
            volume_mm3: mouse.volume_mm3,
          })),
        });
      });

      setWorksheetData(newWorksheetData);
      initializedRef.current = true;
    }
  }, [worksheets]);

  // Memoized callback for header field changes
  const handleHeaderChange = useCallback(
    (worksheetIndex: number, field: string, value: string) => {
      setWorksheetData((prev) => {
        const newMap = new Map(prev);
        const worksheet = newMap.get(worksheetIndex);

        if (!worksheet) return prev;

        // Handle special cases for ID fields
        if (field === "strain" && !isNaN(Number(value))) {
          newMap.set(worksheetIndex, {
            ...worksheet,
            strainId: Number(value),
          });
        } else if (field === "cellLine" && !isNaN(Number(value))) {
          newMap.set(worksheetIndex, {
            ...worksheet,
            cellLineId: Number(value),
          });
        } else {
          newMap.set(worksheetIndex, {
            ...worksheet,
            [field]: value,
          });
        }

        return newMap;
      });
    },
    []
  );

  // Memoized callback for mouse measurement data changes
  const handleMouseDataChange = useCallback(
    (
      worksheetIndex: number,
      updater: (
        prev: Array<{
          id: string;
          measurement_id?: number;
          length_mm: number;
          width_mm: number;
          volume_mm3: number;
        }>
      ) => Array<{
        id: string;
        measurement_id?: number;
        length_mm: number;
        width_mm: number;
        volume_mm3: number;
      }>
    ) => {
      setWorksheetData((prev) => {
        const newMap = new Map(prev);
        const worksheet = newMap.get(worksheetIndex);

        if (!worksheet) return prev;

        const updatedMice = updater(worksheet.mice);
        newMap.set(worksheetIndex, {
          ...worksheet,
          mice: updatedMice,
        });

        return newMap;
      });
    },
    []
  );

  // Method to get current worksheet data (doesn't cause re-renders)
  const getCurrentData = useCallback(() => {
    return Array.from(worksheetData.values());
  }, [worksheetData]);

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      worksheetData,
      handleHeaderChange,
      handleMouseDataChange,
      getCurrentData,
      hasMultipleWorksheets,
      isLoading,
      error,
    }),
    [
      worksheetData,
      handleHeaderChange,
      handleMouseDataChange,
      getCurrentData,
      hasMultipleWorksheets,
      isLoading,
      error,
    ]
  );
}
