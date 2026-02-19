import type { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { ExperimentDropdownItem } from "@/api";
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
import {
  useCreateBiodExperiment,
  useCreateExperiment,
  useExperimentData,
} from "@/hooks";
import { SPECIALIZATION, STUDY_TYPE_CODE } from "@/lib/constants";

import { Button, Input } from "../atoms";
import { Dialog } from "../atoms/Dialog/Dialog";
import { Label } from "../atoms/Label/Label";
import { CalendarDatePicker } from "../organisms";
import ClrfExperimentForm from "./ClrfExperimentForm";
import ConjugationExperimentForm from "./ConjugationExperimentForm";
import { CustomSelect } from "./CustomSelect";
import DelfiaExperimentForm from "./DelfiaExperimentForm";
import DirectBindingAssayExperimentForm from "./DirectBindingAssayExperimentForm";
import DoseRangeExperimentForm from "./DoseRangeExperimentForm";
import ElisaExperimentForm from "./ElisaExperimentForm";
import IrfExperimentForm from "./IrfExperimentForm";
import ModelStudyExperimentForm from "./ModelStudyExperimentForm";
import ReceptorQuantificationExperimentForm from "./ReceptorQuantificationExperiment";
import SaturationBindingExperimentForm from "./SaturationBindingExperimentForm";

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
  onCreateExperiment?: (experimentData: {
    id?: number;
    name: string;
    isotope: string;
    cellLines: string[];
  }) => Promise<void>;
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
  keepOpenAfterCreate?: boolean;
  preselectedStudyType?: string;
  onPerformBioDSave?: (experimentId: number) => void;
  preselectedCellLineIds?: number[];
  isBiodCellLineDisabled?: boolean;
}

export function CreateExperimentModal({
  isOpen,
  onClose,
  onCreateExperiment = async () => {},
  isotopeOptions,
  cellLineOptions,
  studyType = STUDY_TYPE_CODE.BIO_DISTRIBUTION,
  projectId,
  specialization,
  studyTypeId,
  onExperimentCreated,
  keepOpenAfterCreate = false,
  preselectedCellLineIds = [],
  isBiodCellLineDisabled = false,
}: Readonly<CreateExperimentModalProps>) {
  const {
    isotopes: apiIsotopes,
    cellLines: apiCellLines,
    mouseStrains: apiMouseStrains,
    loadExperimentData,
  } = useExperimentData();

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isIsotopeAutoSet, setIsIsotopeAutoSet] = useState(false);
  const dispatch = useAppDispatch();

  const { createExperiment, isCreating } = useCreateExperiment({
    onSuccess: (data) => {
      handleSuccess({
        id: data?.id,
        experiment_name: data?.experiment_name,
        randomization_status: data?.randomization_status,
      });
    },
  });

  const { createBiodExperiment, isCreating: isCreatingBiod } =
    useCreateBiodExperiment({
      onSuccess: (data) => {
        if (data?.id && data?.experiment_name) {
          handleSuccess({
            id: data?.id,
            experiment_name: data?.experiment_name,
            randomization_status: data?.randomization_status,
          });
        }
      },
    });

  const updateFormState = useCallback((updates: Partial<FormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleSuccess = (data: ExperimentDropdownItem) => {
    onCreateExperiment({
      id: data.id,
      name: formState.experimentName.trim(),
      isotope: formState.selectedIsotope,
      cellLines: formState.selectedCellLines,
    });

    dispatch(
      experimentCreated({
        experimentId: data.id,
        experimentName: data.experiment_name,
        randomizationStatus: data?.randomization_status ?? "pending",
      })
    );

    if (onExperimentCreated) {
      onExperimentCreated({
        id: data.id,
        name: data.experiment_name,
      });
    }

    if (!keepOpenAfterCreate) {
      handleReset();
      onClose();
    }
  };

  const dynamicIsotopeOptions = useMemo(
    () =>
      apiIsotopes.length > 0
        ? apiIsotopes.map((isotope) => ({
            value: isotope.isotope_name,
            label: isotope.isotope_name,
          }))
        : isotopeOptions,
    [apiIsotopes, isotopeOptions]
  );

  const dynamicCellLineOptions = useMemo(
    () =>
      apiCellLines.length > 0
        ? apiCellLines.map((cellLine) => ({
            value: cellLine.cell_line_name,
            label: `${cellLine.cell_line_name} (${cellLine.vendor_name})`,
          }))
        : cellLineOptions,
    [apiCellLines, cellLineOptions]
  );

  const dynamicMouseStrainOptions = useMemo(
    () =>
      apiMouseStrains.length > 0
        ? apiMouseStrains.map((strain) => ({
            value: strain.mouse_strain_name,
            label: strain.mouse_strain_name,
          }))
        : strainOptions,
    [apiMouseStrains]
  );

  useEffect(() => {
    if (
      isOpen &&
      !isIsotopeAutoSet &&
      dynamicIsotopeOptions.length > 0 &&
      !formState.selectedIsotope
    ) {
      const pb212Option = dynamicIsotopeOptions.find(
        (option) => option.value.toLowerCase() === "pb-212"
      );

      if (pb212Option) {
        updateFormState({ selectedIsotope: pb212Option.value });
        setIsIsotopeAutoSet(true);
      }
    }
  }, [
    isOpen,
    dynamicIsotopeOptions,
    formState.selectedIsotope,
    isIsotopeAutoSet,
    updateFormState,
  ]);

  useEffect(() => {
    if (
      isOpen &&
      preselectedCellLineIds.length > 0 &&
      apiCellLines.length > 0 &&
      formState.selectedCellLines.length === 0
    ) {
      const preselectedCellLines = apiCellLines
        .filter((cellLine) => preselectedCellLineIds.includes(cellLine.id))
        .map((cellLine) => cellLine.cell_line_name);

      if (preselectedCellLines.length > 0) {
        updateFormState({ selectedCellLines: preselectedCellLines });
      }
    }
  }, [
    isOpen,
    preselectedCellLineIds,
    apiCellLines,
    formState.selectedCellLines.length,
    updateFormState,
  ]);

  const validateBasicFields = (): boolean => {
    if (!formState.experimentName.trim()) {
      return false;
    }

    if (
      studyType === STUDY_TYPE_CODE.BIO_DISTRIBUTION ||
      studyType === STUDY_TYPE_CODE.TOXICITY
    ) {
      if (
        !formState.selectedIsotope ||
        formState.selectedCellLines.length === 0 ||
        (studyType === STUDY_TYPE_CODE.TOXICITY &&
          formState.selectedMouseStrains.length === 0)
      ) {
        return false;
      }
    } else if (studyType === STUDY_TYPE_CODE.DOSE_RANGE_FINDING) {
      if (formState.selectedDoseTypes.length === 0) {
        return false;
      }
    }

    return true;
  };

  const getExperimentPayloadIds = () => {
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

    return { selectedIsotopeId, selectedCellLineIds, selectedMouseStrainIds };
  };

  const handleSave = async () => {
    if (!validateBasicFields()) {
      return;
    }

    if (
      (studyType === STUDY_TYPE_CODE.BIO_DISTRIBUTION ||
        studyType === STUDY_TYPE_CODE.TOXICITY) &&
      projectId &&
      specialization &&
      studyTypeId
    ) {
      const { selectedIsotopeId, selectedCellLineIds, selectedMouseStrainIds } =
        getExperimentPayloadIds();

      if (
        !selectedIsotopeId ||
        selectedCellLineIds.length === 0 ||
        (studyType === STUDY_TYPE_CODE.TOXICITY &&
          selectedMouseStrainIds.length === 0)
      ) {
        toast.error("Failed to create experiment", {
          description:
            "Please ensure all required fields are selected with valid options",
        });
        return;
      }

      const basePayload = {
        cell_line_ids: selectedCellLineIds,
        experiment_name: formState.experimentName.trim(),
        isotope_id: selectedIsotopeId,
        project_id: projectId,
        specialization: specialization.toUpperCase(),
        study_type_id: studyTypeId,
      };

      if (studyType === STUDY_TYPE_CODE.BIO_DISTRIBUTION) {
        await createBiodExperiment(basePayload);
      } else {
        await createExperiment({
          ...basePayload,
          mouse_strain_ids: selectedMouseStrainIds,
        });
      }
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
        toast.error("Failed to create experiment", {
          description: (error as AxiosError)?.message,
        });
      }
    }
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFormState(initialFormState);
    setIsIsotopeAutoSet(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsIsotopeAutoSet(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (
      isOpen &&
      (studyType === STUDY_TYPE_CODE.BIO_DISTRIBUTION ||
        studyType === STUDY_TYPE_CODE.TOXICITY)
    ) {
      loadExperimentData();
    }
  }, [isOpen, studyType, loadExperimentData]);

  const renderCMCForms = () => {
    if (studyType === STUDY_TYPE_CODE.CLRF) {
      return (
        <ClrfExperimentForm
          projectId={projectId}
          studyTypeId={studyTypeId}
          specialization={specialization}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      );
    }

    if (studyType === STUDY_TYPE_CODE.DIRECT_BINDING_ASSAY) {
      return (
        <DirectBindingAssayExperimentForm
          projectId={projectId}
          studyTypeId={studyTypeId}
          specialization={specialization}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      );
    }

    if (studyType === STUDY_TYPE_CODE.CONJUGATION) {
      return (
        <ConjugationExperimentForm
          projectId={projectId}
          studyTypeId={studyTypeId}
          specialization={specialization}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      );
    }

    if (studyType === STUDY_TYPE_CODE.IRF) {
      return (
        <IrfExperimentForm
          projectId={projectId}
          studyTypeId={studyTypeId}
          specialization={specialization}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      );
    }

    if (studyType === STUDY_TYPE_CODE.RECEPTOR_QUANTIFICATION) {
      return (
        <ReceptorQuantificationExperimentForm
          projectId={projectId}
          studyTypeId={studyTypeId}
          specialization={specialization}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      );
    }

    if (studyType === STUDY_TYPE_CODE.SATURATION_BINDING_ASSAY) {
      return (
        <SaturationBindingExperimentForm
          projectId={projectId}
          studyTypeId={studyTypeId}
          specialization={specialization}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      );
    }

    return null;
  };

  const renderChemistryForms = () => {
    if (studyType === STUDY_TYPE_CODE.DELFIA) {
      return (
        <DelfiaExperimentForm
          projectId={projectId}
          studyTypeId={studyTypeId}
          specialization={specialization}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      );
    }

    if (studyType === STUDY_TYPE_CODE.ELISA) {
      return (
        <ElisaExperimentForm
          projectId={projectId}
          studyTypeId={studyTypeId}
          specialization={specialization}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      );
    }

    return null;
  };

  const renderPreclinicalForms = () => {
    if (studyType === STUDY_TYPE_CODE.MODEL_STUDY) {
      return (
        <ModelStudyExperimentForm
          projectId={projectId}
          studyTypeId={studyTypeId}
          specialization={specialization}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      );
    }

    if (
      studyType === STUDY_TYPE_CODE.DOSE_RANGE_FINDING ||
      studyType === STUDY_TYPE_CODE.TOXICITY
    ) {
      return (
        <DoseRangeExperimentForm
          projectId={projectId}
          studyTypeId={studyTypeId}
          specialization={specialization}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
          experimentType={
            studyType === STUDY_TYPE_CODE.DOSE_RANGE_FINDING
              ? "dose-range"
              : "toxicity"
          }
        />
      );
    }

    return null;
  };

  const renderGenericPreclinicalExperimentForm = () => {
    return (
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

          {(studyType === STUDY_TYPE_CODE.BIO_DISTRIBUTION ||
            studyType === STUDY_TYPE_CODE.TOXICITY) && (
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
                  disabled={isBiodCellLineDisabled}
                />
              </div>
              {studyType === STUDY_TYPE_CODE.TOXICITY && (
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
              )}
            </>
          )}

          {studyType === STUDY_TYPE_CODE.DOSE_RANGE_FINDING && (
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

          {studyType === STUDY_TYPE_CODE.EFFICACY && (
            <div className="text-sm text-muted-foreground p-3 bg-blue-50 rounded-md">
              For Efficacy studies, only the experiment name is required.
            </div>
          )}

          {studyType === STUDY_TYPE_CODE.MODEL_STUDY && (
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
                  disablePastDates={false}
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
            disabled={isCreating || isCreatingBiod}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            size={"lg"}
            disabled={
              !formState.experimentName.trim() ||
              isCreating ||
              isCreatingBiod ||
              ((studyType === STUDY_TYPE_CODE.BIO_DISTRIBUTION ||
                studyType === STUDY_TYPE_CODE.TOXICITY) &&
                (!formState.selectedIsotope ||
                  formState.selectedCellLines.length === 0)) ||
              (studyType === STUDY_TYPE_CODE.DOSE_RANGE_FINDING &&
                formState.selectedDoseTypes.length === 0) ||
              (studyType === STUDY_TYPE_CODE.MODEL_STUDY &&
                (formState.selectedCellLines.length === 0 ||
                  !formState.selectedStrain))
            }
          >
            {isCreating || isCreatingBiod ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    );
  };

  const renderExperimentForm = () => {
    if (specialization?.toLowerCase() === SPECIALIZATION.CMC.toLowerCase()) {
      const cmcForm = renderCMCForms();
      if (cmcForm) return cmcForm;
    }

    if (
      specialization?.toLowerCase() === SPECIALIZATION.CHEMISTRY.toLowerCase()
    ) {
      const chemistryForm = renderChemistryForms();
      if (chemistryForm) return chemistryForm;
    }

    if (
      specialization?.toLowerCase() === SPECIALIZATION.PRECLINICAL.toLowerCase()
    ) {
      const preclinicalForm = renderPreclinicalForms();
      if (preclinicalForm) return preclinicalForm;

      return renderGenericPreclinicalExperimentForm();
    }

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Experiment creation is not available for the selected specialization.
        </p>
      </div>
    );
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
      {renderExperimentForm()}
    </Dialog>
  );
}
