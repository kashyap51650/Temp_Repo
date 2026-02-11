import { useEffect, useState } from "react";

import { apiClient } from "@/lib/api";
import { downloadBlobFile } from "@/lib/utils";

interface UseFileViewerOptions {
  fileUrl?: string | null;
  enabled?: boolean;
}

interface UseFileViewerReturn {
  blobUrl: string | null;
  isLoading: boolean;
  error: string | null;
  downloadFile: (fileName?: string) => Promise<void>;
  openInNewTab: () => void;
  isDownloading: boolean;
}

export function useFileViewer(
  options: UseFileViewerOptions
): UseFileViewerReturn {
  const { fileUrl, enabled = true } = options;
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      if (!fileUrl || !enabled) {
        setBlobUrl(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Validate URL format
        new URL(fileUrl);

        const blob = await apiClient.get<Blob>(fileUrl, {
          responseType: "blob",
          skipAuthToken: true,
        });

        const newBlobUrl = URL.createObjectURL(blob);
        setBlobUrl(newBlobUrl);
      } catch (err) {
        console.error("Failed to fetch file:", err);
        setError("Failed to load file");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();

    // Cleanup: revoke blob URL when component unmounts or fileUrl changes
    return () => {
      setBlobUrl((prevBlobUrl) => {
        if (prevBlobUrl) {
          URL.revokeObjectURL(prevBlobUrl);
        }
        return null;
      });
    };
  }, [fileUrl, enabled]);

  const downloadFile = async (fileName = "document"): Promise<void> => {
    if (!fileUrl) {
      console.error("No file URL available for download");
      return;
    }

    setIsDownloading(true);

    try {
      const blob = await apiClient.get<Blob>(fileUrl, {
        responseType: "blob",
        skipAuthToken: true,
      });

      downloadBlobFile(blob, fileName);
    } catch (err) {
      console.error("Failed to download file:", err);
      throw err;
    } finally {
      setIsDownloading(false);
    }
  };

  const openInNewTab = (): void => {
    if (fileUrl) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      console.warn("No file URL available to open in new tab");
    }
  };

  return {
    blobUrl,
    isLoading,
    error,
    downloadFile,
    openInNewTab,
    isDownloading,
  };
}
