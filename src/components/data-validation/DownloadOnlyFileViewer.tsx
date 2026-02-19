import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/atoms";
import { useFileViewer } from "@/hooks/useFileViewer";

interface DownloadOnlyFileViewerProps {
  fileUrl: string;
  filename: string;
  fileType: string;
}

export function DownloadOnlyFileViewer({
  fileUrl,
  filename,
  fileType,
}: Readonly<DownloadOnlyFileViewerProps>) {
  const { downloadFile, isDownloading, error } = useFileViewer({
    fileUrl,
    enabled: !!fileUrl,
  });

  const handleDownload = async () => {
    try {
      await downloadFile(filename);
      toast.success("File downloaded successfully");
    } catch {
      toast.error("Failed to download file");
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">Failed to load file</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-muted/10 rounded-lg">
      <div className="text-center space-y-6 max-w-md">
        {/* File Info */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">{filename}</h3>
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            {fileType} File
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <FileText className="w-4 h-4" />
            <p className="text-sm">This file type cannot be previewed</p>
          </div>
          <p className="text-xs text-muted-foreground">
            Click the button below to download and open in your default
            application
          </p>
        </div>

        {/* Download Button */}
        <div className="pt-4">
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            size="lg"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Downloading..." : "Download File"}
          </Button>
        </div>
      </div>
    </div>
  );
}
