import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

import {
  handleApiError,
  sampleFileApi,
  type SampleFileFilters,
} from "@/lib/api";

export interface UseSampleFileDownloadReturn {
  downloadSampleFile: (filters: SampleFileFilters) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useSampleFileDownload = (): UseSampleFileDownloadReturn => {
  const downloadMutation = useMutation({
    mutationFn: async (filters: SampleFileFilters) => {
      const response = await sampleFileApi.getSampleFileDownload(filters);

      if (response.success && response.data?.download_url) {
        return {
          downloadUrl: response.data.download_url,
          fileName: response.data.file_name,
        };
      } else {
        throw new Error(response.message || "Failed to get download URL");
      }
    },
    retry: 1,
    onSuccess: async (data) => {
      await downloadFile(data.downloadUrl, data.fileName);
    },
    onError: (error) => {
      console.error("❌ Sample file download failed:", error);
      const errorMessage = handleApiError(
        error,
        "Failed to download sample file"
      );
      toast.error(errorMessage);
    },
  });

  const downloadFile = useCallback(
    async (downloadUrl: string, fileName: string) => {
      try {
        const response = await fetch(downloadUrl);
        if (!response.ok) {
          throw new Error(`Failed to download: ${response.statusText}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.style.display = "none";
        link.href = objectUrl;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);

        toast.success(`Downloaded: ${fileName}`);
      } catch (err) {
        console.error("❌ Download failed:", err);
        toast.error("Failed to download file");
        throw err;
      }
    },
    []
  );

  const downloadSampleFile = async (
    filters: SampleFileFilters
  ): Promise<void> => {
    await downloadMutation.mutateAsync(filters);
  };

  return {
    downloadSampleFile,
    loading: downloadMutation.isPending,
    error: downloadMutation.error?.message || null,
  };
};
