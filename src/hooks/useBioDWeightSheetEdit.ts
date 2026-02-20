import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { WorksheetEditData } from "@/types/weight-sheet";

import { useBioDWeightSheetData } from "./useBioDWeightSheetData";
import { useExperimentDataByIdForWeightSheet } from "./useExperimentDataById";

/**
 * useBioDWeightSheetEdit Hook
 *
 * Manages state and business logic for editing BioDWeight worksheets.
 * Handles multiple worksheets with independent state management.
 *
 * ✅ INFINITE LOOP FIXES:
 * 1. Only initializes state once (not on every worksheet change)
 * 2. Removed problematic useEffect that called onSave
 * 3. Stable callback references with useCallback
 * 4. Proper dependency management
 *
 * @param experimentDataId - ID of the experiment data
 * @returns Worksheet data and change handlers
 */
export function useBioDWeightSheetEdit(experimentDataId?: string) {
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useExperimentDataByIdForWeightSheet(experimentDataId || "");

  const { worksheets, hasMultipleWorksheets } = useBioDWeightSheetData(
    apiResponse?.data
  );

  const [worksheetData, setWorksheetData] = useState<
    Map<number, WorksheetEditData>
  >(new Map());

  // ✅ Track if data has been initialized to prevent re-initialization
  const initializedRef = useRef(false);

  // ✅ Only initialize state ONCE when worksheets first load
  useEffect(() => {
    if (worksheets.length > 0 && !initializedRef.current) {
      const newWorksheetData = new Map<number, WorksheetEditData>();

      for (const [index, worksheet] of worksheets.entries()) {
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
            bodyWeight: mouse.bodyWeight,
            measurementId: mouse.measurementId,
          })),
        });
      }

      setWorksheetData(newWorksheetData);
      initializedRef.current = true;
    }
  }, [worksheets]); // ✅ Only depends on worksheets array

  // ✅ Memoized callback for header field changes
  const handleHeaderChange = useCallback(
    (worksheetIndex: number, field: string, value: string) => {
      setWorksheetData((prev) => {
        const newMap = new Map(prev);
        const worksheet = newMap.get(worksheetIndex);

        if (!worksheet) return prev;

        // Handle special cases for ID fields
        if (field === "strain" && !Number.isNaN(Number(value))) {
          newMap.set(worksheetIndex, {
            ...worksheet,
            strainId: Number(value),
          });
        } else if (field === "cellLine" && !Number.isNaN(Number(value))) {
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

  // ✅ Memoized callback for mouse data changes
  const handleMouseDataChange = useCallback(
    (
      worksheetIndex: number,
      updater: (
        prev: Array<{
          id: string;
          bodyWeight: number;
          measurementId?: number;
        }>
      ) => Array<{
        id: string;
        bodyWeight: number;
        measurementId?: number;
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

  // ✅ Method to get current worksheet data (doesn't cause re-renders)
  const getCurrentData = useCallback(() => {
    return Array.from(worksheetData.values());
  }, [worksheetData]);

  // ✅ Memoize return value to prevent unnecessary re-renders
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
