import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { necropsyApi } from "@/lib/api";
import { downloadBlobFile } from "@/lib/utils";

export const useNecropsyFileDownload = () => {
  const {
    mutate: handleFileDownload,
    isPending,
    error,
  } = useMutation({
    mutationFn: (params: { experimentId: number; groupIds: number[] }) =>
      necropsyApi.downloadOrganSheet(params),
    onSuccess: (data: Blob) => {
      downloadBlobFile(data, "organ_weight_sheet.xlsx");
    },
    onError: (error: Error) => {
      console.error("Error downloading organ weight sheet:", error);
      toast.error(error.message);
    },
  });

  return { handleFileDownload, isPending, error };
};
