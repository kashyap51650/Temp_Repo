import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { randomizationApi } from "@/api";
import { queryClient } from "@/lib";
import type {
  EfficacyRandomizationConfirmPayload,
  EfficacyRandomizationGroup,
  EfficacyRandomizationPreviewData,
} from "@/types/efficacy-randomization";

type GroupPreviewMap = Record<number, EfficacyRandomizationPreviewData>;
type GroupAction = "randomize" | "confirm" | null;

interface UseEfficacyGroupRandomizationProps {
  experimentId: number;
  onConfirmSuccess?: () => void;
  onPreviewSuccess?: (previewData: EfficacyRandomizationPreviewData) => void;
  onPreviewCleared?: () => void;
}

export const useEfficacyGroupRandomization = ({
  experimentId,
  onConfirmSuccess,
  onPreviewSuccess,
  onPreviewCleared,
}: UseEfficacyGroupRandomizationProps) => {
  const [previewByGroup, setPreviewByGroup] = useState<GroupPreviewMap>({});
  const [activePreviewGroupId, setActivePreviewGroupId] = useState<
    number | null
  >(null);
  const [pendingGroupId, setPendingGroupId] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<GroupAction>(null);

  const previewMutation = useMutation({
    mutationFn: (parentGroupId: number) =>
      randomizationApi.previewEfficacyRandomization({
        experiment_id: experimentId,
        parent_group_id: parentGroupId,
      }),
    onSuccess: (response) => {
      const previewData = response.data;
      if (!previewData) {
        return;
      }

      // Clear previous preview and set new one (single active preview mode)
      setPreviewByGroup({
        [previewData.parent_group_id]: previewData,
      });
      setActivePreviewGroupId(previewData.parent_group_id);
      onPreviewSuccess?.(previewData);
      toast.success("Preview generated. Click confirm to continue.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to generate preview.");
    },
    onSettled: () => {
      setPendingGroupId(null);
      setPendingAction(null);
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (payload: EfficacyRandomizationConfirmPayload) =>
      randomizationApi.confirmEfficacyRandomization(payload),
    onSuccess: (_response, payload) => {
      setPreviewByGroup((prev) => {
        const next = { ...prev };
        delete next[payload.parent_group_id];
        return next;
      });

      // Clear active preview tracking
      if (activePreviewGroupId === payload.parent_group_id) {
        setActivePreviewGroupId(null);
      }

      onPreviewCleared?.();
      queryClient.invalidateQueries({
        queryKey: ["efficacy-randomization-groups", experimentId],
      });
      toast.success("Randomization confirmed successfully.");
      onConfirmSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to confirm randomization.");
    },
    onSettled: () => {
      setPendingGroupId(null);
      setPendingAction(null);
    },
  });

  const buildConfirmPayload = (
    previewData: EfficacyRandomizationPreviewData
  ): EfficacyRandomizationConfirmPayload => {
    return {
      experiment_id: previewData.experiment_id,
      parent_group_id: previewData.parent_group_id,
      subgroups: [
        {
          group_id: previewData.stay_group.group_id,
          mice: previewData.stay_group.mice.map((mouse) => ({
            mouse_id: mouse.mouse_id,
          })),
          type: "stay_group",
        },
        {
          group_id: previewData.move_group.group_id,
          mice: previewData.move_group.mice.map((mouse) => ({
            mouse_id: mouse.mouse_id,
          })),
          type: "move_group",
        },
      ],
    };
  };

  const handleGroupAction = (group: EfficacyRandomizationGroup) => {
    const previewData = previewByGroup[group.group_id];

    if (previewData) {
      // Validate that this group has the active preview
      if (activePreviewGroupId !== group.group_id) {
        toast.error(
          "Preview is no longer active. Please regenerate preview before confirming."
        );
        return;
      }

      setPendingGroupId(group.group_id);
      setPendingAction("confirm");
      confirmMutation.mutate(buildConfirmPayload(previewData));
      return;
    }

    setPendingGroupId(group.group_id);
    setPendingAction("randomize");
    previewMutation.mutate(group.group_id);
  };

  const getGroupActionLabel = (groupId: number) => {
    return previewByGroup[groupId] ? "Confirm" : "Randomize";
  };

  const isGroupActionPending = (groupId: number) => {
    return pendingGroupId === groupId;
  };

  const getGroupPendingLabel = (groupId: number) => {
    if (pendingGroupId !== groupId) {
      return null;
    }

    if (pendingAction === "confirm") {
      return "Confirming...";
    }

    return "Randomizing...";
  };

  /**
   * Check if a specific group has the active preview.
   * Only one group can have an active preview at a time.
   */
  const hasActivePreview = (groupId: number) => {
    return activePreviewGroupId === groupId && !!previewByGroup[groupId];
  };

  return {
    handleGroupAction,
    getGroupActionLabel,
    isGroupActionPending,
    getGroupPendingLabel,
    hasActivePreview,
    activePreviewGroupId, // For debugging/testing purposes
  };
};
