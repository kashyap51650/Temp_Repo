import { AlertTriangle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/atoms/Button/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/Dialog/Dialog";
import { type MasterDataItem } from "@/components/organisms/DataTable/tableData";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  item: MasterDataItem | null;
  itemLabel: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  item,
  itemLabel,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setLoading(false);
    }
  };

  const getItemDisplayName = (item: MasterDataItem | null): string => {
    if (!item) return "";

    const nameFields = [
      "isotopeName",
      "organName",
      "cellLineName",
      "doseName",
      "vehicleName",
      "name",
    ];

    for (const field of nameFields) {
      if (field in item && item[field as keyof MasterDataItem]) {
        return item[field as keyof MasterDataItem] as string;
      }
    }

    return item.id;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-destructive" />
            Confirm Deletion
          </DialogTitle>
        </DialogHeader>

        <div className="py-1">
          <p className="text-base text-muted-foreground">
            Are you sure you want to delete this {itemLabel.toLowerCase()}?
          </p>

          {item && (
            <div className="mt-3 p-3 bg-muted rounded-md">
              <p className="font-medium">{getItemDisplayName(item)}</p>
              <p className="text-sm text-muted-foreground mt-1">
                This action cannot be undone. The record will be marked as
                inactive.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size={"lg"}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size={"lg"}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
