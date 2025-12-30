import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { toast } from "@/components/atoms/Sonner/toast";

import {
  handleApiError,
  uploadedExperimentDataApi,
  type UploadedExperimentDataFilters,
  type UploadedExperimentDataItem,
  type UploadedExperimentDataResponse,
} from "../lib/api";
import { DEFAULT_PAGE_SIZE, REACT_QUERY_CONFIG } from "../lib/constants";

interface UseUploadedExperimentDataProps {
  enabled?: boolean;
}

interface UseUploadedExperimentDataResult {
  data: UploadedExperimentDataItem[];
  pagination: UploadedExperimentDataResponse["pagination"] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setFilters: (filters: UploadedExperimentDataFilters) => void;
}

export function useUploadedExperimentData(
  props?: UseUploadedExperimentDataProps
): UseUploadedExperimentDataResult {
  const [filters, setFilters] = useState<UploadedExperimentDataFilters>({
    size: DEFAULT_PAGE_SIZE,
  });

  const {
    data: queryData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["uploaded-experiment-data", filters],
    queryFn: async () => {
      try {
        const response =
          await uploadedExperimentDataApi.getMyExperimentData(filters);
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
    enabled: props?.enabled ?? true,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.SHORT, // 2 minutes
    retry: 1,
  });

  const data = queryData?.items || [];
  const pagination = queryData?.pagination || null;

  const handleSetFilters = (newFilters: UploadedExperimentDataFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1, // Reset to first page when filters change
    }));
  };

  return {
    data,
    pagination,
    loading,
    error: error?.message || null,
    refetch,
    setFilters: handleSetFilters,
  };
}
