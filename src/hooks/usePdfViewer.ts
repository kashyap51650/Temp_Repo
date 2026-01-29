import { useEffect, useState } from "react";

import { apiClient } from "@/lib/api";
import { downloadBlobFile } from "@/lib/utils";

interface UsePdfViewerOptions {
  pdfUrl?: string | null;
  enabled?: boolean;
}

interface UsePdfViewerReturn {
  blobUrl: string | null;
  isLoading: boolean;
  error: string | null;
  downloadPdf: (fileName?: string) => Promise<void>;
  openInNewTab: () => void;
  isDownloading: boolean;
}

export function usePdfViewer(options: UsePdfViewerOptions): UsePdfViewerReturn {
  const { pdfUrl, enabled = true } = options;
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      if (!pdfUrl || !enabled) {
        setBlobUrl(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        new URL(pdfUrl);
        const blob = await apiClient.get<Blob>(pdfUrl, {
          responseType: "blob",
          skipAuthToken: true,
        });
        const newBlobUrl = URL.createObjectURL(blob);
        setBlobUrl(newBlobUrl);
      } catch (err) {
        console.error("Invalid PDF URL:", err);
        setError("Invalid PDF URL format");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdf();
  }, [pdfUrl, enabled]);

  const downloadPdf = async (fileName = "document.pdf"): Promise<void> => {
    if (!pdfUrl) {
      console.error("No PDF URL available for download");
      return;
    }

    setIsDownloading(true);

    try {
      const blob = await apiClient.get<Blob>(pdfUrl, {
        responseType: "blob",
        skipAuthToken: true,
      });

      downloadBlobFile(blob, fileName);
    } catch (err) {
      console.error("Failed to download PDF:", err);
      throw err;
    } finally {
      setIsDownloading(false);
    }
  };

  const openInNewTab = (): void => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    } else {
      console.warn("No blob URL available to open in new tab");
    }
  };

  return {
    blobUrl,
    isLoading,
    error,
    downloadPdf,
    openInNewTab,
    isDownloading,
  };
}
