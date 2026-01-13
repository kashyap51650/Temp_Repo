import { Check, Edit, XIcon } from "lucide-react";

import { Button } from "../atoms";

interface SheetActionsProps {
  /** Show / hide edit button */
  showEdit?: boolean;
  /** Show / hide approve button */
  showApprove?: boolean;
  /** Show / hide reject button */
  showReject?: boolean;

  /** Action handlers */
  onEdit?: () => void;
  onApprove?: () => void;
  onReject?: () => void;

  /** Loading / disabled states */
  isApproveLoading?: boolean;
  isRejectLoading?: boolean;
}

export function SheetActions({
  showEdit = true,
  showApprove = true,
  showReject = true,
  onEdit,
  onApprove,
  onReject,
  isApproveLoading = false,
  isRejectLoading = false,
}: SheetActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {showEdit && (
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex items-center gap-2"
        >
          <Edit className="size-4" />
          Edit
        </Button>
      )}

      {showApprove && (
        <Button
          variant="outline"
          size="sm"
          onClick={onApprove}
          className="flex items-center gap-2 text-green-700 hover:bg-green-50 hover:text-green-800"
          disabled={isApproveLoading}
        >
          <Check className="size-4" />
          Approve
        </Button>
      )}

      {showReject && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReject}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
          disabled={isRejectLoading}
        >
          <XIcon className="size-4" />
          Reject
        </Button>
      )}
    </div>
  );
}
