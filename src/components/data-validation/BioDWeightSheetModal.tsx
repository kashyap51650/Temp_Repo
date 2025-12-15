import { Dialog } from "@/components/atoms/Dialog/Dialog";
import type { BioDWeightData } from "@/components/organisms/DataTable/tableData";

import { Button } from "../atoms";
import { BioDWeightSheet } from "./BioDWeightSheet";

interface BioDWeightSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BioDWeightData) => void;
  experimentName: string;
  data?: BioDWeightData;
}

export function BioDWeightSheetModal({
  isOpen,
  onClose,
  onSave,
  experimentName,
  data,
}: BioDWeightSheetModalProps) {
  const handleSave = (weightData: BioDWeightData) => {
    onSave(weightData);
    onClose();
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
      <BioDWeightSheet data={data} onSave={handleSave} />
      <div className="mt-auto flex justify-end gap-3">
        <Button variant="outline" size={"lg"} onClick={onClose}>
          Cancel
        </Button>
        <Button variant={"default"} size={"lg"}>
          Save Changes
        </Button>
      </div>
    </Dialog>
  );
}
