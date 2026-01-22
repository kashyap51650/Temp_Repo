import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { experimentDataApi, type ImportNecropsyDataPayload } from "@/lib/api";

type UseNecropsyExperimentDataImportProps = {
  onSuccess?: () => void;
};
export const useNecropsyExperimentDataImport = ({
  onSuccess,
}: UseNecropsyExperimentDataImportProps = {}) => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: (payload: ImportNecropsyDataPayload) =>
      experimentDataApi.importNecropsyData(payload),
    onSuccess: () => {
      toast.success("Necropsy Experiment data imported successfully.");
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Error importing Necropsy Experiment data:", error);
      toast.error(error.message);
    },
    retry: false,
  });
  return {
    handleUploadNecropsyPdf: mutate,
    isNecropsyPdfUploading: isPending,
    error,
  };
};
