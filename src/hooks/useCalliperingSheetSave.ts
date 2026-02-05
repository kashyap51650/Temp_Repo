import { toast } from "sonner";

import type { CalliperingWorksheetEditData } from "@/types/callipering-sheet";

import useBulkUpdateCalliperMeasurements, {
  type CalliperingWorksheetUpdate,
} from "./useBulkUpdateCalliperMeasurements";

interface SaveOptions {
  currentData: CalliperingWorksheetEditData[] | null;
  originalData: CalliperingWorksheetEditData[] | null;
  experimentDataId?: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function useCalliperingSheetSave() {
  const bulkUpdateMutation = useBulkUpdateCalliperMeasurements();

  const validateInputs = (
    currentData: CalliperingWorksheetEditData[] | null,
    originalData: CalliperingWorksheetEditData[] | null,
    experimentDataId?: string
  ): boolean => {
    if (!currentData || !originalData) {
      toast.error("Invalid data", {
        description: "Unable to save changes due to missing data",
      });
      return false;
    }

    if (!experimentDataId) {
      toast.error("Missing experiment data ID", {
        description: "Unable to save changes without experiment data ID",
      });
      return false;
    }

    return true;
  };

  const validateMeasurement = (
    length: number,
    width: number,
    mouseId: string
  ): boolean => {
    if (length <= 0 || width <= 0) {
      toast.error("Invalid measurement value", {
        description: `Measurements for mouse ${mouseId} must be greater than 0`,
      });
      return false;
    }
    return true;
  };

  const saveChanges = ({
    currentData,
    originalData,
    experimentDataId,
    onSuccess,
    onClose,
  }: SaveOptions) => {
    // Validate inputs
    if (!validateInputs(currentData, originalData, experimentDataId)) {
      return;
    }

    const worksheetUpdates: CalliperingWorksheetUpdate[] = [];
    let hasAnyChanges = false;
    let isValid = true;

    // Process each worksheet
    for (const [worksheetIndex, currentWorksheet] of currentData!.entries()) {
      const originalWorksheet = originalData![worksheetIndex];
      if (!originalWorksheet || !currentWorksheet.worksheetId) continue;

      const worksheetUpdate: CalliperingWorksheetUpdate = {
        worksheet: {
          id: currentWorksheet.worksheetId,
        },
        measurements: [],
      };

      let hasMeasurementChanges = false;

      // Check measurement changes
      for (const [index, currentMouse] of currentWorksheet.mice.entries()) {
        const originalMouse = originalWorksheet.mice[index];

        if (!originalMouse || !currentMouse.measurement_id) continue;

        const lengthChanged =
          currentMouse.length_mm !== originalMouse.length_mm;
        const widthChanged = currentMouse.width_mm !== originalMouse.width_mm;

        if (lengthChanged || widthChanged) {
          if (
            !validateMeasurement(
              currentMouse.length_mm,
              currentMouse.width_mm,
              currentMouse.id
            )
          ) {
            isValid = false;
            continue;
          }

          worksheetUpdate.measurements.push({
            id: currentMouse.measurement_id,
            length_mm: currentMouse.length_mm,
            width_mm: currentMouse.width_mm,
          });
          hasMeasurementChanges = true;
        }
      }

      // Add worksheet to updates if it has measurement changes
      if (hasMeasurementChanges) {
        worksheetUpdates.push(worksheetUpdate);
        hasAnyChanges = true;
      }
    }

    if (!isValid) return;

    // Check if any changes exist
    if (!hasAnyChanges) {
      toast.info("No changes detected", {
        description: "No modifications were made to the data",
      });
      onClose();
      return;
    }

    // Build final payload with worksheets array
    const payload = {
      worksheets: worksheetUpdates,
    };

    // Send to API
    bulkUpdateMutation.mutate(
      {
        request: payload,
        experimentDataId: experimentDataId!,
      },
      {
        onSuccess,
      }
    );
  };

  return {
    saveChanges,
    isPending: bulkUpdateMutation.isPending,
  };
}
