import { Dialog } from "@/components/atoms/Dialog/Dialog";
import type { CalliperingData } from "@/components/organisms/DataTable/tableData";

import { Button } from "../atoms";
import { CalliperingSheetView } from "./CalliperingSheetView";

interface CalliperingSheetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
  data?: CalliperingData;
  experimentDataId?: string;
}

export function CalliperingSheetViewModal({
  isOpen,
  onClose,
  experimentName,
  data,
  experimentDataId,
}: Readonly<CalliperingSheetViewModalProps>) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
      title={`Callipering Sheet - ${experimentName}`}
      description="View callipering data for the experiment"
      trigger={null}
      className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
    >
      <CalliperingSheetView data={data} experimentDataId={experimentDataId} />
      <div className="my-4 flex justify-end gap-3">
        <Button variant="outline" size={"lg"} onClick={onClose}>
          Close
        </Button>
      </div>
    </Dialog>
  );
}
