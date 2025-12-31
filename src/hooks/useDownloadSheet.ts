import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { exportSheetApi } from "@/lib/api";
import { downloadBlobFile } from "@/lib/utils";

type SheetType = "Weight Sheet" | "Callipering Sheet";

interface DownloadSheetParams {
  experimentId: number;
  sheetType: SheetType;
}

interface UseDownloadSheetProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDownloadSheet = (props?: UseDownloadSheetProps) => {
  const downloadMutation = useMutation({
    mutationFn: async ({ experimentId, sheetType }: DownloadSheetParams) => {
      if (sheetType === "Weight Sheet") {
        const data = await exportSheetApi.weightSheet({ experimentId });
        return { data, filename: "weight_sheet.xlsx" };
      } else if (sheetType === "Callipering Sheet") {
        const data = await exportSheetApi.caliperSheet({ experimentId });
        return { data, filename: "callipering_sheet.xlsx" };
      }
      throw new Error("Invalid sheet type");
    },
    retry: 1,
    onSuccess: (response) => {
      if (response) {
        downloadBlobFile(response.data, response.filename);
        toast.success("Sheet downloaded successfully");
        props?.onSuccess?.();
      }
    },
    onError: (error: Error) => {
      console.error("Error downloading sheet:", error);
      toast.error("Failed to download sheet");
      props?.onError?.(error);
    },
  });

  const downloadSheet = (experimentId: number, sheetType: SheetType) => {
    downloadMutation.mutate({ experimentId, sheetType });
  };

  return {
    downloadSheet,
    isDownloading: downloadMutation.isPending,
  };
};
