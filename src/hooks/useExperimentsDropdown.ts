import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  experimentApi,
  type ExperimentDropdownItem,
  type ExperimentFilters,
  handleApiError,
} from "../lib/api";
import { REACT_QUERY_CONFIG } from "../lib/constants";

interface UseExperimentsDropdownProps {
  filters?: ExperimentFilters;
  enabled?: boolean;
}

interface UseExperimentsDropdownResult {
  experiments: ExperimentDropdownItem[];
  loading: boolean;
  error: string | null;
  loadExperiments: (filters: ExperimentFilters) => void;
  clearExperiments: () => void;
}

export function useExperimentsDropdown(
  props?: UseExperimentsDropdownProps
): UseExperimentsDropdownResult {
  const { filters, enabled = false } = props || {};

  const {
    data: experiments = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["experiments-dropdown", filters],
    queryFn: async () => {
      if (!filters) {
        return [];
      }

      try {
        const response = await experimentApi.getExperimentsDropdown(filters);

        if (response.success) {
          return response.data;
        } else {
          const errorMessage = response.message || "Failed to load experiments";
          toast.error("Failed to load experiments", {
            description: errorMessage,
          });
          throw new Error(errorMessage);
        }
      } catch (err) {
        const errorMessage = handleApiError(err, "Failed to load experiments");
        console.error("Error loading experiments:", err);
        toast.error("Failed to load experiments", {
          description: errorMessage,
        });
        throw err;
      }
    },
    enabled: enabled && !!filters,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.MEDIUM, // 3 minutes
    retry: 1,
  });

  const loadExperiments = (newFilters: ExperimentFilters) => {
    if (JSON.stringify(newFilters) === JSON.stringify(filters)) {
      refetch();
    }
  };

  const clearExperiments = () => {
    // Data will be cleared when enabled becomes false or filters change
  };

  return {
    experiments,
    loading,
    error: error?.message || null,
    loadExperiments,
    clearExperiments,
  };
}
