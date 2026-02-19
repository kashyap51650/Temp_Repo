import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import type { FormData } from "@/components/data-upload/UploadPanel";
import {
  API_CONFIG,
  API_CUSTOM_TIMEOUT,
  apiClient,
  type ApiResponse,
  DATA_TYPE,
  queryClient,
  SPECIALIZATION,
  STUDY_TYPE,
} from "@/lib";
import { logError } from "@/lib/sentry-logger";

type Payload = {
  experimentId: number | undefined;
  dataTypeId: number | undefined;
  file: File;
  url: string;
  group_ids?: string[];
  no_of_replica?: number;
};

export const useUploadData = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: unknown) => void;
  onError: (error: Error) => void;
}) => {
  const { mutate: uploadData, isPending: isUploading } = useMutation({
    mutationFn: async (payload: Payload) => {
      const formData = new FormData();

      if (payload.experimentId) {
        formData.append("experiment_id", payload.experimentId.toString());
      }
      if (payload.dataTypeId) {
        formData.append("data_type_id", payload.dataTypeId.toString());
      }
      if (payload.group_ids) {
        formData.append("group_ids", payload.group_ids.join(","));
      }
      if (payload.no_of_replica) {
        formData.append("no_of_replica", payload.no_of_replica.toString());
      }
      formData.append("file", payload.file, payload.file.name);

      return await apiClient.postFormData<ApiResponse<unknown>>(
        payload.url,
        formData,
        {
          timeout: API_CUSTOM_TIMEOUT,
        }
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["experiment-data"] });
      queryClient.invalidateQueries({ queryKey: ["uploaded-experiment-data"] });
      toast.success(data.message || "File uploaded successfully");
      if (onSuccess) {
        onSuccess(data.data);
      }
    },
    onError: (error) => {
      logError(error);
      if (onError) {
        onError(error);
        return;
      }
    },
    retry: false,
  });

  const getConfigurationUrl = (
    formData: FormData,
    option?: {
      isAgcUpload: boolean;
    }
  ) => {
    if (formData.specialisation.toLowerCase() === SPECIALIZATION.PRECLINICAL) {
      const { studyType, dataType } = formData;

      switch (studyType) {
        case STUDY_TYPE.BIO_DISTRIBUTION: {
          const biod = API_CONFIG.ENDPOINTS.DATA_UPLOAD.PRECLINICAL.BIOD;

          switch (dataType) {
            case DATA_TYPE.WEIGHT_SHEET:
              return biod.WEIGHT_SHEET;
            case DATA_TYPE.CALLIPERING_SHEET:
              return biod.CALLIPERING_SHEET;
            case DATA_TYPE.ORGAN_WEIGHT_SHEET:
              if (option?.isAgcUpload) {
                return biod.AGC_SHEET;
              }
              return biod.ORGAN_WEIGHT_SHEET;
            case DATA_TYPE.AGC_SHEET:
              return biod.AGC_SHEET;
            case DATA_TYPE.HOTLAB:
              return biod.HOTLAB;
            default:
              return null;
          }
        }

        case STUDY_TYPE.DOSE_RANGE_FINDING: {
          const drf = API_CONFIG.ENDPOINTS.DATA_UPLOAD.PRECLINICAL.DRF;

          switch (dataType) {
            case DATA_TYPE.WEIGHT_SHEET:
              return drf.WEIGHT_SHEET;
            case DATA_TYPE.NECROPSY_SHEET:
              return drf.NECROPSY;
            case DATA_TYPE.HEMATOLOGY:
              return drf.EXTRACT_HEMATOLOGY_REPORT;
            case DATA_TYPE.BLOOD_CHEMISTRY:
              return drf.EXTRACT_BLOOD_CHEMISTRY_REPORT;
            case DATA_TYPE.HOTLAB:
              return drf.HOTLAB;
            default:
              return null;
          }
        }

        case STUDY_TYPE.EFFICACY: {
          const efficacy =
            API_CONFIG.ENDPOINTS.DATA_UPLOAD.PRECLINICAL.EFFICACY;

          switch (dataType) {
            case DATA_TYPE.WEIGHT_SHEET:
              return efficacy.WEIGHT_SHEET;
            case DATA_TYPE.CALLIPERING_SHEET:
              return efficacy.CALLIPERING_SHEET;
            case DATA_TYPE.HOTLAB:
              return efficacy.HOTLAB;
            default:
              return null;
          }
        }

        case STUDY_TYPE.MODEL_STUDY: {
          const modelStudy =
            API_CONFIG.ENDPOINTS.DATA_UPLOAD.PRECLINICAL.MODEL_STUDY;

          switch (dataType) {
            case DATA_TYPE.WEIGHT_SHEET:
              return modelStudy.WEIGHT_SHEET;
            case DATA_TYPE.CALLIPERING_SHEET:
              return modelStudy.CALLIPERING_SHEET;
            case DATA_TYPE.HOTLAB:
              return modelStudy.HOTLAB;
            default:
              return null;
          }
        }

        case STUDY_TYPE.TOXICITY: {
          const toxicity =
            API_CONFIG.ENDPOINTS.DATA_UPLOAD.PRECLINICAL.TOXICITY;

          switch (dataType) {
            case DATA_TYPE.WEIGHT_SHEET:
              return toxicity.WEIGHT_SHEET;
            case DATA_TYPE.NECROPSY_SHEET:
              return toxicity.NECROPSY;
            case DATA_TYPE.HEMATOLOGY:
              return toxicity.EXTRACT_HEMATOLOGY_REPORT;
            case DATA_TYPE.BLOOD_CHEMISTRY:
              return toxicity.EXTRACT_BLOOD_CHEMISTRY_REPORT;
            case DATA_TYPE.HOTLAB:
              return toxicity.HOTLAB;
            default:
              return null;
          }
        }

        default:
          return null;
      }
    }
    if (formData.specialisation.toLowerCase() === SPECIALIZATION.CMC) {
      const { studyType, dataType } = formData;

      switch (studyType) {
        case STUDY_TYPE.CLRF: {
          const clrf = API_CONFIG.ENDPOINTS.DATA_UPLOAD.CMC.CLRF;

          switch (dataType) {
            case DATA_TYPE.CLRF:
              return clrf.CLRF_DATA;
            case DATA_TYPE.HOTLAB:
              return clrf.HOTLAB;
            default:
              return null;
          }
        }

        case STUDY_TYPE.CONJUGATION: {
          const conjugation = API_CONFIG.ENDPOINTS.DATA_UPLOAD.CMC.CONJUGATION;

          switch (dataType) {
            case DATA_TYPE.CONJUGATION:
              return conjugation.CONJUGATION_DATA;
            case DATA_TYPE.GEL_IMAGE:
              return conjugation.GEL_IMAGE;
            case DATA_TYPE.HOTLAB:
              return conjugation.HOTLAB;
            default:
              return null;
          }
        }

        case STUDY_TYPE.DIRECT_BINDING_ASSAY: {
          const directBindingAssay =
            API_CONFIG.ENDPOINTS.DATA_UPLOAD.CMC.DIRECT_BINDING_ASSAY;

          switch (dataType) {
            case DATA_TYPE.DIRECT_BINDING_ASSAY:
              return directBindingAssay.DIRECT_BINDING_ASSAY_DATA;
            case DATA_TYPE.HOTLAB:
              return directBindingAssay.HOTLAB;
            default:
              return null;
          }
        }

        case STUDY_TYPE.IRF: {
          const irf = API_CONFIG.ENDPOINTS.DATA_UPLOAD.CMC.IRF;

          switch (dataType) {
            case DATA_TYPE.IRF:
              return irf.IRF_DATA;
            case DATA_TYPE.HOTLAB:
              return irf.HOTLAB;
            default:
              return null;
          }
        }

        case STUDY_TYPE.RECEPTOR_QUANTIFICATION: {
          const receptorQuantification =
            API_CONFIG.ENDPOINTS.DATA_UPLOAD.CMC.RECEPTOR_QUANTIFICATION;

          switch (dataType) {
            case DATA_TYPE.RECEPTOR_QUANTIFICATION:
              return receptorQuantification.RECEPTOR_QUANTIFICATION_DATA;
            case DATA_TYPE.HOTLAB:
              return receptorQuantification.HOTLAB;
            default:
              return null;
          }
        }

        case STUDY_TYPE.SATURATION_BINDING_ASSAY: {
          const saturationBindingAssay =
            API_CONFIG.ENDPOINTS.DATA_UPLOAD.CMC.SATURATION_BINDING_ASSAY;

          switch (dataType) {
            case DATA_TYPE.SATURATION_BINDING_ASSAY:
              return saturationBindingAssay.SATURATION_BINDING_ASSAY_DATA;
            case DATA_TYPE.HOTLAB:
              return saturationBindingAssay.HOTLAB;
            default:
              return null;
          }
        }

        default:
          return null;
      }
    }
    if (formData.specialisation.toLowerCase() === SPECIALIZATION.HOTLAB) {
      return API_CONFIG.ENDPOINTS.DATA_UPLOAD.HOTLAB.EXTRACT_HOTLAB_REPORT;
    }
    return null;
  };

  const handleUpload = async ({
    formData,
    isPdfUpload,
    no_of_replica,
  }: {
    formData: FormData;
    isPdfUpload?: boolean;
    no_of_replica?: number;
  }) => {
    const url = getConfigurationUrl(formData);

    if (url === null) {
      logError("No valid URL found for the given form data");
      return;
    }

    if (!formData.uploadedFile) {
      logError("No file selected for upload");
      return;
    }

    if (formData.specialisation.toLowerCase() === SPECIALIZATION.HOTLAB) {
      uploadData({
        file: formData.uploadedFile,
        url: url,
        experimentId: undefined,
        dataTypeId: undefined,
      });
      return;
    }

    if (!formData.experiment?.id) {
      logError("No experiment selected");
      return;
    }

    if (!formData.dataTypeId) {
      logError("No data type selected");
      return;
    }

    const experimentId = Number.parseInt(formData.experiment.id.toString());

    uploadData({
      experimentId,
      dataTypeId:
        !isPdfUpload &&
        !(formData.specialisation.toLowerCase() === SPECIALIZATION.CMC)
          ? formData.dataTypeId
          : undefined,
      file: formData.uploadedFile,
      url,
      no_of_replica:
        formData.dataType === DATA_TYPE.SATURATION_BINDING_ASSAY &&
        no_of_replica
          ? no_of_replica
          : undefined,
    });
  };

  const handleAgcUpload = async (
    formData: FormData,
    selectedGroupCodes: string[]
  ) => {
    const url = getConfigurationUrl(formData, { isAgcUpload: true });

    if (url === null) {
      logError("No valid URL found for the given form data");
      return;
    }

    if (!formData.experiment?.id) {
      logError("No experiment selected for AGC upload");
      return;
    }

    if (!formData.uploadAGCFile) {
      logError("No AGC file selected for upload");
      return;
    }

    uploadData({
      experimentId: Number.parseInt(formData.experiment.id.toString()),
      file: formData.uploadAGCFile!,
      url: url,
      group_ids: selectedGroupCodes,
      dataTypeId: undefined,
    });
  };

  return {
    handleAgcUpload,
    handleUpload,
    isUploading,
  };
};
