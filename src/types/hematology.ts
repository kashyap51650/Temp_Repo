import type { ImportPDFDataPayload } from "@/api";
import type { ApiResponse } from "@/lib/api";

export type ReportParameters = {
  id?: number;
  parameter_name: string;
  parameter_value: string;
  reference_range: string;
};

export type HematologyReportData = {
  hematology_report_id?: number;
  patient_name: string;
  report_datetime: string;
  mouse_id: number | null;
  mouse: {
    id: number;
    mouse_delivery_id: string;
    mouse_code: string;
  } | null;
  parameters: ReportParameters[];
};

export type HematologyReport = {
  filename: string;
  reports_data: HematologyReportData[];
};

// -------- Payloads and Responses

// Uploading Hematology PDF
export type HematologyPDFPayload = ImportPDFDataPayload;

export type HematologyPDFUploadResponse = ApiResponse<HematologyReport>;

// Saving Hematology Data
export type SaveHematologyPDFPayload = {
  experiment_id: number;
  reports_data: HematologyReportData[];
};

export type SaveHematologyDataResponse = ApiResponse<{
  message: string;
  experiment_id: number;
  experiment_data_id: number;
  total_reports_created: number;
  total_parameters_created: number;
  reports: Array<
    Omit<HematologyReportData, "parameters"> & {
      id: number;
      exp_id: number;
      exp_data_id: number;
      parameters_count: number;
      created_at: string;
    }
  >;
}>;

// Fetching Hematology Report
export type GetHematologyReportResponse = ApiResponse<{
  experiment_data_id: number;
  experiment: {
    id: number;
    experiment_name: string;
    study_type: string;
  };
  total_reports: number;
  hematology_reports: HematologyReportData[];
}>;
