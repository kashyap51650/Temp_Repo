import { useCallback, useState } from "react";
import { toast } from "sonner";

import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { useBioDWeightSheetSave } from "@/hooks";
import type { StudyType } from "@/lib/constants";
import { getSheetDataTypePrefix } from "@/lib/utils";
import type { WorksheetEditData } from "@/types/weight-sheet";

import { Button } from "../atoms";
import { BioDWeightSheet } from "./BioDWeightSheet";

interface BioDWeightSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: WorksheetEditData[]) => void;
  experimentName: string;
  experimentDataId?: string;
  experimentStudyType: string;
}

export function BioDWeightSheetModal({
  isOpen,
  onClose,
  onSave,
  experimentName,
  experimentDataId,
  experimentStudyType,
}: Readonly<BioDWeightSheetModalProps>) {
  const [currentData, setCurrentData] = useState<WorksheetEditData[] | null>(
    null
  );
  const [originalData, setOriginalData] = useState<WorksheetEditData[] | null>(
    null
  );
  const { saveChanges, isPending } = useBioDWeightSheetSave();

  const handleDataChange = useCallback(
    (weightData: WorksheetEditData[]) => {
      setCurrentData(weightData);

      if (!originalData && weightData) {
        setOriginalData(structuredClone(weightData));
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
      title={`${getSheetDataTypePrefix(experimentStudyType as StudyType)} Weight Sheet - ${experimentName}`}
      description="Edit weight sheet data for the experiment"
      trigger={null}
      className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
    >
      <BioDWeightSheet
        onSave={handleDataChange}
        experimentDataId={experimentDataId}
        experimentStudyType={experimentStudyType}
      />
      <div className="mt-auto flex justify-end gap-3">
        <Button variant="outline" size={"lg"} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={"default"}
          size={"lg"}
          onClick={handleSave}
          disabled={isPending || !currentData || currentData?.length === 0}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Dialog>
  );
}
