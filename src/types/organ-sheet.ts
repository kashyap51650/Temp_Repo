import type { ApiResponse } from "@/lib/api";

type DynamicMap<T> = Record<string, T>;
interface CellLine {
  id: number;
  cell_line_name: string;
  vendor_name: string;
}

interface ExperimentDrug {
  id: number;
  drug_name: string;
  om_number: string;
}

interface Group {
  id: number;
  group_code: string;
  group_name: string;
  short_group_name: string;
  group_type: "TREATMENT" | "CONTROL";
  cell_line: CellLine;
  experiment_drug: ExperimentDrug;
  mouse_count: number;
}

/**
 * Dynamic keys like "B", "A", "C"
 */
type GroupsMap = DynamicMap<Group>;

interface Organ {
  id: number;
  organ_name: string;
  description: string | null;
}

/**
 * Dynamic keys like "Kidneys", "Liver", "Tail", "cell line"
 */
type OrgansMap = DynamicMap<Organ>;

interface Mouse {
  id: number;
  mouse_delivery_id: string;
  mouse_code: string;
  experiment_id: number;
}

/**
 * Dynamic keys like "B1", "B2", "B3"
 */
type MiceMap = DynamicMap<Mouse>;

type OrganValueType = "float" | "datetime";

interface OrganMeasurement {
  id: number;
  value: number | string;
  type: OrganValueType;
  key: string;
}

/**
 * Inner level → mice keys (B1, B2, ...)
 */
type MouseMeasurementMap = DynamicMap<OrganMeasurement>;

/**
 * Outer level → dynamic organ / time names
 * e.g. "Kidneys", "Pb-212 Injection time"
 */
type OrganWeightsMap = DynamicMap<MouseMeasurementMap>;

export type ExperimentDataForBioDOrganSheetUploadData = {
  groups: GroupsMap;
  organs: OrgansMap;
  mice: MiceMap;
  organ_weights: OrganWeightsMap;
};

export type ExperimentDataForBioDOrganSheetResponse = ApiResponse<{
  id: string;
  uploaded_data: ExperimentDataForBioDOrganSheetUploadData;
}>;

export interface BioDOrganRow {
  id: string;
  label: string;
  isRequired?: boolean;
  data: Record<string, string | number>;
  groupedData?: Record<
    string,
    {
      value: string;
      colspan: number;
      startColumn: string;
      endColumn: string;
    }
  >;
}

export interface BioDOrganData {
  mouse: string[];
  rows: BioDOrganRow[];
}

// ------------ Bulk Update Types ------------

export type BulkUpdatePayload = {
  groups: (Pick<
    Group,
    "id" | "group_name" | "group_code" | "short_group_name"
  > & {
    experiment_drug_id: number;
    cell_line_id: number;
  })[];
  organ_weights: (Pick<OrganMeasurement, "id" | "key" | "value"> & {
    mouse_id: number;
  })[];
};

type UpdateResultItem = {
  id: number;
  success: boolean;
  message: string;
};

type OrganWeightResultItem = UpdateResultItem & { key: string };

type UpdateSummary<T> = {
  total: number;
  successful: number;
  failed: number;
  results: T[];
};

export type UpdateExperimentData = {
  experiment_data_id: number;
  experiment_id: number;
  groups: UpdateSummary<UpdateResultItem>;
  organ_weights: UpdateSummary<OrganWeightResultItem>;
};
export type BulkUpdateResponse = ApiResponse<UpdateExperimentData>;
