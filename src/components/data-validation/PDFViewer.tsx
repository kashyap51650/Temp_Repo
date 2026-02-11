import { Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/atoms";
import { useFileViewer } from "@/hooks/useFileViewer";

interface PDFViewerProps {
  fileUrl: string;
  fileName: string;
  title?: string;
}

export function PDFViewer({
  fileUrl,
  fileName,
  title,
}: Readonly<PDFViewerProps>) {
  const {
    blobUrl,
    isLoading,
    error,
    downloadFile,
    openInNewTab,
    isDownloading,
  } = useFileViewer({
    fileUrl,
    enabled: !!fileUrl,
  });

  const handleDownload = async () => {
    try {
      await downloadFile(fileName);
      toast.success("PDF downloaded successfully");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download PDF");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-muted-foreground">Loading PDF...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">Failed to load PDF</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!blobUrl) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">No PDF available</p>
          <p className="text-sm mt-2">The requested PDF could not be found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full overflow-hidden flex flex-col">
      {/* PDF Viewer */}
      <div className="flex-1 w-full overflow-hidden">
        <iframe
          src={`${blobUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          className="w-full h-full border-0"
          title={title ? `PDF viewer: ${title}` : `PDF viewer for ${fileName}`}
          aria-label={
            title
              ? `PDF document viewer showing ${title}`
              : `PDF document viewer for ${fileName}`
          }
        />
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">{fileName}</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={openInNewTab}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            disabled={isDownloading}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
        </div>
      </div>
    </div>
  );
}
