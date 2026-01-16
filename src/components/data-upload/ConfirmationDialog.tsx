import { AlertTriangle } from "lucide-react";

import { Button, Dialog } from "../atoms";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "warning" | "danger";
}

export function ConfirmationDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
}: Readonly<ConfirmationDialogProps>) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onCancel();
      }}
      title={null}
      description={null}
      showClose={true}
      className="max-w-md"
      trigger={null}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-full flex items-center justify-center ${
            variant === "danger"
              ? "bg-red-100 text-red-600"
              : "bg-orange-100 text-orange-600"
          }`}
        >
          <AlertTriangle className="size-7" />
        </div>
        <div className="flex flex-col flex-1">
          <span className="text-lg font-semibold text-foreground mb-2">
            {title}
          </span>
          <span className="text-sm text-muted-foreground leading-relaxed mb-4">
            {message}
          </span>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size={"default"} onClick={onCancel}>
              {cancelText}
            </Button>
            <Button onClick={onConfirm} size={"default"} variant={"danger"}>
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
