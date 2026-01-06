import React, { useState } from "react";

import { Button, Dialog, Label } from "@/components/atoms";
import { ExperimentSelect } from "@/components/atoms/Selects";

import { CreateExperimentModal } from "./CreateExperimentModal";

type Experiment = {
  id: string;
  name: string;
  cellLines: string[];
  isotope: string;
  projectId: string;
  studyType: string;
};

interface SelectTargetExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: (targetExperimentId: string) => void;
  selectedMiceCount: number;
  experiments: Experiment[];
}

export function SelectTargetExperimentModal({
  isOpen,
  onClose,
  onMove,
  selectedMiceCount,
  experiments,
}: SelectTargetExperimentModalProps) {
  const [selectedExperimentId, setSelectedExperimentId] = useState<string>("");
  const [isCreateExperimentModalOpen, setIsCreateExperimentModalOpen] =
    useState(false);

  const handleMove = () => {
    if (selectedExperimentId) {
      onMove(selectedExperimentId);
    }
  };

  const handleClose = () => {
    setSelectedExperimentId("");
    onClose();
  };

  const handleCreateNewExperiment = () => {
    setIsCreateExperimentModalOpen(true);
  };

  const handleExperimentCreated = (studyType: string) => {
    console.log("Creating new experiment with study type:", studyType);
    // Handle create experiment logic here - you would typically make an API call
    // and then refresh the experiments list or add the new experiment to the list
    setIsCreateExperimentModalOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) handleClose();
      }}
      title=""
      showClose={false}
      className="max-w-md"
      trigger={null}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between">
          <h2 className="text-xl font-semibold">
            Move Mice - Select Target Experiment
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Moving {selectedMiceCount} selected mice
          </p>
        </div>

        {/* Target Experiment Selection */}
        <div className="space-y-3">
          <Label htmlFor="exp" className="text-sm font-medium">
            Target Experiment
          </Label>

          <ExperimentSelect
            experiments={experiments}
            value={selectedExperimentId}
            placeholder="Search or select experiment..."
            onValueChange={setSelectedExperimentId}
            onCreateNew={handleCreateNewExperiment}
            className="w-full"
            showSearch={true}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleMove}
            disabled={!selectedExperimentId}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Move
          </Button>
        </div>
      </div>

      {/* Create Experiment Modal */}
      <CreateExperimentModal
        isOpen={isCreateExperimentModalOpen}
        onClose={() => setIsCreateExperimentModalOpen(false)}
        onCreateExperiment={handleExperimentCreated}
      />
    </Dialog>
  );
}
