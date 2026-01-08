import { GripVertical, Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/components/atoms/Button/Button";

import { Dialog } from "../atoms/Dialog/Dialog";
import { DialogFooter } from "../molecules";

interface CellLineStrainOrderModalProps {
  open: boolean;
  onClose: () => void;
  items: { id: string; cellLine: string; strain: string }[];
  onSave: () => void;
}

export const CellLineStrainOrderModal: React.FC<
  CellLineStrainOrderModalProps
> = ({ open, onClose, items, onSave }) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Review Your Selection"
      description="Drag items to reorder. The order will be preserved."
      showClose={true}
      className="max-w-lg"
      trigger={null}
    >
      <div className="flex flex-col gap-4 mt-4">
        <ul className="flex flex-col gap-4">
          {items.length === 0 && (
            <li className="text-muted-foreground text-sm">
              No cell lines to display.
            </li>
          )}
          {items.map((item, idx) => (
            <li
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg border bg-card border-border hover:border-muted-foreground/30"
            >
              <span className="flex items-center justify-center mr-2 cursor-grab">
                <GripVertical className="size-5 text-muted-foreground" />
              </span>
              <span className="flex items-center justify-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                {idx + 1}
              </span>
              <div className="flex-1 grid grid-cols-2 gap-4 ml-5">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium mb-1">
                    Group Name
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    D367NFHYR
                  </span>
                </div>
              </div>
              <Button
                variant={"ghost"}
                size="icon"
                className="ml-auto p-2"
                aria-label="Remove cell line/strain pair"
              >
                <Trash2 className="text-red-400" />
              </Button>
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Order</Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
};
