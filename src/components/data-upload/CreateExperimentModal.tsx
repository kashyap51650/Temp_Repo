import { useState } from "react";

import type { ExperimentDropdownItem } from "@/api";
import { useAppDispatch } from "@/app/store/hooks";
import { experimentCreated } from "@/app/store/slices/experimentSlice";
import { SPECIALIZATION, STUDY_TYPE_CODE } from "@/lib/constants";

import { Dialog } from "../atoms/Dialog/Dialog";
import { BiodExperimentForm } from "./BiodExperimentForm";
import ClrfExperimentForm from "./ClrfExperimentForm";
import ConjugationExperimentForm from "./ConjugationExperimentForm";
import DelfiaExperimentForm from "./DelfiaExperimentForm";
import DirectBindingAssayExperimentForm from "./DirectBindingAssayExperimentForm";
import DoseRangeExperimentForm from "./DoseRangeExperimentForm";
import EfficacyExperimentForm from "./EfficacyExperimentForm";
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
  preselectedCellLineIds?: number[];
  isBiodCellLineDisabled?: boolean;
  onPerformBioDSave?: (experimentId: number) => void;
}

export function CreateExperimentModal({
  isOpen,
  onClose,
  onCreateExperiment = async () => {},
  studyType = STUDY_TYPE_CODE.BIO_DISTRIBUTION,
  projectId,
  specialization,
  studyTypeId,
  onExperimentCreated,
  keepOpenAfterCreate = false,
  preselectedCellLineIds = [],
  isBiodCellLineDisabled = false,
}: Readonly<CreateExperimentModalProps>) {
  const [formState, setFormState] = useState<FormState>(initialFormState);

  const dispatch = useAppDispatch();

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

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFormState(initialFormState);
  };

  // ------------- Different Specialization Forms ------------- //

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
    if (!projectId) {
      return (
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <span className="sr-only">Notice</span>
              <span
                aria-hidden="true"
                className="text-lg text-muted-foreground"
              >
                !
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Project Required
              </p>
              <p className="text-sm text-muted-foreground">
                Project ID is required to create this experiment type.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (studyType === STUDY_TYPE_CODE.BIO_DISTRIBUTION) {
      return (
        <BiodExperimentForm
          projectId={projectId}
          studyTypeId={studyTypeId}
          specialization={specialization}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          preselectedCellLineIds={preselectedCellLineIds}
          isCellLineDisabled={isBiodCellLineDisabled}
        />
      );
    }

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

    if (studyType === STUDY_TYPE_CODE.EFFICACY) {
      return (
        <EfficacyExperimentForm
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
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <span className="sr-only">Notice</span>
            <span aria-hidden="true" className="text-lg text-muted-foreground">
              !
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Creation Not Available
            </p>
            <p className="text-sm text-muted-foreground">
              Experiment creation is not supported for{" "}
              <span className="font-medium capitalize">
                {studyType.split("_").join(" ").toLowerCase()}
              </span>
              . Please select an existing experiment instead.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
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
        preventOutsideClose
      >
        {renderExperimentForm()}
      </Dialog>
    </>
  );
}
