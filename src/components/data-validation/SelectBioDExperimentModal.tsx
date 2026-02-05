import { Loader2, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/atoms/Button/Button";
import { Label } from "@/components/atoms/Label/Label";
import { CustomSelect } from "@/components/data-upload/CustomSelect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/Dialog/Dialog";
import { useExperimentsDropdown } from "@/hooks";
import { EXPERIMENT_STATUS } from "@/lib/constants";

interface SelectBioDExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceExperimentId: number;
  sourceProjectId: number;
  onProceed: (targetExperimentId: number) => void;
  onCreateNew: () => void;
  isProceedDisabled?: boolean;
  cellLineIds?: number[];
  mouseStrainIds?: number[];
}

export function SelectBioDExperimentModal({
  isOpen,
  onClose,
  sourceExperimentId,
  sourceProjectId,
  onProceed,
  onCreateNew,
  isProceedDisabled = false,
  cellLineIds = [],
  mouseStrainIds = [],
}: Readonly<SelectBioDExperimentModalProps>) {
  const [selectedExperimentId, setSelectedExperimentId] = useState<
    number | null
  >(null);

  // Fetch Bio Distribution experiments only with additional filters
  const { experiments, loading: experimentsLoading } = useExperimentsDropdown({
    filters: {
      project_id: sourceProjectId,
      study_type_id: 1, // Bio Distribution study type ID (adjust if different in your system)
      specialization: "PRECLINICAL",
      cell_line_id: cellLineIds.length > 0 ? cellLineIds : undefined,
      mouse_strain_id: mouseStrainIds.length > 0 ? mouseStrainIds : undefined,
      status: EXPERIMENT_STATUS.PLANNED,
    },
    enabled: isOpen,
  });

  // Filter out the source experiment
  const filteredExperiments = experiments.filter(
    (exp) => exp.id !== sourceExperimentId
  );

  const experimentOptions = filteredExperiments.map((exp) => ({
    value: exp.id.toString(),
    label: exp.experiment_name,
  }));

  const handleProceed = () => {
    if (selectedExperimentId) {
      onProceed(selectedExperimentId);
    }
  };

  const handleClose = () => {
    setSelectedExperimentId(null);
    onClose();
  };

  const handleCreateNew = () => {
    onCreateNew();
  };

  const renderExperimentSelection = () => {
    if (experimentsLoading) {
      return (
        <div className="flex items-center justify-center py-4">
          <div className="text-sm text-muted-foreground">
            Loading experiments...
          </div>
        </div>
      );
    }

    if (experimentOptions.length === 0) {
      return (
        <div className="p-4 border rounded-lg bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            No Bio Distribution experiments found
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateNew}
            className="gap-2"
            disabled={isProceedDisabled}
          >
            <Plus className="size-4" />
            Create New Experiment
          </Button>
        </div>
      );
    }

    return (
      <>
        <CustomSelect
          options={experimentOptions}
          placeholder="Select experiment..."
          value={selectedExperimentId?.toString() ?? ""}
          onValueChange={(value: string | string[]) => {
            const id = typeof value === "string" ? value : value[0];
            setSelectedExperimentId(id ? Number(id) : null);
          }}
          disabled={isProceedDisabled}
          className="w-full"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCreateNew}
          className="w-full gap-2 mt-2"
          disabled={isProceedDisabled}
        >
          <Plus className="size-4" />
          Create New Experiment
        </Button>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Perform BioD - Select Experiment
          </DialogTitle>
        </DialogHeader>

        {/* Loading Overlay */}
        {isProceedDisabled && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-foreground">
                Performing BioD...
              </p>
              <p className="text-xs text-muted-foreground">
                Please wait while we process your request
              </p>
            </div>
          </div>
        )}

        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Select an existing Bio Distribution experiment or create a new one
            to perform BioD analysis.
          </p>

          <div className="space-y-2">
            <Label htmlFor="experiment-select">
              Bio Distribution Experiment
            </Label>
            {renderExperimentSelection()}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="lg"
            onClick={handleClose}
            disabled={isProceedDisabled}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="lg"
            onClick={handleProceed}
            disabled={!selectedExperimentId || isProceedDisabled}
          >
            {isProceedDisabled ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Proceed"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
