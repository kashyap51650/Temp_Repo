import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { randomizationApi } from "@/api";
import type {
  RandomizationPreviewData,
  RandomizationPreviewResponse,
} from "@/types/randomization";

export const useRandomizationResult = () => {
  // Drug Selection Dropdown State for each Group
  const [selectedGroupDrug, setSelectedGroupDrug] = useState<
    Record<string, string>
  >({});

  const [randomizationData, setRandomizationData] =
    useState<RandomizationPreviewData | null>(null);

  // Buffer groups state for weight sheet randomization
  const [bufferGroups, setBufferGroups] = useState<string[]>(["Buffer"]);

  const navigate = useNavigate();

  const {
    mutate: previewRandomizationfn,
    isPending,
    isError,
  } = useMutation({
    mutationFn: (payload: {
      experiment_id: number;
      mice_per_group: number;
      randomization_type: string;
      buffer_groups?: string[];
    }) => randomizationApi.previewRandomization(payload),
    onSuccess: (data: RandomizationPreviewResponse) => {
      if (data.data) {
        setRandomizationData(data.data);
        // Update buffer groups from response if available
        if (data.data.buffer_groups) {
          setBufferGroups(data.data.buffer_groups);
        }
      }
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to preview randomization. Please try again."
      );
    },
  });

  const { mutate, isPending: isConfirmationPending } = useMutation({
    mutationFn: (payload: RandomizationPreviewData) =>
      randomizationApi.confirmRandomization(payload),
    onSuccess: () => {
      toast.success("Randomization confirmed successfully!");
      navigate({
        to: "/data-validate",
      });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to preview randomization. Please try again."
      );
    },
  });

  const handleConfirmClick = () => {
    if (!randomizationData) return;

    const updatedData: RandomizationPreviewData = {
      ...randomizationData,
      groups: randomizationData.groups.map((group) => {
        const drugId = selectedGroupDrug[group.group_code];
        if (drugId) {
          return {
            ...group,
            experiment_drug_id: Number(drugId),
          };
        }
        return group;
      }),
    };

    mutate(updatedData);
  };

  const handleBack = () => {
    navigate({ to: "/data-validate" });
  };

  return {
    selectedGroupDrug,
    setSelectedGroupDrug,
    randomizationData,
    isConfirmationPending,
    previewRandomizationfn,
    handleConfirmClick,
    handleBack,
    isPending,
    isError,
    bufferGroups,
    setBufferGroups,
  };
};
