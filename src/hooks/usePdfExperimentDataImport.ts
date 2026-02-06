import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  importExperimentDataApi,
  type ImportNecropsyDataPayload,
  type ImportNecropsyDataResponse,
} from "@/api";
import { DATA_TYPE, type ExperimentDataType } from "@/lib/constants";
import { formatFieldLabel } from "@/lib/utils";
import type {
  BloodChemistryPDFPayload,
  BloodChemistryPDFUploadResponse,
} from "@/types/bloodChemistry";
import type {
  HematologyPDFPayload,
  HematologyPDFUploadResponse,
} from "@/types/hematology";

type PdfImportPayloadType =
  | ImportNecropsyDataPayload
  | HematologyPDFPayload
  | BloodChemistryPDFPayload;
type PdfImportResponseType =
  | ImportNecropsyDataResponse
  | HematologyPDFUploadResponse
  | BloodChemistryPDFUploadResponse;

type UsePdfExperimentDataImportProps = {
  onSuccess?: (data: PdfImportResponseType) => void;
  experimentDataType: ExperimentDataType;
};
export const usePdfExperimentDataImport = ({
  onSuccess,
  experimentDataType,
}: UsePdfExperimentDataImportProps) => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (
      payload: PdfImportPayloadType
    ): Promise<PdfImportResponseType> => {
      if (experimentDataType === DATA_TYPE.NECROPSY_SHEET) {
        return importExperimentDataApi.importNecropsyData({
          experiment_id: payload.experiment_id,
          file: payload.file,
        });
      } else if (experimentDataType === DATA_TYPE.HEMATOLOGY) {
        return importExperimentDataApi.importHematologyData({
          experiment_id: payload.experiment_id,
          file: payload.file,
        });
      } else if (experimentDataType === DATA_TYPE.BLOOD_CHEMISTRY) {
        return importExperimentDataApi.importBloodChemistryData({
          experiment_id: payload.experiment_id,
          file: payload.file,
        });
      }

      throw new Error("Invalid experiment data type");
    },
    onSuccess: (data: PdfImportResponseType) => {
      toast.success(
        `${formatFieldLabel(experimentDataType)} Experiment data imported successfully.`
      );
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error(
        `Error importing ${formatFieldLabel(experimentDataType)} Experiment data:`,
        error
      );
      toast.error(error.message);
    },
    retry: false,
  });
  return {
    handleUploadPdf: mutate,
    isPdfUploading: isPending,
    error,
  };
};
