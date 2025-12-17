import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ValidationRow } from "../components/organisms/DataTable/tableData";
import { type ExperimentDataItem } from "../lib/api";

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
    randomisationDate:
      item.treatment_date && isValidDate(item.treatment_date)
        ? new Date(item.treatment_date).toISOString()
        : undefined,
    projectName: item.project.project_name,
    measurementDate: item.measurement_date,
    treatmentDate: item.treatment_date,
    randomizationStatus: item.randomization_status,
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
  return !isNaN(date.getTime());
}

export const downloadBlobFile = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};
