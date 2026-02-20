import {
  type ExperimentDataForNecropsyResponse,
  useExperimentDataByIdForHotlab,
  useExperimentDataByIdForNecropsy,
} from "@/hooks";
import { DATA_TYPE } from "@/lib/constants";
import type { ImportHotlabPDFResponse } from "@/types/hotlab";

import { PDFViewer } from "./PDFViewer";

interface NecropsyAndHotlabPDFViewProps {
  experimentDataId?: string;
  experimentName: string;
  dataType: "necropsy" | "hotlab";
}

export function NecropsyAndHotlabPDFView({
  experimentDataId,
  experimentName,
  dataType,
}: Readonly<NecropsyAndHotlabPDFViewProps>) {
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
      ? (data?.data as ExperimentDataForNecropsyResponse["data"])?.file_url
      : (data?.data as ImportHotlabPDFResponse["data"])?.hotlab_file.file_url;

  if (isLoading && experimentDataId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading experiment data...</div>
      </div>
    );
  }

  if (error && experimentDataId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          Error loading experiment data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <PDFViewer
      fileUrl={pdfUrl ?? ""}
      fileName={
        dataType === DATA_TYPE.NECROPSY_SHEET.toLowerCase()
          ? "Necropsy PDF"
          : "Hotlab Data PDF"
      }
      title={`${dataType} PDF - ${experimentName}`}
    />
  );
}
