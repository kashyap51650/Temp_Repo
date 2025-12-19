import { Dialog } from "@/components/atoms/Dialog/Dialog";
import type { CalliperingData } from "@/components/organisms/DataTable/tableData";

import { CalliperingSheetEdit } from "./CalliperingSheetEdit";

interface CalliperingSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CalliperingData) => void;
  experimentName: string;
  data?: CalliperingData;
  experimentDataId?: string;
}

export function CalliperingSheetModal({
  isOpen,
  onClose,
  onSave,
  experimentName,
  data,
  experimentDataId,
}: Readonly<CalliperingSheetModalProps>) {
  const handleSave = (sheetData: CalliperingData) => {
    onSave(sheetData);
    onClose();
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
        data={data}
        onSave={handleSave}
        onCancel={onClose}
        experimentDataId={experimentDataId}
      />
    </Dialog>
  );
}
