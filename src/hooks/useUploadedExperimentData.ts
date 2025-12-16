import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { toast } from "@/components/atoms/Sonner/toast";

import {
  handleApiError,
  uploadedExperimentDataApi,
  type UploadedExperimentDataFilters,
  type UploadedExperimentDataItem,
  type UploadedExperimentDataResponse,
} from "../lib/api";
import { REACT_QUERY_CONFIG } from "../lib/constants";

interface UseUploadedExperimentDataProps {
  filters?: UploadedExperimentDataFilters;
  enabled?: boolean;
}

interface UseUploadedExperimentDataResult {
  data: UploadedExperimentDataItem[];
  pagination: UploadedExperimentDataResponse["pagination"] | null;
  loading: boolean;
  error: string | null;
  loadData: (filters?: UploadedExperimentDataFilters) => void;
  refetch: () => void;
  clearData: () => void;
}

export function useUploadedExperimentData(
  props?: UseUploadedExperimentDataProps
): UseUploadedExperimentDataResult {
  const { filters, enabled = true } = props || {};
  const [currentFilters, setCurrentFilters] = useState<
    UploadedExperimentDataFilters | undefined
  >(filters);

  const activeFilters = useMemo(
    () => filters || currentFilters,
    [filters, currentFilters]
  );

  const {
    data: queryData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["uploaded-experiment-data", activeFilters],
    queryFn: async () => {
      try {
        const response =
          await uploadedExperimentDataApi.getMyExperimentData(activeFilters);
        return response;
      } catch (err) {
        const errorMessage = handleApiError(
          err,
          "Failed to load uploaded experiment data"
        );
        console.error("Error loading uploaded experiment data:", err);
        toast.error("Failed to load uploaded experiment data", {
          description: errorMessage,
        });
        throw err;
      }
    },
    enabled,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.SHORT, // 2 minutes
    retry: 1,
  });

  const data = queryData?.items || [];
  const pagination = queryData?.pagination || null;

  const loadData = (newFilters?: UploadedExperimentDataFilters) => {
    setCurrentFilters(newFilters);
  };

  const clearData = () => {
    setCurrentFilters(undefined);
  };

  return {
    data,
    pagination,
    loading,
    error: error?.message || null,
    loadData,
    refetch,
    clearData,
  };
}
