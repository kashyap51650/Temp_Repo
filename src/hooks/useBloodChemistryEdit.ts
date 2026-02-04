import { useCallback, useMemo, useState } from "react";

import type {
  BloodChemistryReport,
  BloodChemistryReportParameters,
  SaveBloodChemistryPDFPayload,
} from "@/types/bloodChemistry";

interface UseBloodChemistryDataEditProps {
  initialData: BloodChemistryReport;
  experimentId: number;
}

/**
 * useBloodChemistryDataEdit Hook
 *
 * Manages state and business logic for editing Blood Chemistry report data.
 * Handles multiple reports with independent state management.
 *
 * @param initialData - Initial blood chemistry report data
 * @param experimentId - ID of the associated experiment
 * @returns Editable data and stable change handlers
 */
export function useBloodChemistryDataEdit({
  initialData,
  experimentId,
}: UseBloodChemistryDataEditProps) {
  const [editableData, setEditableData] =
    useState<SaveBloodChemistryPDFPayload>({
      experiment_id: experimentId,
      reports_data: initialData.reports_data,
    });

  const reports = editableData.reports_data;

  const handleParameterChange = useCallback(
    (
      reportIndex: number,
      paramIndex: number,
      field: keyof BloodChemistryReportParameters,
      value: string
    ) => {
      setEditableData((prevData) => {
        const newData = { ...prevData };
        const updatedReports = [...newData.reports_data];
        const updatedParameters = [...updatedReports[reportIndex].parameters];

        updatedParameters[paramIndex] = {
          ...updatedParameters[paramIndex],
          [field]: value,
        };

        updatedReports[reportIndex] = {
          ...updatedReports[reportIndex],
          parameters: updatedParameters,
        };

        const updatedData = {
          ...newData,
          reports_data: updatedReports,
        };

        return updatedData;
      });
    },
    []
  );

  const handleMouseChange = useCallback(
    (reportIndex: number, mouseId: number) => {
      setEditableData((prevData) => {
        const newData = { ...prevData };
        const updatedReports = [...newData.reports_data];

        updatedReports[reportIndex] = {
          ...updatedReports[reportIndex],
          mouse_id: mouseId,
          mouse: null,
        };

        return {
          ...newData,
          reports_data: updatedReports,
        };
      });
    },
    []
  );

  const handleReportDateTimeChange = useCallback(
    (reportIndex: number, dateTime: string) => {
      setEditableData((prevData) => {
        const newData = { ...prevData };
        const updatedReports = [...newData.reports_data];

        updatedReports[reportIndex] = {
          ...updatedReports[reportIndex],
          report_datetime: dateTime,
        };

        return {
          ...newData,
          reports_data: updatedReports,
        };
      });
    },
    []
  );

  const reportCallbacks = useMemo(
    () =>
      reports.map(
        (_, reportIndex) =>
          (
            paramIndex: number,
            field: keyof BloodChemistryReportParameters,
            value: string
          ) =>
            handleParameterChange(reportIndex, paramIndex, field, value)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reports.length, handleParameterChange]
  );

  const mouseChangeCallbacks = useMemo(
    () =>
      reports.map(
        (_, reportIndex) => (mouseId: number) =>
          handleMouseChange(reportIndex, mouseId)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reports.length, handleMouseChange]
  );

  const reportDateTimeChangeCallbacks = useMemo(
    () =>
      reports.map(
        (_, reportIndex) => (dateTime: string) =>
          handleReportDateTimeChange(reportIndex, dateTime)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reports.length, handleReportDateTimeChange]
  );

  const resetData = useCallback(() => {
    setEditableData({
      experiment_id: experimentId,
      reports_data: initialData.reports_data,
    });
  }, [initialData.reports_data, experimentId]);

  return {
    editableData,
    reportCallbacks,
    mouseChangeCallbacks,
    reportDateTimeChangeCallbacks,
    resetData,
    setEditableData,
  };
}
