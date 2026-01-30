import { useCallback, useMemo, useState } from "react";

import type {
  HematologyReport,
  ReportParameters,
  SaveHematologyPDFPayload,
} from "@/types/hematology";

interface UseHematologyDataEditProps {
  initialData: HematologyReport;
  experimentId: number;
}

/**
 * useHematologyDataEdit Hook
 *
 * Manages state and business logic for editing Hematology report data.
 * Handles multiple reports with independent state management.
 *
 * @param initialData - Initial hematology report data
 * @param experimentId - ID of the associated experiment
 * @returns Editable data and stable change handlers
 */
export function useHematologyDataEdit({
  initialData,
  experimentId,
}: UseHematologyDataEditProps) {
  const [editableData, setEditableData] = useState<SaveHematologyPDFPayload>({
    experiment_id: experimentId,
    reports_data: initialData.reports_data,
  });

  const reports = editableData.reports_data;

  // Memoize the parameter change handler to prevent recreation
  const handleParameterChange = useCallback(
    (
      reportIndex: number,
      paramIndex: number,
      field: keyof ReportParameters,
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

  // Handle mouse selection change
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

  // Handle report date and time change
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

  // Create stable callbacks for each report
  const reportCallbacks = useMemo(
    () =>
      reports.map(
        (_, reportIndex) =>
          (paramIndex: number, field: keyof ReportParameters, value: string) =>
            handleParameterChange(reportIndex, paramIndex, field, value)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reports.length, handleParameterChange]
  );

  // Create stable mouse change callbacks for each report
  const mouseChangeCallbacks = useMemo(
    () =>
      reports.map(
        (_, reportIndex) => (mouseId: number) =>
          handleMouseChange(reportIndex, mouseId)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reports.length, handleMouseChange]
  );

  // Create stable report date/time change callbacks for each report
  const reportDateTimeChangeCallbacks = useMemo(
    () =>
      reports.map(
        (_, reportIndex) => (dateTime: string) =>
          handleReportDateTimeChange(reportIndex, dateTime)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reports.length, handleReportDateTimeChange]
  );

  // Reset to initial data
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
