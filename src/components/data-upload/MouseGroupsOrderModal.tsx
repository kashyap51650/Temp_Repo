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
import React, { useEffect, useState } from "react";

import { Button } from "@/components/atoms/Button/Button";
import useConfirmExperimentMouseGroups from "@/hooks/useConfirmExperimentMouseGroups";
import useExperimentMouseGroups from "@/hooks/useExperimentMouseGroups";
import type { ExperimentMouseGroupsWithDragIdType } from "@/types/modelStudy";

import { Dialog } from "../atoms/Dialog/Dialog";
import { DialogFooter } from "../molecules";
import { SortableItem } from "./SortableItem";

interface MouseGroupsOrderModalProps {
  experimentId: number | undefined;
  open: boolean;
  onClose: () => void;
  onSave?: (groups: ExperimentMouseGroupsWithDragIdType[]) => void;
  onSuccess?: () => void;
  onGroupingSaved?: () => void;
}

export const MouseGroupsOrderModal: React.FC<MouseGroupsOrderModalProps> = ({
  open,
  onClose,
  experimentId,
  onSave,
  onSuccess,
  onGroupingSaved,
}) => {
  const [items, setItems] = useState<ExperimentMouseGroupsWithDragIdType[]>([]);
  const { mutationFn, mouseGroupData, isLoading, error } =
    useExperimentMouseGroups();
  const { createMouseGroups, isCreating } = useConfirmExperimentMouseGroups({
    onSuccess: () => {
      onSuccess?.();
      onGroupingSaved?.();
    },
  });

  useEffect(() => {
    if (open && experimentId) {
      mutationFn({
        experiment_id: experimentId,
      });
    }
  }, [open, experimentId]);

  useEffect(() => {
    if (open && mouseGroupData && mouseGroupData.length > 0) {
      setItems(mouseGroupData);
    }
  }, [open, mouseGroupData]);

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
        const oldIndex = prev.findIndex((i) => i.dragId === active.id);
        const newIndex = prev.findIndex((i) => i.dragId === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.dragId !== id));
  };

  const handleSave = () => {
    if (!experimentId) return;

    const groupIds = items.map((group) => group.group_id);
    createMouseGroups({
      experiment_id: experimentId,
      group_ids: groupIds,
    });
    onSave?.(items);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-4">
          <div className="h-12 bg-muted animate-pulse rounded-md" />
          <div className="h-12 bg-muted animate-pulse rounded-md" />
          <div className="h-12 bg-muted animate-pulse rounded-md" />
          <p className="text-sm text-muted-foreground text-center">
            Loading groups...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center gap-2 py-8">
          <p className="text-destructive font-medium">Error loading groups</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      );
    }

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.dragId)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2">
            {items.length === 0 && (
              <li className="text-muted-foreground text-sm">
                No groups to display.
              </li>
            )}
            {items.map((item, idx) => (
              <SortableItem
                key={item.dragId}
                id={item.dragId}
                index={idx}
                groupName={item.group_name}
                onRemove={handleRemove}
                disableDelete={items.length === 1}
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    );
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
      preventOutsideClose={isLoading}
    >
      <div className="flex flex-col gap-4 mt-4">
        {renderContent()}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isCreating || isLoading || !!error || items.length === 0}
          >
            {isCreating ? "Saving..." : "Save Groups"}
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
};
