import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { useCalliperingSheetSave } from "@/hooks/useCalliperingSheetSave";
import type { CalliperingWorksheetEditData } from "@/types/callipering-sheet";

import { Button } from "../atoms";
import { CalliperingSheetEdit } from "./CalliperingSheetEdit";

interface CalliperingSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CalliperingWorksheetEditData[]) => void;
  experimentName: string;
  experimentDataId?: string;
}

export function CalliperingSheetModal({
  isOpen,
  onClose,
  onSave,
  experimentName,
  experimentDataId,
}: Readonly<CalliperingSheetModalProps>) {
  const [currentData, setCurrentData] = useState<
    CalliperingWorksheetEditData[] | null
  >(null);
  const [originalData, setOriginalData] = useState<
    CalliperingWorksheetEditData[] | null
  >(null);
  const { saveChanges, isPending } = useCalliperingSheetSave();

  const handleDataChange = useCallback(
    (worksheetData: CalliperingWorksheetEditData[]) => {
      setCurrentData(worksheetData);

      if (!originalData && worksheetData) {
        setOriginalData(structuredClone(worksheetData));
      }
    },
    [originalData]
  );

  const handleSave = () => {
    if (!currentData) {
      toast.error("No data to save.");
      return;
    }

    saveChanges({
      currentData,
      originalData,
      experimentDataId,
      onSuccess: () => {
        onSave(currentData);
        onClose();
      },
      onClose,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
      title={`Callipering Sheet - ${experimentName}`}
      description="Edit callipering data for the experiment"
      trigger={null}
      className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
    >
      <CalliperingSheetEdit
        onSave={handleDataChange}
        experimentDataId={experimentDataId}
      />
      <div className="mt-auto flex justify-end gap-3">
        <Button variant="outline" size={"lg"} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={"default"}
          size={"lg"}
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Dialog>
  );
}
