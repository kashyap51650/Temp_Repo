import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { ExperimentDropdownItem } from "@/api";
import {
  type ReceptorQuantificationFormData,
  ReceptorQuantificationFormDataSchema,
} from "@/lib/receptorQuantificationValidation";
import type { CreateReceptorQuantificationExperimentResponse } from "@/types/receptorQuantification";

import { useCreateReceptorQuantification } from "./useCreateReceptorQuantification";

interface UseReceptorQuantificationFormProps {
  projectId?: number;
  studyTypeId?: number;
  specialization?: string;
  onSuccess?: (data: ExperimentDropdownItem) => void;
  onCancel?: () => void;
}

export function useReceptorQuantificationForm({
  projectId,
  studyTypeId,
  specialization,
  onSuccess,
  onCancel,
}: UseReceptorQuantificationFormProps) {
  const { createExperiment, isCreating } = useCreateReceptorQuantification({
    onSuccess: (data: CreateReceptorQuantificationExperimentResponse) => {
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
  const form = useForm<ReceptorQuantificationFormData>({
    resolver: zodResolver(ReceptorQuantificationFormDataSchema),
    defaultValues: {
      experimentName: "",
      noOfReceptors: "",
      cellLine: [],
      primaryAntibody: undefined,
      secondaryAntibody: undefined,
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
      cell_line_ids: data.cellLine,
      primary_antibody_id: data.primaryAntibody,
      ...(data.secondaryAntibody && {
        secondary_antibody_id: data.secondaryAntibody,
      }),
      no_of_receptors: Number(data.noOfReceptors),
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
