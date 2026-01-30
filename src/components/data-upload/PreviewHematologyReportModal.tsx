import { useState } from "react";
import { toast } from "sonner";

import { useHematologyDataEdit } from "@/hooks/useHematologyDataEdit";
import { useSaveHematologyReport } from "@/hooks/useSaveHematologyReport";
import type { HematologyReport } from "@/types/hematology";

import { Button, Dialog } from "../atoms";
import { ViewHematologyData } from "../molecules/ViewHematologyData";

interface PreviewHematologyReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hematologyData: HematologyReport;
  experimentId: number;
}

/**
 * PreviewHematologyReportModal Component
 *
 * Handles previewing and editing hematology data passed via props.
 * Used after PDF upload to preview extracted data before saving.
 */
export const PreviewHematologyReportModal: React.FC<
  PreviewHematologyReportModalProps
> = ({ open, onOpenChange, experimentId, hematologyData }) => {
  const [mode, setMode] = useState<"view" | "edit">("view");

  // Use the custom hook for data management with props data
  const {
    editableData,
    reportCallbacks,
    mouseChangeCallbacks,
    reportDateTimeChangeCallbacks,
    resetData,
  } = useHematologyDataEdit({
    initialData: hematologyData,
    experimentId,
  });

  const { saveHematologyReport, isSaving } = useSaveHematologyReport();

  const handleEdit = () => {
    setMode("edit");
  };

  const handleSave = () => {
    saveHematologyReport(
      { payload: editableData },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          onOpenChange(false);
          setMode("view");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to save hematology data."
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
    if (!hematologyData || !hematologyData.reports_data?.length) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <div>
            <p className="text-lg font-semibold text-foreground mb-2">
              No Hematology Data Found
            </p>
            <p className="text-sm text-muted-foreground">
              No hematology report data was extracted from the PDF.
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
        <ViewHematologyData
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
      preventOutsideClose={isSaving}
      title={
        <div className="flex items-center justify-between w-full pr-8">
          <div>
            <h2 className="text-xl font-semibold">Preview Hematology Data</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Review the extracted hematology data before confirming the upload.
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
};
