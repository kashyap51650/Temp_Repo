import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { type ImportAGCDataPayload, importExperimentDataApi } from "@/api";

type UseAgcExperimentDataImportProps = {
  onSuccess?: () => void;
};
export const useAGCExperimentDataImport = ({
  onSuccess,
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
      toast.error(error.message);
    },
    retry: false,
  });
  return {
    handleUploadAGCSheet: mutate,
    isAGCSheetUploading: isPending,
    error,
  };
};
