import { Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/atoms";
import { useFileViewer } from "@/hooks/useFileViewer";

interface ImageViewerProps {
  fileUrl: string;
  fileName: string;
  experimentName: string;
}

export function ImageViewer({
  fileUrl,
  fileName,
  experimentName,
}: Readonly<ImageViewerProps>) {
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
      toast.success("Image downloaded successfully");
    } catch {
      toast.error("Failed to download image");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-muted-foreground">Loading image...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive">
            Error loading image
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  if (!blobUrl) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">
            No image available
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            The image could not be loaded
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full overflow-hidden flex flex-col">
      {/* Image Container */}
      <div className="flex-1 w-full overflow-auto bg-muted/10">
        <div className="flex items-center justify-center min-h-full p-4">
          <img
            src={blobUrl}
            alt={`Experiment ${experimentName} - ${fileName}`}
            className="max-w-full h-auto"
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-background">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground truncate max-w-xs">
            {fileName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Action Buttons */}
          <Button
            onClick={openInNewTab}
            variant="outline"
            size="sm"
            title="Open in New Tab"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            size="sm"
            disabled={isDownloading}
            title="Download Image"
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "Downloading..." : "Download"}
          </Button>
        </div>
      </div>
    </div>
  );
}
