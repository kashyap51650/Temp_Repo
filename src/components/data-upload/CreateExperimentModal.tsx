import { useEffect, useState } from "react";

import { useAppDispatch } from "@/app/store/hooks";
import { experimentCreated } from "@/app/store/slices/experimentSlice";
import { toast } from "@/components/atoms/Sonner/toast";
import {
  cellsInjectedOptions,
  doseTypeOptions,
  drugTypeOptions,
  strainOptions,
  vehicleOptions,
} from "@/data/experiments";
import { useCreateExperiment, useExperimentData } from "@/hooks";

import { Button, Input } from "../atoms";
import { Dialog } from "../atoms/Dialog/Dialog";
import { Label } from "../atoms/Label/Label";
import { CalendarDatePicker } from "../organisms";
import { CustomSelect } from "./CustomSelect";

interface FormState {
  experimentName: string;
  selectedIsotope: string;
  selectedCellLines: string[];
  selectedStrain: string;
  selectedCellsInjected: string[];
  selectedVehicles: string[];
  cellInjectionDate: Date | undefined;
  selectedDoseTypes: string[];
  selectedDrugTypes: string[];
  selectedMouseStrains: string[];
}

// Initial form state
const initialFormState: FormState = {
  experimentName: "",
  selectedIsotope: "",
  selectedCellLines: [],
  selectedStrain: "",
  selectedCellsInjected: [],
  selectedVehicles: [],
  cellInjectionDate: undefined,
  selectedDoseTypes: [],
  selectedDrugTypes: [],
  selectedMouseStrains: [],
};

interface CreateExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateExperiment: (experimentData: {
    name: string;
    isotope: string;
    cellLines: string[];
  }) => void;
  isotopeOptions: Array<{ value: string; label: string }>;
  cellLineOptions: Array<{ value: string; label: string }>;
  studyType?: string;
  projectId?: number;
  specialization?: string;
  studyTypeId?: number;
  onExperimentCreated?: (createdExperiment: {
    id: number;
    name: string;
  }) => void;
}

export function CreateExperimentModal({
  isOpen,
  onClose,
  onCreateExperiment,
  isotopeOptions,
  cellLineOptions,
  studyType = "Biodistribution",
  projectId,
  specialization,
  studyTypeId,
  onExperimentCreated,
}: CreateExperimentModalProps) {
  const {
    isotopes: apiIsotopes,
    cellLines: apiCellLines,
    mouseStrains: apiMouseStrains,
    loadExperimentData,
  } = useExperimentData();

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const dispatch = useAppDispatch();

  const { createExperiment, isCreating } = useCreateExperiment({
    onSuccess: (data) => {
      onCreateExperiment({
        name: formState.experimentName.trim(),
        isotope: formState.selectedIsotope,
        cellLines: formState.selectedCellLines,
      });

      dispatch(
        experimentCreated({
          experimentId: data.id,
          experimentName: data.experiment_name,
        })
      );

      if (onExperimentCreated) {
        onExperimentCreated({
          id: data.id,
          name: data.experiment_name,
        });
      }

      handleReset();
      onClose();
    },
  });

  const updateFormState = (updates: Partial<FormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const dynamicIsotopeOptions =
    apiIsotopes.length > 0
      ? apiIsotopes.map((isotope) => ({
          value: isotope.isotope_name,
          label: isotope.isotope_name,
        }))
      : isotopeOptions;

  const dynamicCellLineOptions =
    apiCellLines.length > 0
      ? apiCellLines.map((cellLine) => ({
          value: cellLine.cell_line_name,
          label: `${cellLine.cell_line_name} (${cellLine.vendor_name})`,
        }))
      : cellLineOptions;

  const dynamicMouseStrainOptions =
    apiMouseStrains.length > 0
      ? apiMouseStrains.map((strain) => ({
          value: strain.mouse_strain_name,
          label: strain.mouse_strain_name,
        }))
      : strainOptions;

  const handleSave = async () => {
    if (!formState.experimentName.trim()) {
      return;
    }

    if (studyType === "Biodistribution" || studyType === "Toxicity") {
      if (
        !formState.selectedIsotope ||
        formState.selectedCellLines.length === 0 ||
        formState.selectedMouseStrains.length === 0
      ) {
        return;
      }
    } else if (studyType === "Dose Range Finding") {
      if (formState.selectedDoseTypes.length === 0) {
        return;
      }
    }

    if (
      (studyType === "Biodistribution" || studyType === "Toxicity") &&
      projectId &&
      specialization &&
      studyTypeId
    ) {
      const selectedIsotopeId = apiIsotopes.find(
        (isotope) => isotope.isotope_name === formState.selectedIsotope
      )?.id;

      const selectedCellLineIds = formState.selectedCellLines
        .map(
          (cellLineName) =>
            apiCellLines.find(
              (cellLine) => cellLine.cell_line_name === cellLineName
            )?.id
        )
        .filter((id) => id !== undefined) as number[];

      const selectedMouseStrainIds = formState.selectedMouseStrains
        .map(
          (strainName) =>
            apiMouseStrains.find(
              (strain) => strain.mouse_strain_name === strainName
            )?.id
        )
        .filter((id) => id !== undefined) as number[];

      if (
        !selectedIsotopeId ||
        selectedCellLineIds.length === 0 ||
        selectedMouseStrainIds.length === 0
      ) {
        toast.error("Failed to create experiment", {
          description:
            "Please ensure all required fields are selected with valid options",
        });
        return;
      }

      const payload = {
        cell_line_ids: selectedCellLineIds,
        experiment_name: formState.experimentName.trim(),
        isotope_id: selectedIsotopeId,
        mouse_strain_ids: selectedMouseStrainIds,
        project_id: projectId,
        specialization: specialization.toUpperCase(),
        study_type_id: studyTypeId,
      };

      await createExperiment(payload);
    } else {
      try {
        await onCreateExperiment({
          name: formState.experimentName.trim(),
          isotope: formState.selectedIsotope,
          cellLines: formState.selectedCellLines,
        });

        if (onExperimentCreated) {
          onExperimentCreated({
            id: Date.now(),
            name: formState.experimentName.trim(),
          });
        }

        handleReset();
        onClose();
      } catch (error) {
        console.error("Failed to create experiment:", error);
      }
    }
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFormState(initialFormState);
  };

  useEffect(() => {
    if (
      isOpen &&
      (studyType === "Biodistribution" || studyType === "Toxicity")
    ) {
      loadExperimentData();
    }
  }, [isOpen, studyType, loadExperimentData]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) handleCancel();
      }}
      title={"Create New Experiment"}
      description={"Enter the details for your new experiment"}
      showClose={true}
      className="max-w-lg"
      trigger={null}
    >
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="experiment-name">Experiment Name</Label>
            <Input
              id="experiment-name"
              type="text"
              value={formState.experimentName}
              onChange={(e) =>
                updateFormState({ experimentName: e.target.value })
              }
              placeholder="Enter experiment name"
              className="w-full"
              size="lg"
            />
          </div>

          {(studyType === "Biodistribution" || studyType === "Toxicity") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="isotope">Isotope</Label>
                <CustomSelect
                  options={dynamicIsotopeOptions}
                  placeholder="Select isotope"
                  value={formState.selectedIsotope}
                  className="w-full"
                  onValueChange={(value: string | string[]) => {
                    const selectedValue =
                      typeof value === "string" ? value : value[0];
                    updateFormState({ selectedIsotope: selectedValue });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cell-line">Cell Line</Label>
                <CustomSelect
                  options={dynamicCellLineOptions}
                  placeholder="Select cell lines..."
                  multiple
                  className="w-full"
                  value={formState.selectedCellLines}
                  onValueChange={(values: string | string[]) => {
                    const cellLines = Array.isArray(values) ? values : [values];
                    updateFormState({ selectedCellLines: cellLines });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mouse-strains">Mouse Strains</Label>
                <CustomSelect
                  options={dynamicMouseStrainOptions}
                  placeholder="Select mouse strains..."
                  multiple
                  className="w-full"
                  value={formState.selectedMouseStrains}
                  onValueChange={(values: string | string[]) => {
                    const strains = Array.isArray(values) ? values : [values];
                    updateFormState({ selectedMouseStrains: strains });
                  }}
                />
              </div>
            </>
          )}

          {studyType === "Dose Range Finding" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="dose-type">Type of Dose</Label>
                <CustomSelect
                  options={doseTypeOptions}
                  placeholder="Select dose types..."
                  multiple
                  className="w-full"
                  value={formState.selectedDoseTypes}
                  onValueChange={(values: string | string[]) => {
                    const types = Array.isArray(values) ? values : [values];
                    updateFormState({ selectedDoseTypes: types });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="drug-type">Type of Drug</Label>
                <CustomSelect
                  options={drugTypeOptions}
                  placeholder="Select drug types..."
                  multiple
                  className="w-full"
                  value={formState.selectedDrugTypes}
                  onValueChange={(values: string | string[]) => {
                    const types = Array.isArray(values) ? values : [values];
                    updateFormState({ selectedDrugTypes: types });
                  }}
                />
              </div>
            </>
          )}

          {studyType === "Efficacy" && (
            <div className="text-sm text-muted-foreground p-3 bg-blue-50 rounded-md">
              For Efficacy studies, only the experiment name is required.
            </div>
          )}

          {studyType === "Model Study" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cell-line">Cell Line</Label>
                <CustomSelect
                  options={cellLineOptions}
                  placeholder="Select cell line"
                  value={formState.selectedCellLines}
                  className="w-full"
                  onValueChange={(value: string | string[]) => {
                    const cellLine =
                      typeof value === "string" ? value : value[0];
                    updateFormState({ selectedCellLines: [cellLine] });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strain">Strain</Label>
                <CustomSelect
                  options={strainOptions}
                  placeholder="Select strain"
                  value={formState.selectedStrain}
                  className="w-full"
                  onValueChange={(value: string | string[]) => {
                    const strain = typeof value === "string" ? value : value[0];
                    updateFormState({ selectedStrain: strain });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cells-injected">Cells Injected</Label>
                <CustomSelect
                  options={cellsInjectedOptions}
                  placeholder="Select cells injected..."
                  multiple
                  className="w-full"
                  value={formState.selectedCellsInjected}
                  onValueChange={(values: string | string[]) => {
                    const cells = Array.isArray(values) ? values : [values];
                    updateFormState({ selectedCellsInjected: cells });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle</Label>
                <CustomSelect
                  options={vehicleOptions}
                  placeholder="Select vehicles..."
                  multiple
                  className="w-full"
                  value={formState.selectedVehicles}
                  onValueChange={(values: string | string[]) => {
                    const vehicles = Array.isArray(values) ? values : [values];
                    updateFormState({ selectedVehicles: vehicles });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="injection-date">Cell Injection Date</Label>
                <CalendarDatePicker
                  id="injection-date"
                  value={formState.cellInjectionDate}
                  onChange={(date) =>
                    updateFormState({ cellInjectionDate: date })
                  }
                  placeholder="Pick a date"
                />
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            size={"lg"}
            onClick={handleCancel}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            size={"lg"}
            disabled={
              !formState.experimentName.trim() ||
              isCreating ||
              ((studyType === "Biodistribution" || studyType === "Toxicity") &&
                (!formState.selectedIsotope ||
                  formState.selectedCellLines.length === 0)) ||
              (studyType === "Dose Range Finding" &&
                formState.selectedDoseTypes.length === 0) ||
              (studyType === "Model Study" &&
                (formState.selectedCellLines.length === 0 ||
                  !formState.selectedStrain))
            }
          >
            {isCreating ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
