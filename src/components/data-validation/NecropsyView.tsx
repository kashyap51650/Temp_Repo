import { toast } from "sonner";

import { useExperimentDataByIdForNecropsy, usePdfViewer } from "@/hooks";

import { Button } from "../atoms";

interface NecropsyViewProps {
  experimentDataId?: string;
  experimentName: string;
}

export default function NecropsyView({
  experimentDataId,
  experimentName,
}: NecropsyViewProps) {
  const { data, isLoading, error } = useExperimentDataByIdForNecropsy(
    experimentDataId || ""
  );

  const {
    blobUrl,
    isLoading: pdfLoading,
    error: pdfError,
    downloadPdf,
    openInNewTab,
    isDownloading,
  } = usePdfViewer({
    pdfUrl: data?.file_url,
    enabled: !!data?.file_url,
  });

  if ((isLoading || pdfLoading) && experimentDataId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading experiment data...</div>
      </div>
    );
  }

  if ((error || pdfError) && experimentDataId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          Error loading experiment data. Please try again.
        </div>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      await downloadPdf(`necropsy-${experimentName}.pdf`);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download pdf");
    }
  };

  return (
    <div className="flex-1 w-full h-full overflow-hidden flex flex-col">
      {blobUrl ? (
        <>
          <div className="flex-1 w-full overflow-hidden">
            <iframe
              src={`${blobUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full border-0"
              title={`Necropsy PDF - ${experimentName}`}
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
            <p className="text-sm text-muted-foreground">{data?.filename}</p>
            <div className="flex gap-2">
              <Button onClick={openInNewTab} variant="outline" size="sm">
                Open in New Tab
              </Button>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                disabled={isDownloading}
              >
                {isDownloading ? "Downloading..." : "Download PDF"}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <p className="text-lg font-medium">No PDF available</p>
          </div>
        </div>
      )}
    </div>
  );
}
