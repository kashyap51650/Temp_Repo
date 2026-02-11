import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { importExperimentDataApi } from "@/api";
import {
  DATA_TYPE,
  type ExperimentDataType,
  type StudyType,
} from "@/lib/constants";
import { formatFieldLabel } from "@/lib/utils";
import type {
  ClrfExperimentDataUploadPayload,
  ClrfExperimentDataUploadResponse,
} from "@/types/clrfExperiment";
import type {
  ConjugationExperimentDataUploadPayload,
  ConjugationExperimentDataUploadResponse,
  ConjugationGelImageDataUploadPayload,
  ConjugationGelImageDataUploadResponse,
} from "@/types/conjugationExperiment";
import type {
  DirectBindingAssayExperimentDataUploadPayload,
  DirectBindingAssayExperimentDataUploadResponse,
} from "@/types/directBindingAssay";
import type {
  IrfExperimentDataUploadPayload,
  IrfExperimentDataUploadResponse,
} from "@/types/irfExperiment";
import type {
  ReceptorQuantificationExperimentDataUploadPayload,
  ReceptorQuantificationExperimentDataUploadResponse,
} from "@/types/receptorQuantification";

type CMCImportPayloadType =
  | ClrfExperimentDataUploadPayload
  | ConjugationExperimentDataUploadPayload
  | ConjugationGelImageDataUploadPayload
  | IrfExperimentDataUploadPayload
  | ReceptorQuantificationExperimentDataUploadPayload
  | DirectBindingAssayExperimentDataUploadPayload;
type CMCImportResponseType =
  | ClrfExperimentDataUploadResponse
  | ConjugationExperimentDataUploadResponse
  | ConjugationGelImageDataUploadResponse
  | IrfExperimentDataUploadResponse
  | ReceptorQuantificationExperimentDataUploadResponse
  | DirectBindingAssayExperimentDataUploadResponse;

interface UseCmcExperimentDataImportProps {
  onSuccess?: (data: CMCImportResponseType) => void;
  experimentDataType?: ExperimentDataType;
  experimentStudyType: StudyType;
}

export function useCMCExperimentDataImport({
  onSuccess,
  experimentDataType,
  experimentStudyType,
}: UseCmcExperimentDataImportProps) {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (
      payload: CMCImportPayloadType
    ): Promise<CMCImportResponseType> => {
      const experimentDataImportMap: Partial<
        Record<
          ExperimentDataType,
          (payload: CMCImportPayloadType) => Promise<CMCImportResponseType>
        >
      > = {
        [DATA_TYPE.CLRF]: (payload) =>
          importExperimentDataApi.importClrfExperimentDataApi({
            experiment_id: payload.experiment_id,
            file: payload.file,
          }),
        [DATA_TYPE.DIRECT_BINDING_ASSAY]: (payload) =>
          importExperimentDataApi.importDirectBindingAssayExperimentDataApi({
            experiment_id: payload.experiment_id,
            file: payload.file,
          }),
        [DATA_TYPE.IRF]: (payload) =>
          importExperimentDataApi.importIrfExperimentDataApi({
            experiment_id: payload.experiment_id,
            file: payload.file,
          }),
        [DATA_TYPE.RECEPTOR_QUANTIFICATION]: (payload) =>
          importExperimentDataApi.importReceptorQuantificationExperimentDataApi(
            {
              experiment_id: payload.experiment_id,
              file: payload.file,
            }
          ),
        [DATA_TYPE.CONJUGATION]: (payload) =>
          importExperimentDataApi.importConjugationExperimentDataApi({
            experiment_id: payload.experiment_id,
            file: payload.file,
          }),
        [DATA_TYPE.GEL_IMAGE]: (payload) =>
          importExperimentDataApi.importConjugationGelImageDataApi({
            experiment_id: payload.experiment_id,
            file: payload.file,
          }),
      };

      const importFn = experimentDataType
        ? experimentDataImportMap[experimentDataType]
        : undefined;

      if (!importFn) {
        throw new Error("Invalid or unsupported experiment data type");
      }

      return importFn(payload);
    },
    onSuccess: (data: CMCImportResponseType) => {
      toast.success(
        `${experimentDataType ? formatFieldLabel(experimentDataType) : formatFieldLabel(experimentStudyType)} Experiment data imported successfully.`
      );
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error(
        `Error importing ${experimentDataType ? formatFieldLabel(experimentDataType) : formatFieldLabel(experimentStudyType)} Experiment data:`,
        error
      );
      toast.error(error.message);
    },
    retry: false,
  });

  return {
    handleUploadCMCData: mutate,
    isCMCDataUploading: isPending,
    error,
  };
}
