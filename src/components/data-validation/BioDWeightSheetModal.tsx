import { useState } from "react";
import { toast } from "sonner";

import { Dialog } from "@/components/atoms/Dialog/Dialog";
import type { BioDWeightData } from "@/components/organisms/DataTable/tableData";
import { useBioDWeightSheetSave } from "@/hooks";

import { Button } from "../atoms";
import { BioDWeightSheet } from "./BioDWeightSheet";

interface BioDWeightSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BioDWeightData) => void;
  experimentName: string;
  experimentDataId?: string;
  data?: BioDWeightData;
}

export function BioDWeightSheetModal({
  isOpen,
  onClose,
  onSave,
  experimentName,
  experimentDataId,
  data,
}: Readonly<BioDWeightSheetModalProps>) {
  const [currentData, setCurrentData] = useState<BioDWeightData | null>(null);
  const [originalData, setOriginalData] = useState<BioDWeightData | null>(null);
  const { saveChanges, isPending } = useBioDWeightSheetSave();

  const handleDataChange = (weightData: BioDWeightData) => {
    setCurrentData(weightData);

    if (!originalData && weightData.mice.length > 0) {
      setOriginalData(structuredClone(weightData));
    }
  };

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
      title={`BioD Weight Sheet - ${experimentName}`}
      description="Edit weight sheet data for the experiment"
      trigger={null}
      className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
    >
      <BioDWeightSheet
        data={data}
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
