import { Label } from "@/components/atoms/Label/Label";
import { ExperimentSelect } from "@/components/atoms/Selects";

import { CustomSelect } from "./CustomSelect";

interface ExperimentSectionProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  errors: any;
  existingExperiments: any[];
  getDataTypeOptions: () => any[];
  onShowCreateExperimentModal?: () => void;
  isPreclinicSelected: boolean;
  isStudyTypeSelected: boolean;
  isExperimentSelected: boolean;
}

export function ExperimentSection({
  formData,
  setFormData,
  errors,
  existingExperiments,
  getDataTypeOptions,
  onShowCreateExperimentModal,
  isPreclinicSelected,
  isStudyTypeSelected,
  isExperimentSelected,
}: ExperimentSectionProps) {
  if (!isPreclinicSelected) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Experiment */}
      <div className="space-y-2">
        <Label
          htmlFor="experiment"
          className={`${!isStudyTypeSelected ? "text-muted-foreground" : ""}`}
        >
          Experiment
        </Label>

        <ExperimentSelect
          experiments={existingExperiments.filter(
            (e: any) =>
              e.projectId === formData.project?.id &&
              e.studyType === formData.studyType
          )}
          value={formData.experiment?.id || ""}
          onValueChange={(val: string) => {
            const experiment = existingExperiments.find(
              (e: any) => e.id === val
            );
            setFormData((prev: any) => ({
              ...prev,
              experiment: experiment || null,
            }));
          }}
          onCreateNew={() => onShowCreateExperimentModal?.()}
          className={
            !isStudyTypeSelected
              ? "opacity-50 cursor-not-allowed w-full"
              : "w-full"
          }
        />

        {!isStudyTypeSelected && (
          <span className="text-xs text-muted-foreground">
            Please select study type to continue
          </span>
        )}
        {errors.experiment && (
          <span className="text-sm text-red-500">{errors.experiment}</span>
        )}
      </div>

      {/* Data Type */}
      <div className="space-y-2">
        <Label
          htmlFor="dataType"
          className={`${!isExperimentSelected ? "text-muted-foreground" : ""}`}
        >
          Data Type
        </Label>
        <CustomSelect
          options={getDataTypeOptions()}
          placeholder="Select data type"
          value={formData.dataType}
          onValueChange={(value: string | string[]) => {
            const selectedValue = typeof value === "string" ? value : value[0];
            setFormData((prev: any) => ({
              ...prev,
              dataType: selectedValue,
            }));
          }}
          disabled={!isExperimentSelected}
          className={
            !isExperimentSelected
              ? "opacity-50 cursor-not-allowed w-full"
              : "w-full"
          }
        />
        {!isExperimentSelected && (
          <span className="text-xs text-muted-foreground">
            Please select experiment to continue
          </span>
        )}
        {errors.dataType && (
          <span className="text-sm text-red-500">{errors.dataType}</span>
        )}
      </div>
    </div>
  );
}
