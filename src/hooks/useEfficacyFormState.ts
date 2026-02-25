import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { efficacyApi, type ExperimentDropdownItem } from "@/api";
import { queryClient } from "@/lib";
import type { CreateEfficacyExperimentPayload } from "@/types/efficacy";

export interface EfficacyGroup {
  groupNumber: number;
  groupType: "buffer" | "market" | "normal";
  strainId?: number;
  cellLineId?: number;
  marketDoseId?: number;
  experimentDrugId?: number;
  noOfDoses?: number;
  radiationDoseId?: number;
  doseFrequencyId?: number;
  noOfMice?: number;
}

export interface FormData {
  experimentName: string;
  numberOfGroups: number;
  selectedStrains: number[];
  selectedCellLines: number[];
  includeMarketDose: boolean;
  groups: EfficacyGroup[];
}

interface FormErrors {
  experimentName?: string;
  numberOfGroups?: string;
  selectedStrains?: string;
  selectedCellLines?: string;
  groups?: {
    [groupIndex: number]: {
      strainId?: string;
      cellLineId?: string;
      experimentDrugId?: string;
      noOfDoses?: string;
      noOfMice?: string;
      radiationDoseId?: string;
      doseFrequencyId?: string;
      marketDoseId?: string;
    };
  };
}

interface UseEfficacyFormStateProps {
  projectId?: number;
  studyTypeId?: number;
  specialization?: string;
  onSuccess?: (data: ExperimentDropdownItem) => void;
  onCancel?: () => void;
}

export function useEfficacyFormState({
  projectId,
  studyTypeId,
  specialization,
  onSuccess,
  onCancel,
}: UseEfficacyFormStateProps) {
  const [formData, setFormData] = useState<FormData>({
    experimentName: "",
    numberOfGroups: 1,
    selectedStrains: [],
    selectedCellLines: [],
    includeMarketDose: false,
    groups: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const { mutate, isPending: isCreating } = useMutation({
    mutationFn: async (payload: CreateEfficacyExperimentPayload) =>
      efficacyApi.createExperiment(payload),
  });

  // Auto-generate groups when parameters change
  useEffect(() => {
    if (formData.numberOfGroups && formData.selectedStrains.length > 0) {
      const newGroups: EfficacyGroup[] = [];
      let groupCounter = 1;

      // Step 1: Add buffer groups for each strain
      formData.selectedStrains.forEach((strainId) => {
        newGroups.push({
          groupNumber: groupCounter++,
          groupType: "buffer",
          strainId: strainId,
        });
      });

      // Step 2: Add normal groups only if numberOfGroups > number of strains
      // Formula: normalGroupCount = numberOfGroups - numberOfStrains
      const normalGroupCount =
        formData.numberOfGroups - formData.selectedStrains.length;

      if (normalGroupCount > 0) {
        for (let i = 0; i < normalGroupCount; i++) {
          // Cycle through strains for each normal group
          const strainId =
            formData.selectedStrains[i % formData.selectedStrains.length];
          newGroups.push({
            groupNumber: groupCounter++,
            groupType: "normal",
            strainId: strainId,
          });
        }
      }

      // Step 3: Add ONE separate market dose group (if enabled)
      if (formData.includeMarketDose) {
        newGroups.push({
          groupNumber: groupCounter++,
          groupType: "market",
          strainId: formData.selectedStrains[0], // Assign to first strain
        });
      }

      setFormData((prev) => ({ ...prev, groups: newGroups }));
    }
  }, [
    formData.numberOfGroups,
    formData.selectedStrains,
    formData.includeMarketDose,
  ]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate experiment name
    if (!formData.experimentName.trim()) {
      newErrors.experimentName = "Experiment name is required";
    } else if (formData.experimentName.trim().length < 3) {
      newErrors.experimentName =
        "Experiment name must be at least 3 characters";
    } else if (formData.experimentName.length > 255) {
      newErrors.experimentName =
        "Experiment name must be at most 255 characters";
    }

    // Validate number of groups
    if (formData.numberOfGroups < 1) {
      newErrors.numberOfGroups = "At least 1 group is required";
    } else if (formData.numberOfGroups > 20) {
      newErrors.numberOfGroups = "Maximum 20 groups allowed";
    }

    // Validate strains based on number of groups
    if (formData.selectedStrains.length === 0) {
      newErrors.selectedStrains = "At least 1 strain must be selected";
    } else if (
      formData.numberOfGroups === 1 &&
      formData.selectedStrains.length > 1
    ) {
      newErrors.selectedStrains =
        "Only 1 strain allowed when number of groups is 1";
    } else if (
      formData.numberOfGroups > 1 &&
      formData.selectedStrains.length > 2
    ) {
      newErrors.selectedStrains = "Maximum 2 strains can be selected";
    }

    // Validate cell lines
    if (formData.selectedCellLines.length === 0) {
      newErrors.selectedCellLines = "At least 1 cell line must be selected";
    }

    // Validate groups
    const groupErrors: FormErrors["groups"] = {};
    formData.groups.forEach((group, index) => {
      if (group.groupType === "normal" || group.groupType === "market") {
        const errors: NonNullable<FormErrors["groups"]>[number] = {};

        if (!group.strainId) {
          errors.strainId = "Strain is required";
        }
        if (!group.cellLineId) {
          errors.cellLineId = "Cell line is required";
        }
        if (!group.experimentDrugId) {
          errors.experimentDrugId = "Drug name is required";
        }
        if (!group.noOfDoses) {
          errors.noOfDoses = "Number of doses is required";
        }
        if (!group.noOfMice) {
          errors.noOfMice = "Number of mice is required";
        }
        if (!group.radiationDoseId) {
          errors.radiationDoseId = "Radiation dose is required";
        }
        if (!group.doseFrequencyId) {
          errors.doseFrequencyId = "Frequency is required";
        }
        if (group.groupType === "market" && !group.marketDoseId) {
          errors.marketDoseId = "Market dose is required";
        }

        if (Object.keys(errors).length > 0) {
          groupErrors[index] = errors;
        }
      }
    });

    if (Object.keys(groupErrors).length > 0) {
      newErrors.groups = groupErrors;
    }

    setErrors(newErrors);
    return (
      Object.keys(newErrors).length === 0 &&
      Object.keys(groupErrors).length === 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!projectId || !studyTypeId || !specialization) {
      toast.error("Missing required information", {
        description:
          "Project ID, Study Type ID, and Specialization are required",
      });
      return;
    }
    // Build the payload according to API spec
    const payload = {
      experiment_name: formData.experimentName,
      project_id: projectId,
      specialization: specialization.toUpperCase(),
      mouse_strain_ids: formData.selectedStrains,
      cell_line_ids: formData.selectedCellLines,
      groups: formData.groups.map((group) => {
        return {
          strain_id: group.strainId ?? null,
          cell_line_id: group.cellLineId ?? null,
          market_dose_id: group.marketDoseId ?? null,
          experiment_drug_id: group.experimentDrugId ?? null,
          no_of_doses: group.noOfDoses ?? null,
          radiation_dose_id: group.radiationDoseId ?? null,
          dose_frequency_id: group.doseFrequencyId ?? null,
          no_of_mice: group.noOfMice ?? null,
        };
      }),
    };

    mutate(payload, {
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: ["experiments-dropdown"],
        });
        toast.success(response?.message || "Experiment created successfully");
        if (response?.data?.experiment) {
          onSuccess?.({
            id: response.data.experiment.id,
            experiment_name: response.data.experiment.experiment_name,
            randomization_status: response.data.experiment.randomization_status,
          });
          resetForm();
        }
      },
      onError: (error) => {
        toast.error("Failed to create experiment", {
          description:
            error instanceof Error ? error.message : "An error occurred",
        });
      },
    });
  };

  const handleCancel = () => {
    resetForm();
    onCancel?.();
  };

  const resetForm = () => {
    setFormData({
      experimentName: "",
      numberOfGroups: 1,
      selectedStrains: [],
      selectedCellLines: [],
      includeMarketDose: false,
      groups: [],
    });
    setErrors({});
  };

  const updateGroup = (
    index: number,
    field: keyof EfficacyGroup,
    value: number
  ) => {
    setFormData((prev) => {
      const updatedGroups = [...prev.groups];
      updatedGroups[index] = { ...updatedGroups[index], [field]: value };
      return { ...prev, groups: updatedGroups };
    });
  };

  const updateFormField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStrainChange = (values: string | string[]) => {
    const ids = Array.isArray(values)
      ? values.map((v) => Number.parseInt(v, 10))
      : [Number.parseInt(values, 10)];

    // Enforce strain limit based on number of groups
    const maxStrains = formData.numberOfGroups === 1 ? 1 : 2;

    if (ids.length > maxStrains) {
      toast.warning(
        formData.numberOfGroups === 1
          ? "Only 1 strain allowed"
          : "Maximum 2 strains allowed",
        {
          description:
            formData.numberOfGroups === 1
              ? "When number of groups is 1, you can only select 1 strain"
              : "Only the first 2 selections will be kept",
        }
      );
      setFormData((prev) => ({
        ...prev,
        selectedStrains: ids.slice(0, maxStrains),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, selectedStrains: ids }));
  };

  const handleCellLineChange = (values: string | string[]) => {
    const ids = Array.isArray(values)
      ? values.map((v) => Number.parseInt(v, 10))
      : [Number.parseInt(values, 10)];
    setFormData((prev) => ({ ...prev, selectedCellLines: ids }));
  };

  return {
    formData,
    errors,
    isCreating,
    handleSubmit,
    handleCancel,
    updateGroup,
    updateFormField,
    handleStrainChange,
    handleCellLineChange,
  };
}
