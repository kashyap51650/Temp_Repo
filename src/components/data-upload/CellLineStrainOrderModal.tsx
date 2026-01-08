import type { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { useState } from "react";

import { Button } from "@/components/atoms/Button/Button";

import { Dialog } from "../atoms/Dialog/Dialog";
import { DialogFooter } from "../molecules";
import { SortableItem } from "./SortableItem";

interface CellLineStrainOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export const CellLineStrainOrderModal: React.FC<
  CellLineStrainOrderModalProps
> = ({ open, onClose }) => {
  const staticGroups = [
    { id: "group-1", groupName: "D367NFHYR" },
    { id: "group-2", groupName: "A123XYZ" },
    { id: "group-3", groupName: "B456LMN" },
  ];
  const [items, setItems] = useState(staticGroups);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id);
        const newIndex = prev.findIndex((i) => i.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Group Assignment"
      description="Drag and drop the Cell Line & Strain pairs to reorder groups."
      showClose={true}
      className="max-w-lg"
      trigger={null}
    >
      <div className="flex flex-col gap-4 mt-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul className="flex flex-col gap-4">
              {items.length === 0 && (
                <li className="text-muted-foreground text-sm">
                  No groups to display.
                </li>
              )}
              {items.map((item, idx) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  index={idx}
                  groupName={item.groupName}
                  onRemove={handleRemove}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Save Order</Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
};
