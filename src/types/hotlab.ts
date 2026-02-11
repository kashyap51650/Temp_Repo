import type { ApiResponse } from "@/lib/api";

import type { Experiment } from "./experiment";

export type CreateHotlabExperimentPayload = {
  project_id: number;
  experiment_name: string;
  specialization: string;
};

export type CreateHotlabExperimentResponse = ApiResponse<{
  experiment_id: number;
}>;

export type UpdateHotlabExperimentPayload = {
  experiment_name?: string;
};

export type UpdateHotlabExperimentResponse = ApiResponse<{
  experiment_id: number;
}>;

export type HotlabPDFUploadPayload = {
  file: File;
};
export interface OCRData {
  filename: string;
  report_name: string;
  study_name: string;
}

export interface ExperimentMatch {
  experiment: Pick<
    Experiment,
    | "id"
    | "experiment_name"
    | "protocol_number"
    | "status"
    | "specialization"
    | "project_id"
  >;
  matched_by: string;
}

export type HotlabPDFUploadResponse = ApiResponse<{
  ocr_data: OCRData;
  experiments: ExperimentMatch[];
}>;

export type ImportHotlabPDFPayload = {
  experiment_id: number;
  file: File;
};

export type ImportHotlabPDFResponse = ApiResponse<{
  experiment_data_id: number;
  hotlab_file: {
    id: number;
    file_url: string;
    filename: string;
  };
}>;
