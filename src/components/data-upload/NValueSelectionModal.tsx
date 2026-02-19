import { useState } from "react";

import {
  Button,
  Dialog,
  Label,
  RadioGroup,
  RadioGroupItem,
} from "@/components/atoms";

interface NValueSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (nValue: number) => void;
  isUploading?: boolean;
}

export function NValueSelectionModal({
  isOpen,
  onClose,
  onProceed,
  isUploading,
}: Readonly<NValueSelectionModalProps>) {
  const [selectedNValue, setSelectedNValue] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<string | undefined>(undefined);

  const handleProceed = () => {
    if (!selectedNValue) {
      setError("Please select an N value to proceed");
      return;
    }
    setError(undefined);
    onProceed(Number(selectedNValue));
  };

  const handleClose = () => {
    setSelectedNValue(undefined);
    setError(undefined);
    onClose();
  };

  const handleValueChange = (value: string) => {
    setSelectedNValue(value);
    setError(undefined);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
      title="Select N Value"
      trigger={null}
      preventOutsideClose
    >
      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-700">
            Choose the N value (number of replicates) for this experiment data:
          </Label>

          <RadioGroup
            value={selectedNValue}
            onValueChange={handleValueChange}
            className="space-y-3"
          >
            {/* Option 1 */}
            <label
              htmlFor="nValue-1"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <RadioGroupItem value="1" id="nValue-1" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">N = 1</span>
              </div>
            </label>

            {/* Option 3 */}
            <label
              htmlFor="nValue-3"
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <RadioGroupItem value="3" id="nValue-3" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">N = 3</span>
              </div>
            </label>
          </RadioGroup>

          {error && (
            <p className="text-sm text-red-600 mt-2" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="ghost" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleProceed}
            disabled={isUploading}
          >
            {isUploading ? "Proceeding..." : "Proceed"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
