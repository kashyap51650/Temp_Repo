import { Dialog } from "@/components/atoms/Dialog/Dialog";

interface AGCSheetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AGCSheetViewModal({
  isOpen,
  onClose,
}: Readonly<AGCSheetViewModalProps>) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
      title={
        <div className="flex items-center justify-between w-full pr-8">
          <div className="flex gap-4 mb-2 items-center">
            <div>
              <h2 className="text-xl font-semibold">AGC Sheet</h2>
              <p className="text-sm text-muted-foreground mt-1">
                View AGC sheet data for the experiment
              </p>
            </div>
          </div>
        </div>
      }
      trigger={null}
      className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
    >
      {/* Modal content goes here */}
      <div className="flex-grow p-6 overflow-auto">
        <p>AGC Sheet data content will be displayed here.</p>
      </div>
    </Dialog>
  );
}
