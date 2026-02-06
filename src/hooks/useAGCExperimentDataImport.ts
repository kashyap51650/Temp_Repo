import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { type ImportAGCDataPayload, importExperimentDataApi } from "@/api";

type UseAgcExperimentDataImportProps = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};
export const useAGCExperimentDataImport = ({
  onSuccess,
  onError,
}: UseAgcExperimentDataImportProps = {}) => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: (payload: ImportAGCDataPayload) =>
      importExperimentDataApi.importAGCExperimentData(payload),
    onSuccess: () => {
      toast.success("AGC Experiment data imported successfully.");
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Error importing AGC Experiment data:", error);
      onError?.(error);
    },
    retry: false,
  });
  return {
    handleUploadAGCSheet: mutate,
    isAGCSheetUploading: isPending,
    error,
  };
};
