import { useState } from "react";
import { toast } from "sonner";

import {
  experimentDataApi,
  type ImportExperimentDataPayload,
} from "../lib/api";
import { handleApiError } from "../lib/api";

export interface UseExperimentDataImportProps {
  onSuccess?: () => void;
}

export interface UseExperimentDataImportReturn {
  uploadFile: (payload: ImportExperimentDataPayload) => Promise<void>;
  isUploading: boolean;
  validateXlsxFile: (file: File) => boolean;
}

export const useExperimentDataImport = (
  props?: UseExperimentDataImportProps
): UseExperimentDataImportReturn => {
  const [isUploading, setIsUploading] = useState(false);

  const validateXlsxFile = (file: File): boolean => {
    // const allowedExtensions = [".xlsx"];
    // const allowedMimeTypes = [
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //   "application/vnd.ms-excel"
    // ];

    const hasValidExtension = file.name.toLowerCase().endsWith(".xlsx");
    // const hasValidMimeType = allowedMimeTypes.includes(file.type) || file.type === "";

    if (!hasValidExtension) {
      toast.error("Invalid file type. Please upload an Excel file (.xlsx).");
      return false;
    }

    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeInBytes) {
      toast.error(
        "File size too large. Please upload a file smaller than 10MB."
      );
      return false;
    }

    if (file.size === 0) {
      toast.error("File is empty. Please upload a valid Excel file.");
      return false;
    }

    return true;
  };

  const uploadFile = async (
    payload: ImportExperimentDataPayload
  ): Promise<void> => {
    if (!validateXlsxFile(payload.file)) {
      return;
    }

    if (payload.experiment_id === null || payload.experiment_id === undefined) {
      toast.error("Please select an experiment.");
      return;
    }

    if (payload.data_type_id === null || payload.data_type_id === undefined) {
      toast.error("Please select a data type.");
      return;
    }

    setIsUploading(true);

    try {
      const response = await experimentDataApi.importExperimentData(payload);

      if (response.success) {
        toast.success(response.message || "Data uploaded successfully!");
        props?.onSuccess?.();
      } else {
        toast.error(response.message || "Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = handleApiError(
        error,
        "Failed to upload data. Please try again."
      );
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    isUploading,
    validateXlsxFile,
  };
};
