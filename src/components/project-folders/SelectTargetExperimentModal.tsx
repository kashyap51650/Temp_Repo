import { useState } from "react";

import type { StudyType } from "@/api";
import { Button, Dialog, Label } from "@/components/atoms";
import { SPECIALIZATION } from "@/lib";

import { ExperimentSelect } from "../atoms/Selects";
import { StudyTypeDropdown } from "../data-upload/StudyTypeDropdown";

type Experiment = {
  id: string;
  name: string;
  cellLines: string[];
  isotope: string;
  projectId?: string;
  studyType?: string;
};

interface SelectTargetExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (targetExperimentId: string) => void;
  onCreateNew: () => void;
  selectedMiceCount: number;
  experiments: Experiment[];
  isLoading?: boolean;
  isCheckingSlots?: boolean;
  isMoving?: boolean;
  selectedExperimentId: string;
  onExperimentIdChange: (id: string) => void;
  onStudyTypeChange?: (studyType: StudyType | undefined) => void;
  selectedStudyTypeId?: number;
}

export function SelectTargetExperimentModal({
  isOpen,
  onClose,
  onMove,
  onCreateNew,
  selectedMiceCount,
  experiments,
  isLoading = false,
  isCheckingSlots = false,
  isMoving = false,
  selectedExperimentId,
  onExperimentIdChange,
  onStudyTypeChange,
  selectedStudyTypeId,
}: Readonly<SelectTargetExperimentModalProps>) {
  const [selectedStudyType, setSelectedStudyType] = useState<string>("");

  const handleMove = () => {
    if (selectedExperimentId) {
      onMove(selectedExperimentId);
    }
  };

  const handleClose = () => {
    setSelectedStudyType("");
    onStudyTypeChange?.(undefined);
    onClose();
  };

  const handleCreateNewExperiment = () => {
    onCreateNew();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) handleClose();
      }}
      showClose={false}
      className="max-w-md"
      trigger={null}
    >
      <div className="space-y-6">
        <div className="flex flex-col justify-between">
          <h2 className="text-xl font-semibold">
            Move Mice - Select Target Experiment
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Moving {selectedMiceCount} selected mice
          </p>
        </div>

        <StudyTypeDropdown
          value={selectedStudyType}
          onValueChange={(value, studyType) => {
            setSelectedStudyType(value);
            onStudyTypeChange?.(studyType);
            onExperimentIdChange("");
          }}
          disabled={false}
          specialization={SPECIALIZATION.PRECLINICAL}
        />

        {/* Target Experiment Selection */}
        <div className="space-y-3">
          <Label htmlFor="exp" className="text-sm font-medium">
            Target Experiment
          </Label>

          <ExperimentSelect
            experiments={experiments}
            value={selectedExperimentId}
            placeholder={
              !selectedStudyTypeId
                ? "Please select a study type first"
                : isCheckingSlots
                  ? "Checking group slots..."
                  : isLoading
                    ? "Loading experiments..."
                    : "Select experiment..."
            }
            onValueChange={(value) => {
              onExperimentIdChange(value);
            }}
            onCreateNew={handleCreateNewExperiment}
            className="w-full"
            showSearch={true}
            disabled={!selectedStudyTypeId || isLoading || isCheckingSlots}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading || isMoving || isCheckingSlots}
          >
            Cancel
          </Button>
          <Button
            onClick={handleMove}
            disabled={
              !selectedExperimentId || isLoading || isMoving || isCheckingSlots
            }
          >
            {isMoving ? "Moving..." : "Move"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
