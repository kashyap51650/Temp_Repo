import { useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import type { StudyType } from "@/api";
import { mouseGroupApi } from "@/api";
import { CreateExperimentModal } from "@/components/data-upload/CreateExperimentModal";
import { SelectMiceModal } from "@/components/project-folders/SelectMiceModal";
import { SelectTargetExperimentModal } from "@/components/project-folders/SelectTargetExperimentModal";
import { UpdateSlotSizeOfMouseGroupsModal } from "@/components/project-folders/UpdateSlotSizeOfMouseGroupsModal";
import { useModal } from "@/hooks";
import { useExperimentDetails } from "@/hooks/useExperimentDetails";
import { useGetTargetExperiments, useMoveMice } from "@/hooks/useMoveMice";
import { queryClient } from "@/lib";
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
  const [selectedStudyTypeName, setSelectedStudyTypeName] =
    useState<string>("");
  const [newlyCreatedExperimentId, setNewlyCreatedExperimentId] = useState<
    number | undefined
  >();
  const [selectedExperimentId, setSelectedExperimentId] = useState<string>("");
  const [createdTargetExperiment, setCreatedTargetExperiment] = useState<
    { id: string; name: string; studyTypeId?: number } | undefined
  >();
  const mouseGroupModal = useModal();
  const fillGroupsModal = useModal();
  const [fillGroupsExperimentId, setFillGroupsExperimentId] = useState<
    number | undefined
  >();
  const [checkingSlots, setCheckingSlots] = useState(false);

  const isEfficacyOrModelStudy =
    selectedStudyTypeCode === STUDY_TYPE_CODE.EFFICACY ||
    selectedStudyTypeCode === STUDY_TYPE_CODE.MODEL_STUDY;

  const search = useSearch({
    from: "/project-folders",
  });

  const { experimentDetails, error } = useExperimentDetails(
    search.experimentId ?? null
  );

  const {
    data: experimentsData,
    isLoading: experimentsLoading,
    refetch: refetchExperiments,
    isRefetching: experimentsRefetching,
  } = useGetTargetExperiments(
    sourceExperimentId,
    isOpen &&
      (currentStep === MoveMiceStep.SELECT_TARGET_EXPERIMENT ||
        newlyCreatedExperimentId !== undefined) &&
      !!selectedStudyTypeId,
    selectedStudyTypeId
  );

  const moveMiceMutation = useMoveMice();

  const experimentsForSelection = useMemo(() => {
    const experiments = experimentsData || [];

    if (!createdTargetExperiment) {
      return experiments;
    }

    const alreadyPresent = experiments.some(
      (experiment) => experiment.id === createdTargetExperiment.id
    );

    if (alreadyPresent) {
      return experiments;
    }

    return [
      {
        id: createdTargetExperiment.id,
        name: createdTargetExperiment.name,
        cellLines: [],
        isotope: "",
        projectId: projectId.toString(),
        studyType: selectedStudyTypeCode,
      },
      ...experiments,
    ];
  }, [
    createdTargetExperiment,
    experimentsData,
    projectId,
    selectedStudyTypeCode,
  ]);

  const checkGroupSlots = async (expId: number): Promise<boolean> => {
    try {
      const groups = await queryClient.fetchQuery({
        queryKey: ["randomized-mouse-groups", expId],
        queryFn: async () => {
          const response =
            await mouseGroupApi.getMouseGroupsByExperiment(expId);
          return response.data?.map((group) => ({
            id: group.id,
            name: group.group_name,
            slotSize: group.no_of_mice ?? 0,
          }));
        },
        staleTime: 0,
      });
      const sum = groups?.reduce((acc, g) => acc + g.slotSize, 0) ?? 0;
      return sum >= selectedMiceIds.length;
    } catch {
      return false;
    }
  };

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

  const handleExperimentIdChange = async (id: string) => {
    if (id && isEfficacyOrModelStudy) {
      setSelectedExperimentId("");
      const expId = Number.parseInt(id, 10);
      setCheckingSlots(true);
      const hasSufficientSlots = await checkGroupSlots(expId);
      setCheckingSlots(false);
      if (hasSufficientSlots) {
        setSelectedExperimentId(id);
      } else {
        setFillGroupsExperimentId(expId);
        fillGroupsModal.openModal();
      }
      return;
    }
    setSelectedExperimentId(id);
  };

  // Step 4: Handle experiment creation success
  const handleExperimentCreated = async (createdExperiment: {
    id: number;
    name: string;
  }) => {
    setNewlyCreatedExperimentId(createdExperiment.id);
    setCreatedTargetExperiment({
      id: createdExperiment.id.toString(),
      name: createdExperiment.name,
      studyTypeId: selectedStudyTypeId,
    });

    if (selectedStudyTypeCode === STUDY_TYPE_CODE.TOXICITY) {
      setSelectedExperimentId(createdExperiment.id.toString());
      setCurrentStep(MoveMiceStep.SELECT_TARGET_EXPERIMENT);
      handleTargetExperimentSelected(createdExperiment.id.toString());
      return;
    }

    if (selectedStudyTypeCode === STUDY_TYPE_CODE.MODEL_STUDY) {
      mouseGroupModal.openModal();
    } else if (selectedStudyTypeCode === STUDY_TYPE_CODE.EFFICACY) {
      setCheckingSlots(true);
      setCurrentStep(MoveMiceStep.SELECT_TARGET_EXPERIMENT);
      const hasSufficientSlots = await checkGroupSlots(createdExperiment.id);
      setCheckingSlots(false);
      if (hasSufficientSlots) {
        setSelectedExperimentId(createdExperiment.id.toString());
      } else {
        setSelectedExperimentId("");
        setFillGroupsExperimentId(createdExperiment.id);
        fillGroupsModal.openModal();
      }
    } else {
      setSelectedExperimentId(createdExperiment.id.toString());
      setCurrentStep(MoveMiceStep.SELECT_TARGET_EXPERIMENT);
    }

    try {
      await refetchExperiments();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch experiments"
      );
    }
  };

  const handleMouseGroupModalClose = async () => {
    mouseGroupModal.closeModal();
    if (newlyCreatedExperimentId) {
      setCheckingSlots(true);
      await queryClient.invalidateQueries({
        queryKey: ["randomized-mouse-groups", newlyCreatedExperimentId],
      });
      const hasSufficientSlots = await checkGroupSlots(
        newlyCreatedExperimentId
      );
      setCheckingSlots(false);
      if (hasSufficientSlots) {
        setSelectedExperimentId(newlyCreatedExperimentId.toString());
        setCurrentStep(MoveMiceStep.SELECT_TARGET_EXPERIMENT);
      } else {
        setFillGroupsExperimentId(newlyCreatedExperimentId);
        fillGroupsModal.openModal();
      }
    }
  };

  const handleMouseGroupingComplete = async () => {
    mouseGroupModal.closeModal();
    if (newlyCreatedExperimentId) {
      setCheckingSlots(true);
      setCurrentStep(MoveMiceStep.SELECT_TARGET_EXPERIMENT);
      await queryClient.invalidateQueries({
        queryKey: ["randomized-mouse-groups", newlyCreatedExperimentId],
      });
      const hasSufficientSlots = await checkGroupSlots(
        newlyCreatedExperimentId
      );
      setCheckingSlots(false);
      if (hasSufficientSlots) {
        setSelectedExperimentId(newlyCreatedExperimentId.toString());
      } else {
        setSelectedExperimentId("");
        setFillGroupsExperimentId(newlyCreatedExperimentId);
        fillGroupsModal.openModal();
      }
    }
  };

  const handleFillGroupsOk = () => {
    setSelectedExperimentId(fillGroupsExperimentId?.toString() ?? "");
    fillGroupsModal.closeModal();
    setFillGroupsExperimentId(undefined);
    setCurrentStep(MoveMiceStep.SELECT_TARGET_EXPERIMENT);
  };

  const handleFillGroupsClose = () => {
    fillGroupsModal.closeModal();
    setFillGroupsExperimentId(undefined);
    setCurrentStep(MoveMiceStep.SELECT_TARGET_EXPERIMENT);
  };

  const handleBackToStudyTypeSelection = () => {
    setCurrentStep(MoveMiceStep.SELECT_TARGET_EXPERIMENT);
    setSelectedExperimentId("");
    setCreatedTargetExperiment(undefined);
    setNewlyCreatedExperimentId(undefined);
    setFillGroupsExperimentId(undefined);
    setCheckingSlots(false);
  };

  // Handle wizard close
  const handleClose = () => {
    setCurrentStep(MoveMiceStep.SELECT_MICE);
    setSelectedMiceIds([]);
    setSelectedStudyTypeId(undefined);
    setSelectedStudyTypeCode(undefined);
    setSelectedStudyTypeName("");
    setSelectedExperimentId("");
    setCreatedTargetExperiment(undefined);
    setNewlyCreatedExperimentId(undefined);
    setFillGroupsExperimentId(undefined);
    setCheckingSlots(false);
    onClose();
  };

  // Handle "Create New Experiment" button click
  const handleCreateNewExperiment = () => {
    if (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load experiment details"
      );
      return;
    }
    if (experimentDetails?.cell_lines.length !== 0) {
      queryClient.setQueryData(["cell-lines-dropdown"], () => {
        return experimentDetails?.cell_lines || [];
      });
    }
    if (experimentDetails?.mouse_strains.length !== 0) {
      queryClient.setQueryData(["strains-dropdown"], () => {
        return experimentDetails?.mouse_strains || [];
      });
    }
    setCurrentStep(MoveMiceStep.STUDY_TYPE_FORM);
  };

  // Handle back navigation
  const handleBackToSelectMice = () => {
    setCurrentStep(MoveMiceStep.SELECT_MICE);
    setSelectedStudyTypeId(undefined);
    setSelectedStudyTypeCode(undefined);
    setSelectedStudyTypeName("");
    setSelectedMiceIds([]);
    setSelectedExperimentId("");
  };

  // Handle study type selection for target experiments filtering
  const handleTargetStudyTypeChange = (studyType: StudyType | undefined) => {
    setSelectedStudyTypeId(studyType?.id);
    setSelectedStudyTypeCode(studyType?.study_type_code);
    setSelectedStudyTypeName(studyType?.study_type_name ?? "");

    setSelectedExperimentId("");
    if (
      !studyType?.id ||
      (createdTargetExperiment?.studyTypeId !== undefined &&
        createdTargetExperiment.studyTypeId !== studyType.id)
    ) {
      setCreatedTargetExperiment(undefined);
    }
    setFillGroupsExperimentId(undefined);
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
        experiments={experimentsForSelection || []}
        isLoading={experimentsLoading || experimentsRefetching}
        isCheckingSlots={checkingSlots}
        isMoving={moveMiceMutation.isPending}
        selectedExperimentId={selectedExperimentId}
        onExperimentIdChange={handleExperimentIdChange}
        onStudyTypeChange={handleTargetStudyTypeChange}
        selectedStudyTypeId={selectedStudyTypeId}
        selectedStudyTypeName={selectedStudyTypeName}
      />

      {/* Step 4: Full Experiment Form based on Study Type */}
      <CreateExperimentModal
        isOpen={isOpen && currentStep === MoveMiceStep.STUDY_TYPE_FORM}
        onClose={handleBackToStudyTypeSelection}
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
        onClose={handleMouseGroupModalClose}
        onGroupingSaved={handleMouseGroupingComplete}
      />

      <UpdateSlotSizeOfMouseGroupsModal
        isOpen={isOpen && fillGroupsModal.isOpen}
        onClose={handleFillGroupsClose}
        onOk={handleFillGroupsOk}
        experimentId={fillGroupsExperimentId}
        totalMiceCount={selectedMiceIds.length}
      />
    </>
  );
}
