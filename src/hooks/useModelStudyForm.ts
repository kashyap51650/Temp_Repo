import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import type { ExperimentDropdownItem } from "@/lib/api";
import {
  formatDateToISO,
  type ModelStudyFormData,
  ModelStudyFormDataSchema,
} from "@/lib/modelStudyValidation";
import type { CreateModelStudyResponse } from "@/types/modelStudy";

import { useCreateModelStudyExperiment } from "./useCreateModelStudyExperiment";

interface UseModelStudyFormProps {
  projectId?: number;
  studyTypeId?: number;
  specialization?: string;
  onSuccess?: (data: ExperimentDropdownItem) => void;
  onCancel?: () => void;
}

export function useModelStudyForm({
  projectId,
  studyTypeId,
  specialization,
  onSuccess,
  onCancel,
}: UseModelStudyFormProps) {
  const { createExperiment, isCreating } = useCreateModelStudyExperiment({
    onSuccess: (data: CreateModelStudyResponse) => {
      if (data?.data) {
        form.reset();
        onSuccess?.({
          id: data?.data.id,
          experiment_name: data?.data.experiment_name,
          randomization_status: data?.data.radomization_status,
        });
      }
    },
  });

  const form = useForm<ModelStudyFormData>({
    resolver: zodResolver(ModelStudyFormDataSchema),
    defaultValues: {
      experimentName: "",
      cellLineStrainPairs: [],
      cellInjectionCounts: [],
      vehicles: [],
      injectionDate: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cellLineStrainPairs",
  });

  const handleAddPair = useCallback(() => {
    append({} as { cell_line_id: number; mouse_strain_id: number });
  }, [append]);

  const handleRemovePair = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  const handleCancel = useCallback(() => {
    form.reset();
    onCancel?.();
  }, [form, onCancel]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!projectId || !studyTypeId || !specialization) {
      toast.error("Missing required information", {
        description:
          "Project ID, Study Type ID, and Specialization are required",
      });
      return;
    }

    const injectionDate = formatDateToISO(data.injectionDate);
    if (!injectionDate) {
      toast.error("Invalid injection date format");
      return;
    }

    const validCellLineStrainPairs = data.cellLineStrainPairs.filter(
      (val): val is { cell_line_id: number; mouse_strain_id: number } =>
        typeof val.cell_line_id === "number" &&
        typeof val.mouse_strain_id === "number"
    );

    createExperiment({
      experiment_name: data.experimentName.trim(),
      project_id: projectId,
      specialization: specialization.toUpperCase(),
      study_type_id: studyTypeId,
      cell_line_strain_pairs: validCellLineStrainPairs,
      cell_injection_count_ids: data.cellInjectionCounts,
      vehicle_ids: data.vehicles,
      cell_injection_date: injectionDate,
    });
  });

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
