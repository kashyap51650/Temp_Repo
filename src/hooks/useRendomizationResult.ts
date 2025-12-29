import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { randomizationApi } from "@/lib/api";
import type {
  RandomizationPreviewData,
  RandomizationPreviewResponse,
} from "@/types/randomization";

export const useRendomizationResult = () => {
  // Drug Selection Dropdown State for each Group
  const [selectedGroupDrug, setSelectedGroupDrug] = useState<
    Record<string, string>
  >({});

  const [randomizationData, setRandomizationData] =
    useState<RandomizationPreviewData | null>(null);

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
    }) => randomizationApi.previewRandomization(payload),
    onSuccess: (data: RandomizationPreviewResponse) => {
      if (data.data) {
        setRandomizationData(data.data);
      }
    },
    onError: (error: Error) => {
      console.error("Error previewing randomization:", error);
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
      console.error("Error confirming randomization:", error);
      toast.error(
        error.message || "Failed to preview randomization. Please try again."
      );
    },
  });

  const handleConfirmClick = () => {
    // iterate selected group drug
    for (const [key, value] of Object.entries(selectedGroupDrug)) {
      const group = randomizationData?.groups.find((g) => g.group_code === key);
      if (group) {
        group.experiment_drug_id = Number(value);
      }
    }

    if (randomizationData) {
      mutate(randomizationData);
    }
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
  };
};
