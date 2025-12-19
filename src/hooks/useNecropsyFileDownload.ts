import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { necropsyApi } from "@/lib/api";
import { downloadBlobFile } from "@/lib/utils";

export interface UseNecropsyFileDownloadProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useNecropsyFileDownload = ({
  onSuccess,
  onError,
}: UseNecropsyFileDownloadProps) => {
  const {
    mutate: handleFileDownload,
    isPending,
    error,
  } = useMutation({
    mutationFn: (params: { experimentId: number; groupIds: number[] }) =>
      necropsyApi.downloadOrganSheet(params),
    onSuccess: (data: Blob) => {
      downloadBlobFile(data, "organ_weight_sheet.xlsx");
      toast.success("Organ weight sheet downloaded successfully.");
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Error downloading organ weight sheet:", error);
      toast.error(error.message);
      onError?.(error);
    },
  });

  return { handleFileDownload, isPending, error };
};
