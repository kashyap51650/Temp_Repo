import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  hotlabApi,
  importExperimentDataApi,
  type ImportNecropsyDataPayload,
  type ImportNecropsyDataResponse,
} from "@/api";
import {
  DATA_TYPE,
  type ExperimentDataType,
  SPECIALIZATION,
} from "@/lib/constants";
import { formatFieldLabel } from "@/lib/utils";
import type {
  BloodChemistryPDFPayload,
  BloodChemistryPDFUploadResponse,
} from "@/types/bloodChemistry";
import type {
  HematologyPDFPayload,
  HematologyPDFUploadResponse,
} from "@/types/hematology";
import type {
  HotlabPDFUploadPayload,
  HotlabPDFUploadResponse,
} from "@/types/hotlab";

export type PdfImportPayloadType =
  | ImportNecropsyDataPayload
  | HematologyPDFPayload
  | BloodChemistryPDFPayload
  | HotlabPDFUploadPayload;
export type PdfImportResponseType =
  | ImportNecropsyDataResponse
  | HematologyPDFUploadResponse
  | BloodChemistryPDFUploadResponse
  | HotlabPDFUploadResponse;

type UsePdfExperimentDataImportProps = {
  onSuccess?: (data: PdfImportResponseType) => void;
  experimentDataType: ExperimentDataType;
  specialization?: string;
};
export const usePdfExperimentDataImport = ({
  onSuccess,
  experimentDataType,
  specialization,
}: UsePdfExperimentDataImportProps) => {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (
      payload: PdfImportPayloadType
    ): Promise<PdfImportResponseType> => {
      if (specialization?.toLowerCase() === SPECIALIZATION.HOTLAB) {
        return hotlabApi.extractHotlabData({
          file: (payload as HotlabPDFUploadPayload).file,
        });
      }

      if (experimentDataType === DATA_TYPE.NECROPSY_SHEET) {
        return importExperimentDataApi.importNecropsyData({
          experiment_id: (payload as ImportNecropsyDataPayload).experiment_id,
          file: payload.file,
        });
      } else if (experimentDataType === DATA_TYPE.HEMATOLOGY) {
        return importExperimentDataApi.importHematologyData({
          experiment_id: (payload as HematologyPDFPayload).experiment_id,
          file: payload.file,
        });
      } else if (experimentDataType === DATA_TYPE.BLOOD_CHEMISTRY) {
        return importExperimentDataApi.importBloodChemistryData({
          experiment_id: (payload as BloodChemistryPDFPayload).experiment_id,
          file: payload.file,
        });
      }

      throw new Error("Invalid experiment data type");
    },
    onSuccess: (data: PdfImportResponseType) => {
      if (specialization?.toLowerCase() === SPECIALIZATION.HOTLAB) {
        toast.success("Hotlab PDF imported successfully.");
      } else {
        toast.success(
          `${formatFieldLabel(experimentDataType)} Experiment data imported successfully.`
        );
      }
      onSuccess?.(data);
    },
    onError: (error: Error) => {
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
