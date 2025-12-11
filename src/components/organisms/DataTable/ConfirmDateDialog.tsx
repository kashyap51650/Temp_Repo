import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";

interface ConfirmDateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingDate: Date | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDateDialog({
  open,
  onOpenChange,
  pendingDate,
  onConfirm,
  onCancel,
}: ConfirmDateDialogProps) {
  function formatDate(date: Date) {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Update Date?"
      description={
        pendingDate
          ? `Are you sure you want to update the date to ${formatDate(pendingDate)}?`
          : "Are you sure you want to update the date?"
      }
      trigger={null}
    >
      <div className="space-y-4 py-2 mt-4">
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onCancel}>
            No
          </Button>
          <Button onClick={onConfirm}>Yes</Button>
        </div>
      </div>
    </Dialog>
  );
}
