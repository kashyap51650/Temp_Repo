import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import type { ExperimentDropdownItem } from "@/api";
import {
  type ElisaFormData,
  ElisaFormDataSchema,
} from "@/lib/elisaExperimentValidation";
import type { CreateElisaExperimentResponse } from "@/types/elisaExperiment";

import { useCreateElisaExperiment } from "./useCreateElisaExperiment";

interface UseElisaExperimentFormProps {
  projectId?: number;
  studyTypeId?: number;
  specialization?: string;
  onSuccess?: (data: ExperimentDropdownItem) => void;
  onCancel?: () => void;
}

export function useElisaExperimentForm({
  projectId,
  studyTypeId,
  specialization,
  onSuccess,
  onCancel,
}: UseElisaExperimentFormProps) {
  const { createExperiment, isCreating } = useCreateElisaExperiment({
    onSuccess: (data: CreateElisaExperimentResponse) => {
      if (data?.data) {
        form.reset();
        onSuccess?.({
          id: data?.data.id,
          experiment_name: data?.data.experiment_name,
          randomization_status: data?.data?.randomization_status,
        });
      }
    },
  });
  const form = useForm<ElisaFormData>({
    resolver: zodResolver(ElisaFormDataSchema),
    defaultValues: {
      experimentName: "",
      kd_values: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "kd_values",
  });

  const handleAddPair = useCallback(() => {
    append({});
  }, [append]);

  const handleRemovePair = useCallback(
    (index: number) => {
      const pairToRemove = form.getValues(`kd_values.${index}`);
      remove(index);
      const remainingPairs = form.getValues("kd_values");
      const hasKey =
        pairToRemove?.kd_key !== undefined && pairToRemove?.kd_key.trim();
      const hasValue =
        pairToRemove?.kd_value !== undefined && pairToRemove?.kd_value.trim();
      if (hasKey && hasValue) {
        const stillExists = remainingPairs.some(
          (pair) =>
            pair?.kd_key?.trim() === pairToRemove.kd_key?.trim() &&
            pair?.kd_value?.trim() === pairToRemove.kd_value?.trim()
        );
        if (stillExists) {
          form.trigger("kd_values");
        }
      }
    },
    [remove, form]
  );

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!projectId || !studyTypeId || !specialization) {
      toast.error("Missing required information", {
        description:
          "Project ID, Study Type ID, and Specialization are required",
      });
      return;
    }

    const validKdValuesPairs = data.kd_values.filter(
      (val): val is { kd_key: string; kd_value: string } =>
        typeof val.kd_key === "string" &&
        val.kd_key.trim() !== "" &&
        typeof val.kd_value === "string" &&
        val.kd_value.trim() !== ""
    );

    createExperiment({
      experiment_name: data.experimentName.trim(),
      project_id: projectId,
      specialization: specialization.toUpperCase(),
      study_type_id: studyTypeId,
      kd_values: validKdValuesPairs,
    });
  });

  const handleCancel = useCallback(() => {
    form.reset();
    onCancel?.();
  }, [form, onCancel]);

  return {
    form,
    fields,
    isCreating,
    handleAddPair,
    handleRemovePair,
    handleCancel,
    handleSubmit,
  };
}
