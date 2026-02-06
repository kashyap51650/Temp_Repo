import type { ImportPDFDataPayload } from "@/api";
import type { ApiResponse } from "@/lib/api";

export interface BloodChemistryReportParameters {
  id?: number;
  parameter_name: string;
  parameter_value: string;
  reference_range: string;
}

export type BloodChemistryReportData = {
  blood_chemistry_report_id?: number;
  patient_name: string;
  report_datetime: string;
  mouse_id: number | null;
  mouse: {
    id: number;
    mouse_delivery_id: string;
    mouse_code: string;
  } | null;
  parameters: BloodChemistryReportParameters[];
};

export type BloodChemistryReport = {
  filename: string;
  reports_data: BloodChemistryReportData[];
};

export type BloodChemistryPDFPayload = ImportPDFDataPayload;

export type BloodChemistryPDFUploadResponse = ApiResponse<BloodChemistryReport>;

export type SaveBloodChemistryPDFPayload = {
  experiment_id: number;
  reports_data: BloodChemistryReportData[];
};

export type SaveBloodChemistryDataResponse = ApiResponse<{
  message: string;
  experiment_id: number;
  experiment_data_id: number;
  total_reports_created: number;
  total_parameters_created: number;
  reports: Array<
    Omit<BloodChemistryReportData, "parameters"> & {
      id: number;
      exp_id: number;
      exp_data_id: number;
      parameters_count: number;
      created_at: string;
    }
  >;
}>;

export type GetBloodChemistryReportResponse = ApiResponse<{
  experiment_data_id: number;
  experiment: {
    id: number;
    experiment_name: string;
    study_type: string;
  };
  total_reports: number;
  blood_chemistry_reports: BloodChemistryReportData[];
}>;
