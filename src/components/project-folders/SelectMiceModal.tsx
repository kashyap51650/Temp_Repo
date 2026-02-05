import { useEffect, useState } from "react";

import { Button, Checkbox, Dialog, Label } from "@/components/atoms";
import { useGetMiceFromExperiment } from "@/hooks/useMoveMice";

interface SelectMiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (selectedMice: string[]) => void;
  sourceExperimentId: number;
}

export function SelectMiceModal({
  isOpen,
  onClose,
  onNext,
  sourceExperimentId,
}: Readonly<SelectMiceModalProps>) {
  const [selectedMice, setSelectedMice] = useState<string[]>([]);

  const {
    data: mice,
    isLoading,
    error,
  } = useGetMiceFromExperiment(sourceExperimentId, isOpen);

  useEffect(() => {
    if (isOpen) {
      setSelectedMice([]);
    }
  }, [isOpen]);

  const handleSelectAll = ({ isChecked }: { isChecked: boolean }) => {
    if (isChecked && mice) {
      setSelectedMice(mice.map((mouse) => mouse.id));
    } else {
      setSelectedMice([]);
    }
  };

  const handleMouseSelect = ({
    mouseId,
    isChecked,
  }: {
    mouseId: string;
    isChecked: boolean;
  }) => {
    if (isChecked) {
      setSelectedMice((prev) => [...prev, mouseId]);
    } else {
      setSelectedMice((prev) => prev.filter((id) => id !== mouseId));
    }
  };

  const handleNext = () => {
    if (selectedMice.length > 0) {
      onNext(selectedMice);
    }
  };

  const handleClose = () => {
    setSelectedMice([]);
    onClose();
  };

  const isAllSelected =
    mice && selectedMice.length === mice.length && mice.length > 0;

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
      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between flex-col">
          <h2 className="text-xl font-semibold">Move Mice - Select Mice</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select mice to move to another experiment
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8 text-muted-foreground">
            Loading mice data...
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-4 text-destructive">
            Failed to load mice:{" "}
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </div>
        )}

        {/* Mice List */}
        {!isLoading && !error && mice && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {/* Select All */}
            <div className="flex items-center space-x-2 py-2 border-b">
              <Checkbox
                id="select-all"
                checked={isAllSelected}
                onCheckedChange={(checked: boolean) =>
                  handleSelectAll({ isChecked: checked })
                }
                disabled={mice.length === 0}
              />
              <Label htmlFor="select-all">Select All</Label>
            </div>

            {/* Empty State */}
            {mice.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No mice available to move
              </div>
            )}

            {/* Individual Mice */}
            {mice.map((mouse) => (
              <div key={mouse.id} className="flex items-center space-x-2 py-1">
                <Checkbox
                  id={mouse.id}
                  checked={selectedMice.includes(mouse.id)}
                  onCheckedChange={(checked: boolean) =>
                    handleMouseSelect({
                      mouseId: mouse.id,
                      isChecked: checked,
                    })
                  }
                />
                <Label htmlFor={mouse.id}>{mouse.label}</Label>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedMice.length === 0 || isLoading}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
