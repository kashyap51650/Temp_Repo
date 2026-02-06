import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { ExperimentDropdownItem } from "@/api";
import {
  type DoseRangeFindingFormData,
  DoseRangeFindingFormDataSchema,
} from "@/lib/doseRangeFindingValidation";
import type { CreateDoseRangeFindingResponse } from "@/types/doseRangeFinding";

import { useCreateDoseRangeExperiment } from "./useCreateDoseRangeExperiment";

interface UseDoseRangeStudyFormProps {
  projectId?: number;
  studyTypeId?: number;
  specialization?: string;
  onSuccess?: (data: ExperimentDropdownItem) => void;
  onCancel?: () => void;
}

export function useDoseRangeStudyForm({
  projectId,
  studyTypeId,
  specialization,
  onSuccess,
  onCancel,
}: UseDoseRangeStudyFormProps) {
  const { createExperiment, isCreating } = useCreateDoseRangeExperiment({
    onSuccess: (data: CreateDoseRangeFindingResponse) => {
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
  const form = useForm<DoseRangeFindingFormData>({
    resolver: zodResolver(DoseRangeFindingFormDataSchema),
    defaultValues: {
      experimentName: "",
      doses: [],
      drugs: [],
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
      dose_ids: data.doses,
      experiment_drug_ids: data.drugs,
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
