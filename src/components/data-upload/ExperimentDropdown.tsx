import { useState } from "react";

import { experimentApi, type ExperimentDropdownItem } from "@/api";
import { Label } from "@/components/atoms/Label/Label";
import { AsyncSelect } from "@/components/molecules/AsyncSelect";

interface ExperimentDropdownProps {
  value: string;
  onValueChange: (value: string, experiment?: ExperimentDropdownItem) => void;
  onCreateNew?: () => void;
  disabled?: boolean;
  showHelperText?: boolean;
  helperText?: string;
  validationError?: string;
  projectId?: number;
  specialization?: string;
  studyTypeId?: number;
}

export function ExperimentDropdown({
  value,
  onValueChange,
  onCreateNew,
  disabled = false,
  showHelperText = false,
  helperText = "Please select study type to continue",
  validationError,
  projectId,
  specialization,
  studyTypeId,
}: Readonly<ExperimentDropdownProps>) {
  const canFetch = !disabled;
  const [experimentsData, setExperimentsData] = useState<
    ExperimentDropdownItem[]
  >([]);

  return (
    <div className="space-y-2">
      <Label
        htmlFor="experiment"
        className={`${disabled ? "text-muted-foreground" : ""}`}
      >
        Experiment
      </Label>
      <AsyncSelect
        value={value}
        onChange={(newValue) => {
          const selectedExperiment = experimentsData.find(
            (exp) => exp.id.toString() === newValue
          );
          onValueChange(newValue as string, selectedExperiment);
        }}
        mapConfig={{
          labelKey: "experiment_name" as const,
          valueKey: "id" as const,
        }}
        query={async () => {
          if (!canFetch) return [];
          const response = await experimentApi.getExperimentsDropdown({
            project_id: projectId || undefined,
            study_type_id: studyTypeId || undefined,
            specialization: specialization?.toUpperCase() || undefined,
          });
          const data = response.data || [];
          setExperimentsData(data);
          return data;
        }}
        queryKey={[
          "experiments-dropdown",
          projectId?.toString() || "",
          specialization?.toString() || "",
          studyTypeId?.toString() || "",
        ]}
        placeholder="Select experiment"
        disabled={disabled}
        searchable={true}
        optionWithAll={false}
        size="lg"
        shouldShowCreateNew
        createNewLabel="Create New Experiment"
        onCreateNew={onCreateNew}
      />
      {showHelperText && (
        <span className="text-xs text-muted-foreground">{helperText}</span>
      )}
      {validationError && (
        <span className="text-sm text-red-500">{validationError}</span>
      )}
    </div>
  );
}
