import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { exportSheetApi } from "@/api";
import { DATA_TYPE, type ExperimentDataType } from "@/lib/constants";
import { downloadBlobFile } from "@/lib/utils";

interface DownloadSheetParams {
  experimentId: number;
  sheetType: ExperimentDataType;
}

interface UseDownloadSheetProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDownloadSheet = (props?: UseDownloadSheetProps) => {
  const downloadMutation = useMutation({
    mutationFn: async ({ experimentId, sheetType }: DownloadSheetParams) => {
      if (sheetType === DATA_TYPE.WEIGHT_SHEET) {
        const data = await exportSheetApi.weightSheet({ experimentId });
        return { data, filename: "weight_sheet.xlsx" };
      } else if (sheetType === DATA_TYPE.CALLIPERING_SHEET) {
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

  const downloadSheet = (
    experimentId: number,
    sheetType: ExperimentDataType
  ) => {
    downloadMutation.mutate({ experimentId, sheetType });
  };

  return {
    downloadSheet,
    isDownloading: downloadMutation.isPending,
  };
};
