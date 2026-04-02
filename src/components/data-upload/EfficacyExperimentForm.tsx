import {
  type CellLine,
  cellLineApi,
  type ExperimentDropdownItem,
  type MouseStrain,
  mouseStrainApi,
} from "@/api";
import { Button, Checkbox, Input, Label } from "@/components/atoms";
import { useModal } from "@/hooks";
import { useEfficacyFormState } from "@/hooks/useEfficacyFormState";
import { queryClient } from "@/lib";

import { AsyncSelect } from "../molecules";
import { CreateFrequencyModal } from "./CreateFrequencyModal";
import { EfficacyGroupFields } from "./EfficacyGroupFields";

interface EfficacyExperimentFormProps {
  projectId?: number;
  studyTypeId?: number;
  specialization?: string;
  onSuccess?: (data: ExperimentDropdownItem) => void;
  onCancel?: () => void;
}

const EfficacyExperimentForm = ({
  projectId,
  studyTypeId,
  specialization,
  onSuccess,
  onCancel,
}: EfficacyExperimentFormProps) => {
  const {
    formData,
    errors,
    isCreating,
    handleSubmit,
    handleCancel,
    updateGroup,
    addDoseInput,
    removeDoseInput,
    updateDoseValue,
    updateFormField,
    handleStrainChange,
    handleCellLineChange,
  } = useEfficacyFormState({
    projectId,
    studyTypeId,
    specialization,
    onSuccess,
    onCancel,
  });

  const {
    isOpen: isFrequencyModalOpen,
    openModal: openFrequencyModal,
    closeModal: closeFrequencyModal,
  } = useModal();

  const allStrains =
    (queryClient.getQueryData(["strains-dropdown"]) as MouseStrain[]) || [];

  const allCellLines =
    (queryClient.getQueryData(["cell-lines-dropdown"]) as CellLine[]) || [];

  // Filter to only show selected strains and cell lines
  const selectedStrainsData = allStrains.filter((strain) =>
    formData.selectedStrains.includes(strain.id)
  );

  const selectedCellLinesData = allCellLines.filter((cellLine) =>
    formData.selectedCellLines.includes(cellLine.id)
  );

  const isGroupsShow =
    formData.numberOfGroups > 0 &&
    formData.groups.length > 0 &&
    selectedStrainsData.length > 0 &&
    selectedCellLinesData.length > 0;

  return (
    <>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="experimentName">Experiment Name</Label>
          <Input
            id="experimentName"
            placeholder="Enter experiment name"
            value={formData.experimentName}
            onChange={(e) => updateFormField("experimentName", e.target.value)}
          />
          {errors.experimentName && (
            <p className="text-sm text-red-500">{errors.experimentName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfGroups">
            Number of Groups (Excluding Market Dose)
          </Label>
          <Input
            id="numberOfGroups"
            type="number"
            placeholder="Enter number of groups"
            min={1}
            max={20}
            value={formData.numberOfGroups}
            onChange={(e) =>
              updateFormField(
                "numberOfGroups",
                e.target.value ? Number.parseInt(e.target.value, 10) : 1
              )
            }
          />
          {errors.numberOfGroups && (
            <p className="text-sm text-red-500">{errors.numberOfGroups}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>
            Select Mouse Strains{" "}
            {formData.numberOfGroups === 1 ? "(Maximum 1)" : "(Maximum 2)"}
          </Label>
          <AsyncSelect
            query={async () => {
              const response = await mouseStrainApi.getMouseStrains();
              return response.data || [];
            }}
            mapConfig={{
              labelKey: "mouse_strain_name" as const,
              valueKey: "id" as const,
            }}
            queryKey={["strains-dropdown"]}
            value={formData.selectedStrains.map(String)}
            onChange={handleStrainChange}
            placeholder={"Select mouse strains"}
            multiple
            searchable={false}
            size="default"
            optionWithAll={false}
          />
          {errors.selectedStrains && (
            <p className="text-sm text-red-500">{errors.selectedStrains}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Select Cell Lines</Label>

          <AsyncSelect
            query={async () => {
              const response = await cellLineApi.getCellLines();
              return response.data || [];
            }}
            mapConfig={{
              labelKey: "cell_line_name" as const,
              valueKey: "id" as const,
            }}
            queryKey={["cell-lines-dropdown"]}
            value={formData.selectedCellLines.map(String)}
            onChange={handleCellLineChange}
            placeholder={"Select cell lines"}
            multiple
            searchable={false}
            size="default"
            optionWithAll={false}
          />
          {errors.selectedCellLines && (
            <p className="text-sm text-red-500">{errors.selectedCellLines}</p>
          )}
        </div>

        <div className="flex items-center gap-2 space-y-0">
          <Checkbox
            checked={formData.includeMarketDose}
            onCheckedChange={(checked) =>
              updateFormField("includeMarketDose", checked === true)
            }
            id="marketDose"
          />
          <Label
            htmlFor="marketDose"
            className="text-sm font-medium cursor-pointer"
          >
            Market Dose
          </Label>
        </div>

        {isGroupsShow && (
          <div className="space-y-3 pt-2">
            <Label>Groups</Label>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {formData.groups.map((group, index) => (
                <div
                  key={`group-${group.groupNumber}-${index}`}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="text-sm font-semibold mb-3">
                    Group {index + 1}
                  </h3>

                  <EfficacyGroupFields
                    group={group}
                    index={index}
                    groupType={group.groupType}
                    projectId={projectId}
                    strainName={
                      group.strainId
                        ? allStrains.find((s) => s.id === group.strainId)
                            ?.mouse_strain_name
                        : undefined
                    }
                    selectedStrains={selectedStrainsData}
                    selectedCellLines={selectedCellLinesData}
                    onUpdate={updateGroup}
                    onAddDose={addDoseInput}
                    onRemoveDose={removeDoseInput}
                    onDoseChange={updateDoseValue}
                    onCreateFrequency={openFrequencyModal}
                    errors={errors.groups?.[index]}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleCancel}
            disabled={isCreating}
            type="button"
          >
            Cancel
          </Button>
          <Button size="lg" type="submit" disabled={isCreating}>
            {isCreating ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
      <CreateFrequencyModal
        open={isFrequencyModalOpen}
        onOpenChange={closeFrequencyModal}
      />
    </>
  );
};

export default EfficacyExperimentForm;
