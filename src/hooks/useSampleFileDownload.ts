import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  handleApiError,
  sampleFileApi,
  type SampleFileFilters,
} from "@/lib/api";

export const useSampleFileDownload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const downloadSampleFile = useCallback(
    async (filters: SampleFileFilters) => {
      setLoading(true);
      setError(null);

      try {
        const response = await sampleFileApi.getSampleFileDownload(filters);

        if (response.success && response.data?.download_url) {
          await downloadFile(
            response.data.download_url,
            response.data.file_name
          );
        } else {
          console.error("❌ Invalid response:", {
            success: response.success,
            data: response.data,
          });
          throw new Error(response.message || "Failed to get download URL");
        }
      } catch (err) {
        console.error("❌ Sample file download failed:", err);
        const errorMessage = handleApiError(
          err,
          "Failed to download sample file"
        );
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [downloadFile]
  );

  return {
    downloadSampleFile,
    loading,
    error,
  };
};
