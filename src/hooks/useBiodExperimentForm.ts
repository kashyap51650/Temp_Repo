import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { type ExperimentDropdownItem, type Isotope, isotopeApi } from "@/api";
import { queryClient } from "@/lib";
import {
  type BiodExperimentFormData,
  BiodExperimentFormDataSchema,
} from "@/lib/biodExperimentValidation";

import { useCreateBiodExperiment } from "./useCreateBiodExperiment";

interface UseBiodExperimentFormProps {
  projectId?: number;
  studyTypeId?: number;
  specialization?: string;
  isCellLineDisabled?: boolean;
  preselectedCellLineIds?: number[];
  onSuccess?: (data: ExperimentDropdownItem) => void;
  onCancel?: () => void;
}

export function useBiodExperimentForm({
  projectId,
  studyTypeId,
  specialization,
  preselectedCellLineIds = [],
  onSuccess,
  onCancel,
}: UseBiodExperimentFormProps) {
  const cachedIsotopes = queryClient.getQueryData<Isotope[]>([
    "isotopes-dropdown",
  ]);

  const { createBiodExperiment, isCreating } = useCreateBiodExperiment({
    onSuccess: (data) => {
      if (data?.id && data?.experiment_name) {
        form.reset();
        onSuccess?.({
          id: data.id,
          experiment_name: data.experiment_name,
          randomization_status: data.randomization_status,
        });
      }
    },
  });

  const { data: isotopes = [] } = useQuery({
    queryKey: ["isotopes-dropdown"],
    queryFn: async () => {
      const response = await isotopeApi.getIsotopes();
      return response.data || [];
    },
    enabled: cachedIsotopes === undefined, // Only fetch if not in cache
  });

  const form = useForm<BiodExperimentFormData>({
    resolver: zodResolver(BiodExperimentFormDataSchema),
    defaultValues: {
      experimentName: "",
      isotopeId: cachedIsotopes?.find(
        (option) => option.isotope_name.toLowerCase() === "pb-212"
      )?.id,
      cellLineIds: preselectedCellLineIds,
    },
  });

  const pb212Option = useMemo(() => {
    return isotopes.find(
      (option) => option.isotope_name.toLowerCase() === "pb-212"
    );
  }, [isotopes]);

  useEffect(() => {
    if (form.getValues("isotopeId")) return; // Don't override if user has already selected an isotope

    if (pb212Option) {
      form.setValue("isotopeId", pb212Option.id);
    }
  }, [form, cachedIsotopes, pb212Option]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!projectId || !studyTypeId || !specialization) {
      toast.error("Missing required information", {
        description:
          "Project ID, Study Type ID, and Specialization are required",
      });
      return;
    }

    createBiodExperiment({
      experiment_name: data.experimentName.trim(),
      isotope_id: data.isotopeId,
      cell_line_ids: data.cellLineIds,
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
    handleSubmit,
    handleCancel,
  };
}
