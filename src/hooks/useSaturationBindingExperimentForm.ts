import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { ExperimentDropdownItem } from "@/api";
import {
  type SaturationBindingFormData,
  SaturationBindingFormDataSchema,
} from "@/lib/saturationBindingExperiment";
import type { CreateSaturationBindingExperimentResponse } from "@/types/saturationBindingExperiment";

import { useCreateSaturationBindingExperiment } from "./useCreateSaturationBindingExperiment";

interface UseSaturationBindingExperimentFormProps {
  projectId?: number;
  studyTypeId?: number;
  specialization?: string;
  onSuccess?: (data: ExperimentDropdownItem) => void;
  onCancel?: () => void;
}

export function useSaturationBindingExperimentForm({
  projectId,
  studyTypeId,
  specialization,
  onSuccess,
  onCancel,
}: UseSaturationBindingExperimentFormProps) {
  const { createExperiment, isCreating } = useCreateSaturationBindingExperiment(
    {
      onSuccess: (data: CreateSaturationBindingExperimentResponse) => {
        if (data?.data) {
          form.reset();
          onSuccess?.({
            id: data?.data.id,
            experiment_name: data?.data.experiment_name,
            randomization_status: data?.data?.randomization_status,
          });
        }
      },
    }
  );
  const form = useForm<SaturationBindingFormData>({
    resolver: zodResolver(SaturationBindingFormDataSchema),
    defaultValues: {
      experimentName: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!projectId || !studyTypeId || !specialization) {
      toast.error("Missing required information", {
        description:
          "Project ID, Study Type ID, and Specialization are required",
      });
      return;
    }

    createExperiment({
      experiment_name: data.experimentName.trim(),
      project_id: projectId,
      specialization: specialization.toUpperCase(),
      study_type_id: studyTypeId,
    });
  });

  const handleCancel = useCallback(() => {
    form.reset();
    onCancel?.();
  }, [form, onCancel]);

  return {
    form,
    isCreating,
    handleCancel,
    handleSubmit,
  };
}
