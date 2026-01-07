import { useState } from "react";

import { Button, Dialog, Label } from "@/components/atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/Select";
import { studyTypes } from "@/data/mockData";

interface CreateExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateExperiment: (studyType: string) => void;
}

export function CreateExperimentModal({
  isOpen,
  onClose,
  onCreateExperiment,
}: CreateExperimentModalProps) {
  const [selectedStudyType, setSelectedStudyType] = useState<string>("");

  const handleCreate = () => {
    if (selectedStudyType) {
      onCreateExperiment(selectedStudyType);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedStudyType("");
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) handleClose();
      }}
      showClose={false}
      className="max-w-lg"
      trigger={null}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between flex-col">
          <h2 className="text-xl font-semibold">Create New Experiment</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select a study type to create a new experiment
          </p>
        </div>

        {/* Study Type Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Select Study Type</Label>

          <Select
            value={selectedStudyType}
            onValueChange={setSelectedStudyType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select study type" />
            </SelectTrigger>
            <SelectContent>
              {studyTypes.map((studyType) => (
                <SelectItem key={studyType.id} value={studyType.id}>
                  {studyType.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!selectedStudyType}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Create Experiment
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
