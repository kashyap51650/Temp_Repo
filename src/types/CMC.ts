import type { ApiResponse } from "@/lib";

export interface CMCFileType {
  file_type: string;
  file_url: string;
  filename: string;
  uploaded_at: string;
}

export type CMCExperimentDataResponse = ApiResponse<{
  cmc_file: CMCFileType;
  experiment_data_id: number;
}>;
