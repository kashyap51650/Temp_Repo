import { toast } from "sonner";

import { MAX_BODY_WEIGHT_GRAMS } from "@/lib/constants";
import type { WorksheetEditData } from "@/types/weight-sheet";

import useBulkUpdateBodyWeights, {
  type BulkUpdateBodyWeightsRequest,
} from "./useBulkUpdateBodyWeights";

interface MetadataChanges {
  sex?: string;
  mouse_strain_id?: number;
  date_of_birth?: string;
  cell_injection_date?: string;
  cell_line_id?: number;
  treatment_date?: string;
  measurement_date?: string;
}

interface MeasurementChange {
  id: number;
  body_weight_grams: number;
}

interface SaveOptions {
  currentData: WorksheetEditData[] | null;
  originalData: WorksheetEditData[] | null;
  experimentDataId?: string;
  onSuccess: () => void;
  onClose: () => void;
}

const FIELD_MAPPINGS: Array<{
  current: keyof WorksheetEditData;
  api: string;
  transform?: (value: string) => string | number | null;
}> = [
  { current: "sex", api: "sex" },
  {
    current: "strainId",
    api: "mouse_strain_id",
  },
  { current: "dob", api: "date_of_birth" },
  { current: "cellInjectionDate", api: "cell_injection_date" },
  {
    current: "cellLineId",
    api: "cell_line_id",
  },
  { current: "treatmentDate", api: "treatment_date" },
  { current: "measurementDate", api: "measurement_date" },
];

export function useBioDWeightSheetSave() {
  const bulkUpdateMutation = useBulkUpdateBodyWeights();

  const validateInputs = (
    currentData: WorksheetEditData | null,
    originalData: WorksheetEditData | null,
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

  const validateBodyWeight = (weight: number, mouseId: string): boolean => {
    if (weight <= 0 || weight > MAX_BODY_WEIGHT_GRAMS) {
      toast.error("Invalid weight value", {
        description: `Weight for mouse ${mouseId} must be between 0 and 1000 grams`,
      });
      return false;
    }
    return true;
  };

  const collectMetadataChanges = (
    currentData: WorksheetEditData,
    originalData: WorksheetEditData
  ) => {
    const changes: MetadataChanges = {};
    let hasMetadataChanges = false;

    const normalizeValue = (
      value: unknown,
      transform?: (value: string) => string | number | null
    ): string | number | null => {
      // Handle null/undefined
      if (value === null || value === undefined) {
        return null;
      }

      // Handle strings
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed === "") {
          return null;
        }
        // Apply transformation if provided
        if (transform) {
          return transform(trimmed);
        }
        return trimmed;
      }

      // Handle numbers (0 could be valid or "not selected" depending on context)
      if (typeof value === "number") {
        // NaN should be treated as no value
        if (Number.isNaN(value)) {
          return null;
        }
        return value;
      }

      return value as string | number | null;
    };

    FIELD_MAPPINGS.forEach(({ current, api, transform }) => {
      const currentValue = currentData[current];
      const originalValue = originalData[current];

      const normalizedCurrentValue = normalizeValue(currentValue, transform);
      const normalizedOriginalValue = normalizeValue(originalValue, transform);

      // Compare normalized values
      if (normalizedCurrentValue !== normalizedOriginalValue) {
        // Only add to changes if the new value is not null
        if (normalizedCurrentValue !== null) {
          (changes as Record<string, string | number>)[api] =
            normalizedCurrentValue as string | number;
        } else {
          // If changing to "no value", include it in changes
          (changes as Record<string, string | number | null>)[api] =
            normalizedCurrentValue;
        }
        hasMetadataChanges = true;
      }
    });
    return { changes, hasMetadataChanges };
  };

  const collectMeasurementChanges = (
    currentData: WorksheetEditData,
    originalData: WorksheetEditData
  ) => {
    const measurements: MeasurementChange[] = [];
    let hasMeasurementChanges = false;
    let isValid = true;

    currentData.mice.forEach((currentMouse, index) => {
      const originalMouse = originalData.mice[index];

      if (!originalMouse || !currentMouse.measurementId) return;

      const weightChanged =
        currentMouse.bodyWeight !== originalMouse.bodyWeight;

      if (weightChanged) {
        if (!validateBodyWeight(currentMouse.bodyWeight, currentMouse.id)) {
          isValid = false;
          return;
        }

        measurements.push({
          id: currentMouse.measurementId,
          body_weight_grams: currentMouse.bodyWeight,
        });
        hasMeasurementChanges = true;
      }
    });
    return { measurements, hasMeasurementChanges, isValid };
  };

  const saveChanges = ({
    currentData,
    originalData,
    experimentDataId,
    onSuccess,
    onClose,
  }: SaveOptions) => {
    // Validate inputs

    const payload: BulkUpdateBodyWeightsRequest = {
      worksheets: [],
    };

    currentData?.forEach((worksheet, index) => {
      if (!validateInputs(worksheet, originalData![index], experimentDataId)) {
        return;
      }
      // Collect metadata changes
      const { changes: metadataChanges, hasMetadataChanges } =
        collectMetadataChanges(worksheet, originalData![index]);

      // Collect measurement changes
      const { measurements, hasMeasurementChanges, isValid } =
        collectMeasurementChanges(worksheet, originalData![index]);

      if (!isValid) return;

      if (!hasMetadataChanges && !hasMeasurementChanges) return;

      payload.worksheets.push({
        worksheet: {
          id: worksheet.worksheetId!,
          ...(hasMetadataChanges && { ...metadataChanges }),
        },
        measurements,
      });
    });

    // Check if any changes exist
    if (payload.worksheets.length === 0) {
      toast.info("No changes detected", {
        description: "No modifications were made to the data",
      });
      onClose();
      return;
    }

    // Send to API
    bulkUpdateMutation.mutate(
      {
        request: payload,
        experimentDataId: experimentDataId!,
      },
      {
        onSuccess: onSuccess,
      }
    );
  };

  return {
    saveChanges,
    isPending: bulkUpdateMutation.isPending,
  };
}
