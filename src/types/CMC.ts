export interface CMCFileType {
  file_type: string;
  file_url: string;
  filename: string;
  uploaded_at: string;
}

export interface CMCExperimentDataResponse {
  cmc_file: CMCFileType;
  experiment_data_id: number;
}
