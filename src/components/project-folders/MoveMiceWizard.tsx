import { useState } from "react";
import { toast } from "sonner";

import type { StudyType } from "@/api";
import { CreateExperimentModal } from "@/components/data-upload/CreateExperimentModal";
import { CreateExperimentModalForMoveMice } from "@/components/project-folders/CreateExperimentModalForMoveMice";
import { SelectMiceModal } from "@/components/project-folders/SelectMiceModal";
import { SelectTargetExperimentModal } from "@/components/project-folders/SelectTargetExperimentModal";
import { useModal } from "@/hooks";
import { useGetTargetExperiments, useMoveMice } from "@/hooks/useMoveMice";
import { STUDY_TYPE_CODE, type StudyTypeCode } from "@/lib/constants";
import { MoveMiceStep, type MoveMiceStepType } from "@/types/moveMice";

import { MouseGroupsOrderModal } from "../data-upload/MouseGroupsOrderModal";

interface MoveMiceWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  sourceExperimentId: number;
  projectId: number;
  studyTypeId?: number;
  specialization?: string;
}

export function MoveMiceWizard({
  isOpen,
  onClose,
  onComplete,
  sourceExperimentId,
  projectId,
  // studyTypeId: _studyTypeId, // Intentionally unused - kept for API compatibility
  specialization = "Preclinical",
}: Readonly<MoveMiceWizardProps>) {
  const [currentStep, setCurrentStep] = useState<MoveMiceStepType>(
    MoveMiceStep.SELECT_MICE
  );
  const [selectedMiceIds, setSelectedMiceIds] = useState<string[]>([]);
  const [selectedStudyTypeId, setSelectedStudyTypeId] = useState<
    number | undefined
  >();
  const [selectedStudyTypeCode, setSelectedStudyTypeCode] = useState<
    StudyTypeCode | undefined
  >();
  const [newlyCreatedExperimentId, setNewlyCreatedExperimentId] = useState<
    number | undefined
  >();
  const mouseGroupModal = useModal();

  const {
    data: experimentsData,
    isLoading: experimentsLoading,
    refetch: refetchExperiments,
    isRefetching: experimentsRefetching,
  } = useGetTargetExperiments(
    sourceExperimentId,
    isOpen &&
      (currentStep === MoveMiceStep.SELECT_TARGET_EXPERIMENT ||
        newlyCreatedExperimentId !== undefined)
  );

  const moveMiceMutation = useMoveMice();

  // Step 1: Handle mice selection
  const handleMiceSelected = (selectedIds: string[]) => {
    setSelectedMiceIds(selectedIds);
    setCurrentStep(MoveMiceStep.SELECT_TARGET_EXPERIMENT);
  };

  // Step 2: Handle target experiment selection (move mice)
  const handleTargetExperimentSelected = (targetExperimentId: string) => {
    const mouseIdsAsNumbers = selectedMiceIds.map((id) =>
      Number.parseInt(id, 10)
    );

    moveMiceMutation.mutate(
      {
        source_experiment_id: sourceExperimentId,
        target_experiment_id: Number.parseInt(targetExperimentId, 10),
        mouse_ids: mouseIdsAsNumbers,
      },
      {
        onSuccess: () => {
          handleClose();
          onComplete?.();
        },
      }
    );
  };

  // Step 3: Handle study type selection - immediately open CreateExperimentModal
  const handleStudyTypeSelected = (studyTypeData: StudyType) => {
    const { id: studyTypeId, study_type_code: studyTypeCode } = studyTypeData;
    setSelectedStudyTypeId(studyTypeId);
    setSelectedStudyTypeCode(studyTypeCode);
    setCurrentStep(MoveMiceStep.STUDY_TYPE_FORM);
  };

  // Step 4: Handle experiment creation success
  const handleExperimentCreated = async (createdExperiment: {
    id: number;
    name: string;
  }) => {
    setNewlyCreatedExperimentId(createdExperiment.id);

    if (selectedStudyTypeCode === STUDY_TYPE_CODE.MODEL_STUDY) {
      mouseGroupModal.openModal();
    } else {
      try {
        setCurrentStep(MoveMiceStep.SELECT_TARGET_EXPERIMENT);
        await refetchExperiments();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch experiments"
        );
      }
    }
  };

  const handleMouseGroupingComplete = async () => {
    setCurrentStep(MoveMiceStep.SELECT_TARGET_EXPERIMENT);
    await refetchExperiments();
  };

  const handleBackToStudyTypeSelection = () => {
    setCurrentStep(MoveMiceStep.CREATE_EXPERIMENT);
    setSelectedStudyTypeId(undefined);
  };

  // Handle back from Step 3 to Step 2
  const handleBackToTargetExperiment = () => {
    setCurrentStep(MoveMiceStep.SELECT_TARGET_EXPERIMENT);
    setNewlyCreatedExperimentId(undefined);
  };

  // Handle wizard close
  const handleClose = () => {
    setCurrentStep(MoveMiceStep.SELECT_MICE);
    setSelectedMiceIds([]);
    setSelectedStudyTypeId(undefined);
    setNewlyCreatedExperimentId(undefined);
    onClose();
  };

  // Handle "Create New Experiment" button click
  const handleCreateNewExperiment = () => {
    setCurrentStep(MoveMiceStep.CREATE_EXPERIMENT);
  };

  // Handle back navigation
  const handleBackToSelectMice = () => {
    setCurrentStep(MoveMiceStep.SELECT_MICE);
    setSelectedMiceIds([]);
  };

  return (
    <>
      {/* Step 1: Select Mice Modal */}
      <SelectMiceModal
        isOpen={isOpen && currentStep === MoveMiceStep.SELECT_MICE}
        onClose={handleClose}
        onNext={handleMiceSelected}
        sourceExperimentId={sourceExperimentId}
      />

      {/* Step 2: Select Target Experiment Modal */}
      <SelectTargetExperimentModal
        isOpen={isOpen && currentStep === MoveMiceStep.SELECT_TARGET_EXPERIMENT}
        onClose={handleBackToSelectMice}
        onMove={handleTargetExperimentSelected}
        onCreateNew={handleCreateNewExperiment}
        selectedMiceCount={selectedMiceIds.length}
        experiments={experimentsData || []}
        isLoading={experimentsLoading || experimentsRefetching}
        isMoving={moveMiceMutation.isPending}
        preSelectedExperimentId={newlyCreatedExperimentId?.toString()}
      />

      {/* Step 3: Study Type Selection Modal */}
      <CreateExperimentModalForMoveMice
        isOpen={isOpen && currentStep === MoveMiceStep.CREATE_EXPERIMENT}
        onClose={handleBackToTargetExperiment}
        onStudyTypeSelected={handleStudyTypeSelected}
      />

      {/* Step 4: Full Experiment Form based on Study Type */}
      <CreateExperimentModal
        isOpen={isOpen && currentStep === MoveMiceStep.STUDY_TYPE_FORM}
        onClose={handleBackToStudyTypeSelection}
        isotopeOptions={[]}
        cellLineOptions={[]}
        studyType={selectedStudyTypeCode}
        projectId={projectId}
        studyTypeId={selectedStudyTypeId}
        specialization={specialization}
        onExperimentCreated={handleExperimentCreated}
        keepOpenAfterCreate={true}
      />

      <MouseGroupsOrderModal
        experimentId={newlyCreatedExperimentId}
        open={isOpen && mouseGroupModal.isOpen}
        onClose={() => mouseGroupModal.closeModal()}
        onSuccess={() => {
          mouseGroupModal.closeModal();
        }}
        onGroupingSaved={handleMouseGroupingComplete}
      />
    </>
  );
}
