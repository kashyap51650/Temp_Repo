import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  experimentDataApi,
  handleApiError,
  type ImportExperimentDataPayload,
} from "../lib/api";
import { FILE_SIZE_LIMITS } from "../lib/constants";

export interface UseExperimentDataImportProps {
  onSuccess?: () => void;
}

export interface UseExperimentDataImportReturn {
  uploadFile: (payload: ImportExperimentDataPayload) => Promise<void>;
  isUploading: boolean;
  validateXlsxFile: (file: File) => boolean;
  error: string | null;
}

export const useExperimentDataImport = (
  props?: UseExperimentDataImportProps
): UseExperimentDataImportReturn => {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (payload: ImportExperimentDataPayload) =>
      experimentDataApi.importExperimentData(payload),
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiment-data"] });
      queryClient.invalidateQueries({ queryKey: ["uploaded-experiment-data"] });
    },
  });

  const validateXlsxFile = (file: File): boolean => {
    const hasValidExtension = file.name.toLowerCase().endsWith(".xlsx");

    if (!hasValidExtension) {
      toast.error("Invalid file type. Please upload an Excel file (.xlsx).");
      return false;
    }

    if (file.size > FILE_SIZE_LIMITS.EXCEL_FILE) {
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

    try {
      const response = await uploadMutation.mutateAsync(payload);

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
    }
  };

  return {
    uploadFile,
    isUploading: uploadMutation.isPending,
    validateXlsxFile,
    error: uploadMutation.error?.message || null,
  };
};
