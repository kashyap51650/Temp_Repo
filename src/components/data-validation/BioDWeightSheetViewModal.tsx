import { Dialog } from "@/components/atoms/Dialog/Dialog";
import type { BioDWeightData } from "@/components/organisms/DataTable/tableData";

import { Button } from "../atoms";
import { BioDWeightSheetView } from "./BioDWeightSheetView";

interface BioDWeightSheetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
  data?: BioDWeightData;
}

export function BioDWeightSheetViewModal({
  isOpen,
  onClose,
  experimentName,
  data,
}: BioDWeightSheetViewModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
      title={`BioD Weight Sheet - ${experimentName}`}
      description="View weight sheet data for the experiment"
      trigger={null}
      className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
    >
      <BioDWeightSheetView data={data} />
      <div className="mt-auto flex justify-end ">
        <Button size={"lg"} onClick={onClose}>
          Close
        </Button>
      </div>
    </Dialog>
  );
}
