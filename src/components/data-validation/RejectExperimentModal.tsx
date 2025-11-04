import { useState } from "react";

import { Button } from "../atoms/Button/Button";
import { Dialog } from "../atoms/Dialog/Dialog";
import { Label } from "../atoms/Label/Label";
import { Textarea } from "../atoms/Textarea/Textarea";
import type { DataViewItem } from "../organisms/DataTable/tableData";

interface RejectExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
  item: DataViewItem | null;
}

export function RejectExperimentModal({
  isOpen,
  onClose,
  onReject,
  item,
}: RejectExperimentModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(rejectionReason);
      setRejectionReason("");
      onClose();
    }
  };

  const handleClose = () => {
    setRejectionReason("");
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) handleClose();
      }}
      title="Reject Experiment"
      description={
        item ? `Please provide a reason for rejecting "${item.name}"` : ""
      }
      showClose={true}
      className="max-w-lg"
      trigger={null}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="rejection-reason" className="text-sm font-medium">
            Reason for Rejection <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="rejection-reason"
            placeholder="Enter detailed reason for rejection..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="mt-2 min-h-28 resize-none"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={handleClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            disabled={!rejectionReason.trim()}
            variant={"danger"}
          >
            Submit Rejection
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
