import { Button } from "../atoms";
import { Dialog } from "../atoms/Dialog/Dialog";
import { BioDOrganTable } from "../organisms/DataTable/BioDOrganTable";
import { bioDOrganData } from "../organisms/DataTable/tableData";

interface BioDOrganViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
}

export function BioDOrganViewModal({
  isOpen,
  onClose,
}: BioDOrganViewModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
      title={`BioD Organ Data - View Only`}
      showClose={true}
      className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
      trigger={null}
    >
      <div className="flex-1 overflow-auto mt-4">
        <BioDOrganTable data={bioDOrganData} editable={false} />
      </div>
      <div className="flex justify-end gap-3 border-t pt-4">
        <Button variant="outline" size={"lg"} onClick={onClose}>
          Close
        </Button>
      </div>
    </Dialog>
  );
}
