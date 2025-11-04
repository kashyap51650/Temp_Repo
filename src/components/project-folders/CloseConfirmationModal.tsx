import { Button, Dialog } from "../atoms";

interface CloseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: "project" | "experiment";
  itemName: string;
}

export function CloseConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  itemName,
}: CloseConfirmationModalProps) {
  const title = type === "project" ? "Close Project" : "Close Experiment";
  const message = `Are you sure you want to close ${itemName}? This action cannot be undone.`;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
      title={title}
      showClose={true}
      className="max-w-lg"
      trigger={null}
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">{message}</p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" size="lg" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="lg" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
