import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";
import { useMouseGroupsByExperiment } from "@/hooks";
import { useUpdateMouseGroupNoOfMice } from "@/hooks/useUpdateMouseGroupNoOfMice";
import {
  buildSlotSizeSchema,
  type SlotSizeFormValues,
} from "@/lib/fillMouseGroupsValidation";

interface UpdateSlotSizeOfMouseGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOk: () => void;
  experimentId: number | undefined;
  totalMiceCount: number;
}

export function UpdateSlotSizeOfMouseGroupsModal({
  isOpen,
  onClose,
  onOk,
  experimentId,
  totalMiceCount,
}: Readonly<UpdateSlotSizeOfMouseGroupsModalProps>) {
  const updateMutation = useUpdateMouseGroupNoOfMice();
  const savedValuesRef = useRef<Record<number, number>>({});

  const schema = useMemo(
    () => buildSlotSizeSchema(totalMiceCount),
    [totalMiceCount]
  );

  const {
    mouseGroups: groups,
    isLoading,
    error,
  } = useMouseGroupsByExperiment(isOpen ? experimentId : undefined);

  const {
    control,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<SlotSizeFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { groups: [] },
  });

  const { fields } = useFieldArray({ control, name: "groups" });

  const watchedGroups = useWatch({ control, name: "groups", defaultValue: [] });

  useEffect(() => {
    if (groups) {
      const initial: Record<number, number> = {};
      groups.forEach((g) => {
        initial[g.id] = g.slotSize;
      });
      savedValuesRef.current = initial;
      reset({
        groups: groups.map((group) => ({
          groupId: group.id,
          slotSize: group.slotSize,
        })),
      });
    }
  }, [groups, reset]);

  useEffect(() => {
    if (!isOpen) {
      reset({ groups: [] });
      savedValuesRef.current = {};
    }
  }, [isOpen, reset]);

  const currentSum = Array.isArray(watchedGroups)
    ? watchedGroups.reduce((acc, g) => acc + (Number(g?.slotSize) || 0), 0)
    : 0;
  const totalSufficient = currentSum >= totalMiceCount;

  const okEnabled = isValid && !updateMutation.isPending;

  const saveGroup = useCallback(
    (
      groupId: number,
      val: number,
      callbacks?: { onSuccess?: () => void; onError?: () => void }
    ) => {
      updateMutation.mutate(
        { mouseGroupId: groupId, no_of_mice: val },
        {
          onSuccess: () => {
            savedValuesRef.current[groupId] = val;
            toast.success("Slot size updated successfully");
            callbacks?.onSuccess?.();
          },
          onError: () => {
            toast.error("Failed to update slot size");
            callbacks?.onError?.();
          },
        }
      );
    },
    [updateMutation]
  );

  const handleBlur = (index: number, groupId: number) => {
    const val = Number(watchedGroups[index]?.slotSize ?? 0);
    if (val < 0) return;
    if (savedValuesRef.current[groupId] === val) return;
    saveGroup(groupId, val);
  };

  const handleOk = () => {
    // Find first dirty (unsaved) field and save it before proceeding
    const dirtyField = watchedGroups.find((g) => {
      const saved = savedValuesRef.current[g?.groupId as number];
      return saved !== undefined && saved !== Number(g?.slotSize ?? 0);
    });
    if (dirtyField) {
      const val = Number(dirtyField.slotSize ?? 0);
      if (val >= 0) {
        saveGroup(dirtyField.groupId, val, { onSuccess: onOk });
        return;
      }
    }
    onOk();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded-md" />
          ))}
          <p className="text-sm text-muted-foreground text-center">
            Loading groups...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center gap-2 py-6">
          <p className="text-destructive font-medium">Error loading groups</p>
          <p className="text-sm text-muted-foreground">
            Unable to fetch mouse groups for this experiment.
          </p>
        </div>
      );
    }

    if (!fields.length) {
      return (
        <p className="text-muted-foreground text-sm py-4 text-center">
          No groups found for this experiment.
        </p>
      );
    }

    return (
      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
        {/* Header row */}
        <div className="flex items-center gap-3 px-3 text-xs font-medium text-muted-foreground">
          <span className="flex-1">Group Name</span>
          <span className="w-24 text-center shrink-0">Slot Size</span>
        </div>

        {fields.map((field, index) => {
          const group = groups?.[index];
          const hasError = !!errors.groups?.[index]?.slotSize;

          return (
            <div key={field.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-3 rounded-md border border-border p-3">
                <span className="flex-1 text-sm font-medium truncate">
                  {group?.name}
                </span>

                <input
                  type="hidden"
                  {...register(`groups.${index}.groupId`, {
                    valueAsNumber: true,
                  })}
                />

                <Input
                  type="number"
                  min={0}
                  {...register(`groups.${index}.slotSize`, {
                    valueAsNumber: true,
                    onBlur: () => handleBlur(index, field.groupId),
                  })}
                  className={`w-24 h-8 text-sm shrink-0 ${
                    hasError
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                />
              </div>

              {hasError && (
                <p className="text-xs text-destructive pl-3">
                  {errors.groups?.[index]?.slotSize?.message}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      showClose={false}
      className="max-w-xl"
      trigger={null}
      preventOutsideClose
    >
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold">Update Slot Size of Groups</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Update the slot size for each group. The total must be at least{" "}
            <span className="font-medium text-foreground">
              {totalMiceCount}
            </span>{" "}
            (selected mice count).
          </p>
        </div>

        {renderContent()}

        {/* Total counter — based on current form values */}
        {!isLoading && !error && !!fields.length && (
          <p
            className={`text-sm ${
              totalSufficient ? "text-muted-foreground" : "text-destructive"
            }`}
          >
            Total: <span className="font-medium">{currentSum}</span> /{" "}
            <span className="font-medium">{totalMiceCount}</span>
            {!totalSufficient && (
              <span> — total slot size must be at least {totalMiceCount}</span>
            )}
          </p>
        )}

        {/* Array-level validation error */}
        {errors.groups?.root?.message && (
          <p className="text-xs text-destructive">
            {errors.groups.root.message}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleOk}
            disabled={!okEnabled}
          >
            OK
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
