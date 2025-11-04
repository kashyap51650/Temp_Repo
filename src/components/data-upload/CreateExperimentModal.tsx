import { useState } from "react";

import {
  cellsInjectedOptions,
  doseTypeOptions,
  drugTypeOptions,
  strainOptions,
  vehicleOptions,
} from "@/data/experiments";

import { Button, Input } from "../atoms";
import { Dialog } from "../atoms/Dialog/Dialog";
import { Label } from "../atoms/Label/Label";
import { CalendarDatePicker } from "../organisms";
import { CustomSelect } from "./CustomSelect";

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
}

export function CreateExperimentModal({
  isOpen,
  onClose,
  onCreateExperiment,
  isotopeOptions,
  cellLineOptions,
  studyType = "Biodistribution",
}: CreateExperimentModalProps) {
  const [experimentName, setExperimentName] = useState("");
  const [selectedIsotope, setSelectedIsotope] = useState("");
  const [selectedCellLines, setSelectedCellLines] = useState<string[]>([]);
  const [selectedStrain, setSelectedStrain] = useState("");
  const [selectedCellsInjected, setSelectedCellsInjected] = useState<string[]>(
    []
  );
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [cellInjectionDate, setCellInjectionDate] = useState<Date | undefined>(
    undefined
  );
  const [selectedDoseTypes, setSelectedDoseTypes] = useState<string[]>([]);
  const [selectedDrugTypes, setSelectedDrugTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!experimentName.trim()) {
      return;
    }

    if (studyType === "Biodistribution" || studyType === "Toxicity") {
      if (!selectedIsotope || selectedCellLines.length === 0) {
        return;
      }
    } else if (studyType === "Dose Range Finding") {
      if (selectedDoseTypes.length === 0) {
        return;
      }
    }

    setIsLoading(true);
    try {
      await onCreateExperiment({
        name: experimentName.trim(),
        isotope: selectedIsotope,
        cellLines: selectedCellLines,
      });
      handleReset();
      onClose();
    } catch (error) {
      console.error("Failed to create experiment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setExperimentName("");
    setSelectedIsotope("");
    setSelectedCellLines([]);
    setSelectedStrain("");
    setSelectedCellsInjected([]);
    setSelectedVehicles([]);
    setCellInjectionDate(undefined);
    setSelectedDoseTypes([]);
    setSelectedDrugTypes([]);
  };

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
              value={experimentName}
              onChange={(e) => setExperimentName(e.target.value)}
              placeholder="Enter experiment name"
              className="w-full"
              size="lg"
            />
          </div>

          {/* Biodistribution & Toxicity: Isotope + Cell Line */}
          {(studyType === "Biodistribution" || studyType === "Toxicity") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="isotope">Isotope</Label>
                <CustomSelect
                  options={isotopeOptions}
                  placeholder="Select isotope"
                  value={selectedIsotope}
                  className="w-full"
                  onValueChange={(value: string | string[]) => {
                    const selectedValue =
                      typeof value === "string" ? value : value[0];
                    setSelectedIsotope(selectedValue);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cell-line">Cell Line</Label>
                <CustomSelect
                  options={cellLineOptions}
                  placeholder="Select cell lines..."
                  multiple
                  className="w-full"
                  value={selectedCellLines}
                  onValueChange={(values: string | string[]) => {
                    const cellLines = Array.isArray(values) ? values : [values];
                    setSelectedCellLines(cellLines);
                  }}
                />
              </div>
            </>
          )}

          {/* Dose Range Finding: Type of Dose + Type of Drug */}
          {studyType === "Dose Range Finding" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="dose-type">Type of Dose</Label>
                <CustomSelect
                  options={doseTypeOptions}
                  placeholder="Select dose types..."
                  multiple
                  className="w-full"
                  value={selectedDoseTypes}
                  onValueChange={(values: string | string[]) => {
                    const types = Array.isArray(values) ? values : [values];
                    setSelectedDoseTypes(types);
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
                  value={selectedDrugTypes}
                  onValueChange={(values: string | string[]) => {
                    const types = Array.isArray(values) ? values : [values];
                    setSelectedDrugTypes(types);
                  }}
                />
              </div>
            </>
          )}

          {/* Efficacy: Only Experiment Name  */}
          {studyType === "Efficacy" && (
            <div className="text-sm text-muted-foreground p-3 bg-blue-50 rounded-md">
              For Efficacy studies, only the experiment name is required.
            </div>
          )}

          {/* Model Study: Full form with Cell Line, Strain, Cells Injected, Vehicle, Cell Injection Date */}
          {studyType === "Model Study" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cell-line">Cell Line</Label>
                <CustomSelect
                  options={cellLineOptions}
                  placeholder="Select cell line"
                  value={selectedCellLines}
                  className="w-full"
                  onValueChange={(value: string | string[]) => {
                    const cellLine =
                      typeof value === "string" ? value : value[0];
                    setSelectedCellLines([cellLine]);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strain">Strain</Label>
                <CustomSelect
                  options={strainOptions}
                  placeholder="Select strain"
                  value={selectedStrain}
                  className="w-full"
                  onValueChange={(value: string | string[]) => {
                    const strain = typeof value === "string" ? value : value[0];
                    setSelectedStrain(strain);
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
                  value={selectedCellsInjected}
                  onValueChange={(values: string | string[]) => {
                    const cells = Array.isArray(values) ? values : [values];
                    setSelectedCellsInjected(cells);
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
                  value={selectedVehicles}
                  onValueChange={(values: string | string[]) => {
                    const vehicles = Array.isArray(values) ? values : [values];
                    setSelectedVehicles(vehicles);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="injection-date">Cell Injection Date</Label>
                <CalendarDatePicker
                  id="injection-date"
                  value={cellInjectionDate}
                  onChange={setCellInjectionDate}
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
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            size={"lg"}
            disabled={
              !experimentName.trim() ||
              isLoading ||
              ((studyType === "Biodistribution" || studyType === "Toxicity") &&
                (!selectedIsotope || selectedCellLines.length === 0)) ||
              (studyType === "Dose Range Finding" &&
                selectedDoseTypes.length === 0) ||
              (studyType === "Model Study" &&
                (selectedCellLines.length === 0 || !selectedStrain))
            }
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
