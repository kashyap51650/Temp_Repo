import { toast } from "sonner";

import { Button } from "@/components/atoms";
import {
  type ExperimentDataForNecropsyResponse,
  useExperimentDataByIdForHotlab,
  useExperimentDataByIdForNecropsy,
  usePdfViewer,
} from "@/hooks";
import { DATA_TYPE } from "@/lib/constants";
import type { ImportHotlabPDFResponse } from "@/types/hotlab";

interface PDFViewProps {
  experimentDataId?: string;
  experimentName: string;
  dataType: "necropsy" | "hotlab";
}

export function PDFView({
  experimentDataId,
  experimentName,
  dataType,
}: Readonly<PDFViewProps>) {
  // Use the appropriate hook based on data type
  const necropsyQuery = useExperimentDataByIdForNecropsy(
    dataType === DATA_TYPE.NECROPSY_SHEET.toLowerCase()
      ? experimentDataId || ""
      : ""
  );
  const hotlabQuery = useExperimentDataByIdForHotlab(
    dataType === DATA_TYPE.HOTLAB.toLowerCase() ? experimentDataId || "" : ""
  );

  // Select the appropriate query result
  const { data, isLoading, error } =
    dataType === DATA_TYPE.NECROPSY_SHEET.toLowerCase()
      ? necropsyQuery
      : hotlabQuery;

  const pdfUrl =
    dataType === DATA_TYPE.NECROPSY_SHEET.toLowerCase()
      ? (data as ExperimentDataForNecropsyResponse)?.file_url
      : (data as ImportHotlabPDFResponse)?.data?.hotlab_file.file_url;

  const {
    blobUrl,
    isLoading: pdfLoading,
    error: pdfError,
    downloadPdf,
    openInNewTab,
    isDownloading,
  } = usePdfViewer({
    pdfUrl: pdfUrl,
    enabled: !!pdfUrl,
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
      const fileName = `${dataType}-${experimentName}.pdf`;
      await downloadPdf(fileName);
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
              title={`${dataType} PDF - ${experimentName}`}
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20">
            <p className="text-sm text-muted-foreground">
              {dataType === DATA_TYPE.NECROPSY_SHEET.toLowerCase()
                ? "Necropsy PDF"
                : "Hotlab Data PDF"}
            </p>
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
