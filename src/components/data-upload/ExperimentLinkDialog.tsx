import React from "react";

import { Button, Input } from "@/components/atoms";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Label } from "@/components/atoms/Label/Label";
import { ExperimentSelect } from "@/components/atoms/Selects";

import { CustomSelect } from "./CustomSelect";

interface ExperimentLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingExperiments: any[];
  projectId: string | null;
  onSubmit: (
    linkToExisting: boolean,
    experimentId?: string,
    newExperimentName?: string
  ) => void;
}

export function ExperimentLinkDialog({
  open,
  onOpenChange,
  existingExperiments,
  projectId,
  onSubmit,
}: ExperimentLinkDialogProps) {
  const [linkChoice, setLinkChoice] = React.useState<string>("Yes");
  const [selectedExperimentId, setSelectedExperimentId] =
    React.useState<string>("");
  const [newExperimentName, setNewExperimentName] = React.useState<string>("");

  const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const handleSubmit = () => {
    if (linkChoice === "Yes") {
      onSubmit(true, selectedExperimentId);
    } else {
      onSubmit(false, undefined, newExperimentName);
    }
  };

  const handleCancel = () => {
    setLinkChoice("Yes");
    setSelectedExperimentId("");
    setNewExperimentName("");
    onOpenChange(false);
  };

  const isSubmitDisabled =
    linkChoice === "Yes" ? !selectedExperimentId : !newExperimentName.trim();

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Experiment Linkage"
      trigger={null}
      className="max-w-lg"
    >
      <div className="space-y-6 mt-5">
        <div className="space-y-2">
          <Label>
            Does uploaded file links with any preclinical experiment?
          </Label>
          <CustomSelect
            options={yesNoOptions}
            placeholder="Select option"
            value={linkChoice}
            onValueChange={(value) => {
              const selectedValue =
                typeof value === "string" ? value : value[0];
              setLinkChoice(selectedValue);
              setSelectedExperimentId("");
              setNewExperimentName("");
            }}
            className="w-full"
          />
        </div>

        {linkChoice === "Yes" && (
          <div className="space-y-2">
            <Label>Select Experiment</Label>
            <ExperimentSelect
              experiments={existingExperiments.filter(
                (e: any) => e.projectId === projectId
              )}
              value={selectedExperimentId}
              onValueChange={setSelectedExperimentId}
              className="w-full"
            />
          </div>
        )}

        {linkChoice === "No" && (
          <div className="space-y-2">
            <Label>Create New Experiment</Label>
            <Input
              size="lg"
              placeholder="Enter experiment name"
              value={newExperimentName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewExperimentName(e.target.value)
              }
              className="w-full"
            />
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button variant="outline" size={"lg"} onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            size={"lg"}
            disabled={isSubmitDisabled}
          >
            Submit
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
