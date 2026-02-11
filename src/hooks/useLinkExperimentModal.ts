import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { hotlabApi } from "@/api";
import type {
  ImportHotlabPDFPayload,
  ImportHotlabPDFResponse,
} from "@/types/hotlab";

const OTHER_OPTION_ID = -1;

export interface UseLinkExperimentModalProps {
  open: boolean;
  onSuccess?: (data: ImportHotlabPDFResponse) => void;
}

export interface UseLinkExperimentModalReturn {
  selectedOption: number | null;
  selectedExperimentId: number | null;
  isOtherSelected: boolean;
  isLoading: boolean;
  canSave: boolean;
  setSelectedOption: (option: number | null) => void;
  setSelectedExperimentId: (id: number | null) => void;
  handleSave: (file: File) => Promise<void>;
  resetForm: () => void;
}

export function useLinkExperimentModal({
  open,
  onSuccess,
}: UseLinkExperimentModalProps): UseLinkExperimentModalReturn {
  const queryClient = useQueryClient();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedExperimentId, setSelectedExperimentId] = useState<
    number | null
  >(null);

  const isOtherSelected = selectedOption === OTHER_OPTION_ID;

  // Mutation for linking experiment via hotlab import
  const linkMutation = useMutation({
    mutationFn: async (payload: ImportHotlabPDFPayload) => {
      const response = await hotlabApi.importHotlabData(payload);
      return response;
    },
    retry: false,
    onSuccess: (response) => {
      toast.success(response.message || "Experiment linked successfully");
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["validationData"],
      });
      onSuccess?.(response);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to link experiment");
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setSelectedOption(null);
    setSelectedExperimentId(null);
  };

  const handleSave = async (file: File) => {
    let experimentIdToLink: number | null = null;

    // Determine which experiment ID to link
    if (isOtherSelected && selectedExperimentId) {
      experimentIdToLink = selectedExperimentId;
    } else if (selectedOption && selectedOption !== OTHER_OPTION_ID) {
      experimentIdToLink = selectedOption;
    }

    if (!experimentIdToLink) {
      toast.error("Please select an experiment to link");
      return;
    }

    // If file is provided, use hotlab import API
    if (file) {
      const payload: ImportHotlabPDFPayload = {
        experiment_id: experimentIdToLink,
        file: file,
      };

      await linkMutation.mutateAsync(payload);
    }
  };

  const canSave =
    !linkMutation.isPending &&
    ((isOtherSelected && selectedExperimentId !== null) ||
      (selectedOption !== null && selectedOption !== OTHER_OPTION_ID));

  return {
    selectedOption,
    selectedExperimentId,
    isOtherSelected,
    isLoading: linkMutation.isPending,
    canSave,
    setSelectedOption,
    setSelectedExperimentId,
    handleSave,
    resetForm,
  };
}
