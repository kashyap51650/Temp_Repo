import { useCallback, useState } from "react";

import { toast } from "@/components/atoms/Sonner/toast";

import {
  experimentApi,
  type ExperimentDropdownItem,
  type ExperimentFilters,
  handleApiError,
} from "../lib/api";

interface UseExperimentsDropdownResult {
  experiments: ExperimentDropdownItem[];
  loading: boolean;
  error: string | null;
  loadExperiments: (filters: ExperimentFilters) => Promise<void>;
  clearExperiments: () => void;
}

export function useExperimentsDropdown(): UseExperimentsDropdownResult {
  const [experiments, setExperiments] = useState<ExperimentDropdownItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExperiments = useCallback(
    async (filters: ExperimentFilters): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        const response = await experimentApi.getExperimentsDropdown(filters);

        if (response.success) {
          setExperiments(response.data);
        } else {
          const errorMessage = response.message || "Failed to load experiments";
          setError(errorMessage);
          toast.error("Failed to load experiments", {
            description: errorMessage,
          });
        }
      } catch (err) {
        const errorMessage = handleApiError(err, "Failed to load experiments");
        setError(errorMessage);
        console.error("Error loading experiments:", err);

        toast.error("Failed to load experiments", {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearExperiments = useCallback(() => {
    setExperiments([]);
    setError(null);
  }, []);

  return {
    experiments,
    loading,
    error,
    loadExperiments,
    clearExperiments,
  };
}
