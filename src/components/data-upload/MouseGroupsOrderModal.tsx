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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import useConfirmExperimentMouseGroups from "@/hooks/useConfirmExperimentMouseGroups";
import useExperimentMouseGroups from "@/hooks/useExperimentMouseGroups";
import {
  ModelStudyGroupOrderSchema,
  type ModelStudyGroupOrderSchemaData,
} from "@/lib/mouseGroupOrderValidation";
import type { ExperimentMouseGroupsWithDragIdType } from "@/types/modelStudy";

import { Label } from "../atoms";
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
  const { mutationFn, mouseGroupData, isLoading, error } =
    useExperimentMouseGroups();
  const { createMouseGroups, isCreating } = useConfirmExperimentMouseGroups({
    onSuccess: () => {
      onSuccess?.();
      onGroupingSaved?.();
    },
  });

  const {
    control,
    register,
    reset: resetForm,
    getValues,
    formState: { errors: formErrors, isValid: formIsValid },
  } = useForm<ModelStudyGroupOrderSchemaData>({
    resolver: zodResolver(ModelStudyGroupOrderSchema),
    mode: "onChange",
    defaultValues: { groups: [] },
  });

  const {
    fields,
    move: moveField,
    remove: removeField,
  } = useFieldArray({
    control,
    name: "groups",
  });

  useEffect(() => {
    if (open && experimentId) {
      mutationFn({ experiment_id: experimentId });
    }
  }, [open, experimentId, mutationFn]);

  useEffect(() => {
    if (open && mouseGroupData?.length) {
      resetForm({
        groups: mouseGroupData.map((group) => ({
          dragId: group.dragId,
          groupId: group.group_id,
          groupName: group.group_name,
          slotSize: group.no_of_mice ?? 0,
        })),
      });
    }
  }, [open, mouseGroupData, resetForm]);

  useEffect(() => {
    if (!open) resetForm({ groups: [] });
  }, [open, resetForm]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = fields.findIndex((group) => group.dragId === active.id);
      const newIndex = fields.findIndex((group) => group.dragId === over.id);
      if (oldIndex !== -1 && newIndex !== -1) moveField(oldIndex, newIndex);
    }
  };

  const handleRemove = (id: number) => {
    const index = fields.findIndex((group) => group.dragId === id);
    if (index !== -1) removeField(index);
  };

  const handleSave = () => {
    if (!experimentId) return;
    const currentGroups = getValues("groups");
    createMouseGroups({
      experiment_id: experimentId,
      group_ids: fields.map((group) => group.groupId),
      no_of_mice_per_group: currentGroups.map((group) => ({
        group_id: group.groupId,
        no_of_mice: group.slotSize,
      })),
    });
    const itemsWithSlotSizes: ExperimentMouseGroupsWithDragIdType[] =
      currentGroups.map((formGroup) => ({
        ...(mouseGroupData.find(
          (group) => group.group_id === formGroup.groupId
        ) ?? ({} as ExperimentMouseGroupsWithDragIdType)),
        no_of_mice: formGroup.slotSize,
      }));
    onSave?.(itemsWithSlotSizes);
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
          items={fields.map((field) => field.dragId)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2">
            {fields.length === 0 && (
              <li className="text-muted-foreground text-sm">
                No groups to display.
              </li>
            )}
            {fields.map((field, idx) => (
              <SortableItem
                key={field.id}
                id={field.dragId}
                index={idx}
                groupName={field.groupName}
                onRemove={handleRemove}
                disableDelete={fields.length === 1}
                slotSizeInput={
                  <>
                    <Label
                      className="text-xs text-muted-foreground font-medium"
                      htmlFor={`slot-size-${idx}`}
                    >
                      Slot Size
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min={1}
                        id={`slot-size-${idx}`}
                        {...register(`groups.${idx}.slotSize`, {
                          valueAsNumber: true,
                        })}
                        className={`w-24 h-8 text-sm ${
                          formErrors.groups?.[idx]?.slotSize
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }`}
                      />
                      {formErrors.groups?.[idx]?.slotSize?.message && (
                        <p className="absolute top-full left-1/2 -translate-x-1/2 w-48 z-10 text-xs text-destructive pt-0.5 text-center break-words">
                          {formErrors.groups?.[idx]?.slotSize?.message ?? ""}
                        </p>
                      )}
                    </div>
                  </>
                }
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
            disabled={
              isCreating ||
              isLoading ||
              !!error ||
              !formIsValid ||
              fields.length === 0
            }
          >
            {isCreating ? "Saving..." : "Save Groups"}
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
};
