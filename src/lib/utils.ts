import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ExperimentDataItem } from "@/api";
import { specialisationOptions } from "@/data/experiments";
import type { SelectOption } from "@/types/utils";

import type { ValidationRow } from "../components/organisms/DataTable/tableData";
import { FILE_SIZE_LIMITS, FILE_TYPES, type StudyType } from "./constants";

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
      specialization: item.experiment.specialization,
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

export const specializationLookup = new Map<string, string>(
  specialisationOptions.map((option) => [
    option.value.toLowerCase(),
    option.label,
  ])
);

export type FileTypeKey = keyof typeof FILE_TYPES;

export function validateFile(
  file: File,
  allowedTypes: FileTypeKey | FileTypeKey[],
  maxFileSize: number = FILE_SIZE_LIMITS.LARGE_FILE
): void {
  if (!file) {
    throw new Error("File is required");
  }

  const fileName = file.name.toLowerCase();

  const typeKeys = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes];

  const normalizedExtensions = typeKeys.flatMap(
    (key) => FILE_TYPES[key].EXTENSIONS
  );
  const displayNames = typeKeys.map((key) => FILE_TYPES[key].DISPLAY_NAME);

  const isValidExtension = normalizedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!isValidExtension) {
    const typeList =
      displayNames.length > 0
        ? displayNames.join(", ")
        : normalizedExtensions.join(", ");
    throw new Error(`Invalid file type. Allowed types: ${typeList}`);
  }

  if (file.size > maxFileSize) {
    const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
    throw new Error(`File size must be less than ${maxSizeMB}MB`);
  }
}

export function flattenObject<T = unknown>(
  obj: Record<string, T>,
  prefix: string = ""
): Record<string, T> {
  const result: Record<string, T> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, T>, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

export function objectToFlattenArray<T>(obj: Record<string, unknown>): T[] {
  const flattenedObj = flattenObject(obj);
  return Object.values(flattenedObj) as T[];
}

export function generateQueryKey<T extends string | number | boolean>(
  ...keys: (T | null | undefined)[]
): T[] {
  return keys.filter((key): key is T => key !== undefined && key !== null);
}
