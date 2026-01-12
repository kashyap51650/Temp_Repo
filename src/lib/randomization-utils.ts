import type {
  RandomizationGroup,
  RandomizationGroupUI,
  ViewRandomizationGroup,
} from "@/types/randomization";

export const transformApiGroupsForUI = (
  apiGroups: (ViewRandomizationGroup | RandomizationGroup)[]
): RandomizationGroupUI[] =>
  apiGroups.map((g) => ({
    key: g.group_code,
    label: g.group_name,
    average_measurement: g.average_measurement,
    std_deviation: g.std_deviation,
    data: g.mice.map((m) => ({
      mouse: m.mouse_delivery_id,
      tumorVol: m.measurement_value,
    })),
    experiment_drug_id:
      "experiment_drug_id" in g ? g.experiment_drug_id : g.experiment_drug?.id,
  }));
