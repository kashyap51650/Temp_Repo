import { toast } from "sonner";

import type { BioDWeightData } from "@/components/organisms/DataTable/tableData";
import { MAX_BODY_WEIGHT_GRAMS } from "@/lib/constants";

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
  currentData: BioDWeightData | null;
  originalData: BioDWeightData | null;
  experimentDataId?: string;
  onSuccess: () => void;
  onClose: () => void;
}

const FIELD_MAPPINGS: Array<{
  current: keyof BioDWeightData;
  api: string;
  transform?: (value: string) => string | number | null;
}> = [
  { current: "sex", api: "sex" },
  {
    current: "strain",
    api: "mouse_strain_id",
    transform: (v) => (v === "" ? null : Number(v)),
  },
  { current: "dob", api: "date_of_birth" },
  { current: "cellInjectionDate", api: "cell_injection_date" },
  {
    current: "cellLine",
    api: "cell_line_id",
    transform: (v) => (v === "" ? null : Number(v)),
  },
  { current: "treatmentDate", api: "treatment_date" },
  { current: "measurementDate", api: "measurement_date" },
];

export function useBioDWeightSheetSave() {
  const bulkUpdateMutation = useBulkUpdateBodyWeights();

  const validateInputs = (
    currentData: BioDWeightData | null,
    originalData: BioDWeightData | null,
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
    currentData: BioDWeightData,
    originalData: BioDWeightData
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
    currentData: BioDWeightData,
    originalData: BioDWeightData
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
    if (!validateInputs(currentData, originalData, experimentDataId)) {
      return;
    }

    // Collect metadata changes
    const { changes: metadataChanges, hasMetadataChanges } =
      collectMetadataChanges(currentData!, originalData!);

    // Collect measurement changes
    const { measurements, hasMeasurementChanges, isValid } =
      collectMeasurementChanges(currentData!, originalData!);

    if (!isValid) return;

    // Check if any changes exist
    if (!hasMetadataChanges && !hasMeasurementChanges) {
      toast.info("No changes detected", {
        description: "No modifications were made to the data",
      });
      onClose();
      return;
    }

    // Prepare final payload
    const payload: BulkUpdateBodyWeightsRequest = {
      ...metadataChanges,
      experiment_data_id: experimentDataId!,
    };

    if (hasMeasurementChanges) {
      payload.measurements = measurements;
    }

    // Send to API
    bulkUpdateMutation.mutate(payload, {
      onSuccess,
    });
  };

  return {
    saveChanges,
    isPending: bulkUpdateMutation.isPending,
  };
}
