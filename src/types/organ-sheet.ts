type ID = number;

type DynamicMap<T> = Record<string, T>;
interface CellLine {
  id: ID;
  cell_line_name: string;
  vendor_name: string;
}

interface ExperimentDrug {
  id: ID;
  drug_name: string;
  om_number: string;
}

interface Group {
  id: ID;
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
  id: ID;
  organ_name: string;
  description: string | null;
}

/**
 * Dynamic keys like "Kidneys", "Liver", "Tail", "cell line"
 */
type OrgansMap = DynamicMap<Organ>;

interface Mouse {
  id: ID;
  mouse_delivery_id: string;
  mouse_code: string;
  experiment_id: ID;
}

/**
 * Dynamic keys like "B1", "B2", "B3"
 */
type MiceMap = DynamicMap<Mouse>;

type OrganValueType = "float" | "datetime";

interface OrganMeasurement {
  id: ID;
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

export type ExperimentDataForBioDOrganSheetResponse = {
  id: string;
  uploaded_data: {
    groups: GroupsMap;
    organs: OrgansMap;
    mice: MiceMap;
    organ_weights: OrganWeightsMap;
  };
};

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
