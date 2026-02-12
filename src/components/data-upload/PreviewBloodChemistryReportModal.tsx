import { useState } from "react";
import { toast } from "sonner";

import {
  useBloodChemistryDataEdit,
  useSaveBloodChemistryReport,
} from "@/hooks";
import type { BloodChemistryReport } from "@/types/bloodChemistry";

import { Button, Dialog } from "../atoms";
import ViewBloodChemistryData from "../molecules/ViewBloodChemistryData";

interface PreviewBloodChemistryReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bloodChemistryData: BloodChemistryReport;
  experimentId: number;
  onSaveSuccess?: () => void;
}

/**
 * PreviewBloodChemistryReportModal Component
 *
 * Handles previewing and editing blood chemistry data passed via props.
 * Used after PDF upload to preview extracted data before saving.
 */
export default function PreviewBloodChemistryReportModal({
  experimentId,
  open,
  onOpenChange,
  bloodChemistryData,
  onSaveSuccess,
}: PreviewBloodChemistryReportModalProps) {
  const [mode, setMode] = useState<"view" | "edit">("view");

  const {
    editableData,
    reportCallbacks,
    mouseChangeCallbacks,
    reportDateTimeChangeCallbacks,
    resetData,
  } = useBloodChemistryDataEdit({
    initialData: bloodChemistryData,
    experimentId,
  });

  const { saveBloodChemistryReport, isSaving } = useSaveBloodChemistryReport();

  const handleEdit = () => {
    setMode("edit");
  };

  const handleSave = () => {
    saveBloodChemistryReport(
      { payload: editableData },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          onOpenChange(false);
          setMode("view");
          onSaveSuccess?.();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to save blood chemistry data."
          );
        },
      }
    );
  };

  const handleCancel = () => {
    setMode("view");
    resetData();
  };

  const handleClose = () => {
    setMode("view");
    resetData();
    onOpenChange(false);
  };

  // Render dialog content based on data state
  const renderDialogContent = () => {
    // No data state
    if (!bloodChemistryData || !bloodChemistryData.reports_data?.length) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <div>
            <p className="text-lg font-semibold text-foreground mb-2">
              No Blood Chemistry Data Found
            </p>
            <p className="text-sm text-muted-foreground">
              No blood chemistry report data was extracted from the PDF.
            </p>
          </div>
        </div>
      );
    }

    // Main content with data
    return (
      <div
        className="overflow-auto"
        style={{ maxHeight: "calc(90vh - 180px)" }}
      >
        <ViewBloodChemistryData
          experimentId={experimentId}
          data={editableData.reports_data}
          mode={mode}
          reportCallbacks={reportCallbacks}
          mouseChangeCallbacks={mouseChangeCallbacks}
          reportDateTimeChangeCallbacks={reportDateTimeChangeCallbacks}
        />
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
      preventOutsideClose
      title={
        <div className="flex items-center justify-between w-full pr-8">
          <div>
            <h2 className="text-xl font-semibold">
              Preview Blood Chemistry Data
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Review the extracted blood chemistry data before confirming the
              upload.
            </p>
          </div>
          <div className="flex gap-3">
            {mode === "view" ? (
              <Button onClick={handleEdit} variant="default">
                Edit
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  variant="default"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </>
            )}
          </div>
        </div>
      }
      trigger={null}
      className="w-full max-w-[var(--width-xxl)] max-h-[90vh]"
    >
      {renderDialogContent()}
    </Dialog>
  );
}
