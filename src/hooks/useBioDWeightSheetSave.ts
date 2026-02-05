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

type StringNumberOrNull = string | number | null;

const FIELD_MAPPINGS: Array<{
  current: keyof WorksheetEditData;
  api: string;
  transform?: (value: string) => StringNumberOrNull;
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
      transform?: (value: string) => StringNumberOrNull
    ): StringNumberOrNull => {
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

    for (const { current, api, transform } of FIELD_MAPPINGS) {
      const currentValue = currentData[current];
      const originalValue = originalData[current];

      const normalizedCurrentValue = normalizeValue(currentValue, transform);
      const normalizedOriginalValue = normalizeValue(originalValue, transform);

      // Compare normalized values
      if (normalizedCurrentValue !== normalizedOriginalValue) {
        if (normalizedCurrentValue === null) {
          // If changing to "no value", include it in changes
          (changes as Record<string, string | number | null>)[api] =
            normalizedCurrentValue;
        } else {
          // Only add to changes if the new value is not null
          (changes as Record<string, string | number>)[api] =
            normalizedCurrentValue;
        }
        hasMetadataChanges = true;
      }
    }
    return { changes, hasMetadataChanges };
  };

  const collectMeasurementChanges = (
    currentData: WorksheetEditData,
    originalData: WorksheetEditData
  ) => {
    const measurements: MeasurementChange[] = [];
    let hasMeasurementChanges = false;
    let isValid = true;

    for (const [index, currentMouse] of currentData.mice.entries()) {
      const originalMouse = originalData.mice[index];

      if (!originalMouse || !currentMouse.measurementId) continue;

      const weightChanged =
        currentMouse.bodyWeight !== originalMouse.bodyWeight;

      if (weightChanged) {
        if (!validateBodyWeight(currentMouse.bodyWeight, currentMouse.id)) {
          isValid = false;
          continue;
        }

        measurements.push({
          id: currentMouse.measurementId,
          body_weight_grams: currentMouse.bodyWeight,
        });
        hasMeasurementChanges = true;
      }
    }
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

    if (currentData) {
      for (const [index, worksheet] of currentData.entries()) {
        if (
          !validateInputs(worksheet, originalData![index], experimentDataId)
        ) {
          continue;
        }
        // Collect metadata changes
        const { changes: metadataChanges, hasMetadataChanges } =
          collectMetadataChanges(worksheet, originalData![index]);

        // Collect measurement changes
        const { measurements, hasMeasurementChanges, isValid } =
          collectMeasurementChanges(worksheet, originalData![index]);

        if (!isValid) continue;

        if (!hasMetadataChanges && !hasMeasurementChanges) continue;

        payload.worksheets.push({
          worksheet: {
            id: worksheet.worksheetId!,
            ...(hasMetadataChanges && { ...metadataChanges }),
          },
          measurements,
        });
      }
    }

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
