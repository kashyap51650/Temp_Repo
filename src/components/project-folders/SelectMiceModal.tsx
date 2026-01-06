import React, { useState } from "react";

import { Button, Checkbox, Dialog, Label } from "@/components/atoms";

interface Mouse {
  id: string;
  label: string;
}

interface SelectMiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (selectedMice: string[]) => void;
  mice: Mouse[];
}

export function SelectMiceModal({
  isOpen,
  onClose,
  onNext,
  mice,
}: SelectMiceModalProps) {
  const [selectedMice, setSelectedMice] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMice(mice.map((mouse) => mouse.id));
    } else {
      setSelectedMice([]);
    }
  };

  const handleMouseSelect = (mouseId: string, checked: boolean) => {
    if (checked) {
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

  const isAllSelected = selectedMice.length === mice.length && mice.length > 0;

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
      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between flex-col">
          <h2 className="text-xl font-semibold">Move Mice - Select Mice</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select mice to move to another experiment
          </p>
        </div>

        {/* Mice List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {/* Select All */}
          <div className="flex items-center space-x-2 py-2 border-b">
            <Checkbox
              id="select-all"
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor="select-all">Select All</Label>
          </div>

          {/* Individual Mice */}
          {mice.map((mouse) => (
            <div key={mouse.id} className="flex items-center space-x-2 py-1">
              <Checkbox
                id={mouse.id}
                checked={selectedMice.includes(mouse.id)}
                onCheckedChange={(checked) =>
                  handleMouseSelect(mouse.id, checked as boolean)
                }
              />
              <Label htmlFor={mouse.id}>{mouse.label}</Label>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedMice.length === 0}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
