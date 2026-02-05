import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { SelectOption } from "@/types/utils";

import type { ValidationRow } from "../components/organisms/DataTable/tableData";
import { type ExperimentDataItem } from "../lib/api";
import { FILE_SIZE_LIMITS, type StudyType } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFieldLabel(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function transformExperimentDataToValidationRows(
  items: ExperimentDataItem[]
): ValidationRow[] {
  return items.map((item) => ({
    id: item.id.toString(),
    experimentName: item.experiment.experiment_name,
    dataType: item.data_type.data_type_name,
    studyType: item.study_type.study_type_name,
    uploadedDate: new Date(item.created_at).toLocaleDateString(),
    status: item.status as "pending" | "approved" | "rejected",
    projectName: item.project.project_name,
    measurementDate: item.measurement_date,
    treatmentDate:
      item.treatment_date && isValidDate(item.treatment_date)
        ? new Date(item.treatment_date).toISOString()
        : undefined,
    randomizationStatus: item.randomization_status,
    experiment: {
      id: item.experiment.id,
      experiment_name: item.experiment.experiment_name,
      randomization_status: item.experiment.randomization_status || "",
    },
    reviewer: item.reviewer
      ? {
          id: item.reviewer.id,
          email: item.reviewer.email,
          firstName: item.reviewer.first_name,
          lastName: item.reviewer.last_name,
          fullName: item.reviewer.full_name,
        }
      : undefined,
  }));
}

function isValidDate(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !Number.isNaN(date.getTime());
}

export const downloadBlobFile = (blob: Blob, fileName: string) => {
  const url = globalThis.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  link.remove();
  globalThis.URL.revokeObjectURL(url);
};

export const mapToOptions = <T>(
  data: T[],
  config: {
    labelKey: keyof T;
    valueKey: keyof T;
    disabledKey?: keyof T;
  }
): SelectOption[] =>
  data.map((item) => ({
    label: String(item[config.labelKey]),
    value: String(item[config.valueKey]),
    disabled: config.disabledKey ? Boolean(item[config.disabledKey]) : false,
    meta: item,
  }));
export const calculateTumorVolume = (
  length_mm: number,
  width_mm: number
): number => {
  return 0.5 * length_mm * width_mm * width_mm;
};

export const parseSearchParams = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
};

export const getSheetDataTypePrefix = (studyType: StudyType) => {
  switch (studyType) {
    case "Bio Distribution":
    case "Biodistribution": {
      return "BioD";
    }
    case "Model Study": {
      return "Model Study";
    }
    case "Dose Range Finding": {
      return "DRF";
    }
    case "Efficacy": {
      return "Efficacy";
    }
    default: {
      return "";
    }
  }
};

export function validatePDFFile(file: File): void {
  if (!file) {
    throw new Error("File is required");
  }
  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith(".pdf")) {
    throw new Error("Only .pdf files are allowed");
  }
  if (file.size > FILE_SIZE_LIMITS.LARGE_FILE) {
    throw new Error("File size must be less than 10MB");
  }
}
