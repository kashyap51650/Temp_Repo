import type { ApiResponse, ImportPDFDataPayload } from "@/lib/api";

export type ReportParameter = {
  id?: number;
  parameter_name: string;
  parameter_value: string;
  reference_range: string;
};

export type HematologyReportData = {
  patient_name: string;
  report_datetime: string;
  mouse_id: number | null;
  mouse: {
    id: number;
    mouse_delivery_id: string;
    mouse_code: string;
  } | null;
  parameters: ReportParameter[];
};

export type HematologyReport = {
  filename: string;
  reports_data: HematologyReportData[];
};
export type HematologyPDFPayload = ImportPDFDataPayload;
export type HematologyPDFUploadResponse = ApiResponse<HematologyReport>;
