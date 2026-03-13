import { Link2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { StudyType } from "@/api";
import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";
import { Label } from "@/components/atoms/Label/Label";
import { CreateExperimentModalForMoveMice } from "@/components/project-folders/CreateExperimentModalForMoveMice";
import { useLinkExperimentModal } from "@/hooks/useLinkExperimentModal";
import { useModal } from "@/hooks/useModal";
import { STUDY_TYPE_CODE, type StudyTypeCode } from "@/lib/constants";
import type { ImportHotlabPDFResponse } from "@/types/hotlab";

import { CreateExperimentModal } from "./CreateExperimentModal";
import { ExperimentDropdown } from "./ExperimentDropdown";
import { MouseGroupsOrderModal } from "./MouseGroupsOrderModal";

interface LinkExperimentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extractedExperimentList?: { experimentId: number; experimentName: string }[];
  projectId?: number;
  studyTypeId?: number;
  onSuccess?: (data: ImportHotlabPDFResponse) => void;
  file?: File;
}

const OTHER_OPTION_ID = -1;

export function LinkExperimentModal({
  open,
  onOpenChange,
  onSuccess,
  extractedExperimentList = [],
  file,
  projectId,
}: Readonly<LinkExperimentModalProps>) {
  // Track whether user is in the create experiment flow
  const studyTypeModal = useModal();
  const experimentFormModal = useModal();
  const mouseGroupModal = useModal();

  const [selectedStudyTypeId, setSelectedStudyTypeId] = useState<
    number | undefined
  >();
  const [selectedStudyTypeCode, setSelectedStudyTypeCode] = useState<
    StudyTypeCode | undefined
  >();
  const [specialisation, setSpecialisation] = useState<string>("");

  const {
    selectedOption,
    selectedExperimentId,
    isOtherSelected,
    isLoading,
    canSave,
    setSelectedOption,
    setSelectedExperimentId,
    handleSave: handleSaveFromHook,
  } = useLinkExperimentModal({
    open,
    onSuccess: (data) => {
      onSuccess?.(data);
      onOpenChange(false);
    },
  });

  const handleSave = async () => {
    if (!file) {
      toast.error("No file provided for linking experiment");
      return;
    }
    await handleSaveFromHook(file);
  };

  // Handle "Create New" button click - show study type selection first
  const handleCreateNewClick = () => {
    studyTypeModal.openModal();
  };

  // Handle study type selection - then show experiment form
  const handleStudyTypeSelected = (studyTypeData: StudyType) => {
    const {
      id: studyTypeId,
      study_type_code: studyTypeCode,
      specialization,
    } = studyTypeData;
    setSpecialisation(specialization || "");
    setSelectedStudyTypeId(studyTypeId);
    setSelectedStudyTypeCode(studyTypeCode);
    studyTypeModal.closeModal();
    experimentFormModal.openModal();
  };

  // Handle experiment creation success
  const handleExperimentCreated = (createdExperiment: {
    id: number;
    name: string;
  }) => {
    experimentFormModal.closeModal();
    setSelectedOption(OTHER_OPTION_ID);
    setSelectedExperimentId(createdExperiment.id);

    if (selectedStudyTypeCode === STUDY_TYPE_CODE.MODEL_STUDY) {
      mouseGroupModal.openModal();
    }
    // Set to "Other" mode and select the newly created experiment
    // Return to the main link modal with the new experiment pre-selected
  };

  // Handle closing study type selection modal
  const handleCloseStudyTypeSelection = () => {
    studyTypeModal.closeModal();
  };

  // Handle closing experiment form modal
  const handleCloseExperimentForm = () => {
    experimentFormModal.closeModal();
    setSelectedStudyTypeId(undefined);
    setSelectedStudyTypeCode(undefined);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
        trigger={null}
        title={
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="size-5 text-primary" />
            Select Experiment to Link
          </div>
        }
        className="sm:max-w-2xl max-h-[80vh] overflow-y-auto"
        preventOutsideClose={true}
      >
        <div className="space-y-4 py-2">
          {extractedExperimentList.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Available Experiments
              </Label>
              <div className="space-y-2 max-h-80 overflow-y-auto  rounded-md p-2">
                {extractedExperimentList.map((experiment) => (
                  <Label
                    key={experiment.experimentId}
                    className="flex items-center gap-3 px-2 py-1 rounded-md cursor-pointer hover:bg-accent transition-colors"
                    htmlFor={`exp-${experiment.experimentId}`}
                  >
                    <span className="sr-only">
                      Select {experiment.experimentName}
                    </span>
                    <Input
                      type="radio"
                      id={`exp-${experiment.experimentId}`}
                      name="experiment"
                      value={experiment.experimentId}
                      checked={selectedOption === experiment.experimentId}
                      onChange={() => {
                        setSelectedOption(experiment.experimentId);
                        setSelectedExperimentId(null);
                      }}
                      className="h-4 w-4 text-primary focus:ring-primary cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {experiment.experimentName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {experiment.experimentId}
                      </p>
                    </div>
                  </Label>
                ))}

                {/* "Any Other" option */}
                <Label
                  className="flex items-center gap-3 p-3 rounded-md border cursor-pointer hover:bg-accent transition-colors bg-muted/30"
                  htmlFor="exp-other"
                >
                  <span className="sr-only">Select any other experiment</span>
                  <Input
                    type="radio"
                    id="exp-other"
                    name="experiment"
                    value={OTHER_OPTION_ID}
                    checked={selectedOption === OTHER_OPTION_ID}
                    onChange={() => {
                      setSelectedOption(OTHER_OPTION_ID);
                      setSelectedExperimentId(null);
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Any Other</p>
                    <p className="text-xs text-muted-foreground">
                      Search for a different experiment
                    </p>
                  </div>
                </Label>
              </div>
            </div>
          )}

          {/* Show dropdown when "Other" is selected */}
          {(isOtherSelected || extractedExperimentList.length === 0) && (
            <div className="space-y-2 pt-2">
              <ExperimentDropdown
                value={selectedExperimentId?.toString() || ""}
                onValueChange={(val: string) => {
                  const experimentId = Number.parseInt(val, 10);
                  setSelectedOption(OTHER_OPTION_ID);
                  setSelectedExperimentId(experimentId);
                }}
                onCreateNew={handleCreateNewClick}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            onClick={handleSave}
            disabled={!canSave || isLoading}
          >
            {isLoading ? "Saving..." : "Link Experiment"}
          </Button>
        </div>
      </Dialog>

      {/* Study Type Selection Modal */}
      <CreateExperimentModalForMoveMice
        isOpen={studyTypeModal.isOpen}
        onClose={handleCloseStudyTypeSelection}
        onStudyTypeSelected={handleStudyTypeSelected}
      />

      {/* Experiment Creation Form Modal */}
      {experimentFormModal.isOpen && projectId && selectedStudyTypeCode && (
        <CreateExperimentModal
          isOpen={experimentFormModal.isOpen}
          onClose={handleCloseExperimentForm}
          studyType={selectedStudyTypeCode}
          projectId={projectId}
          studyTypeId={selectedStudyTypeId}
          specialization={specialisation}
          onExperimentCreated={handleExperimentCreated}
          keepOpenAfterCreate={false}
        />
      )}

      <MouseGroupsOrderModal
        experimentId={selectedExperimentId || undefined}
        open={mouseGroupModal.isOpen}
        onClose={() => mouseGroupModal.closeModal()}
        onSuccess={() => {
          mouseGroupModal.closeModal();
        }}
      />
    </>
  );
}
