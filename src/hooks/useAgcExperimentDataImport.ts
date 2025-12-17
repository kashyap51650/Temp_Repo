import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { experimentDataApi, type ImportAgecDataPayload } from "@/lib/api";

export const useAgcExperimentDataImport = () => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: (payload: ImportAgecDataPayload) =>
      experimentDataApi.importAgcExperimentData(payload),
    onSuccess: () => {
      toast.success("AGC Experiment data imported successfully.");
    },
    onError: (error: Error) => {
      console.error("Error importing AGC Experiment data:", error);
      toast.error(error.message);
    },
  });
  return {
    handleUploadAgcSheet: mutate,
    isAgcSheetUploading: isPending,
    error,
  };
};
