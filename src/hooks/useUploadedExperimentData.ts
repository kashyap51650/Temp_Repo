import { useCallback, useEffect, useRef, useState } from "react";

import { toast } from "@/components/atoms/Sonner/toast";

import {
  handleApiError,
  uploadedExperimentDataApi,
  type UploadedExperimentDataFilters,
  type UploadedExperimentDataItem,
  type UploadedExperimentDataResponse,
} from "../lib/api";

interface UseUploadedExperimentDataResult {
  data: UploadedExperimentDataItem[];
  pagination: UploadedExperimentDataResponse["pagination"] | null;
  loading: boolean;
  error: string | null;
  loadData: (filters?: UploadedExperimentDataFilters) => Promise<void>;
  refetch: () => Promise<void>;
  clearData: () => void;
}

export function useUploadedExperimentData(): UseUploadedExperimentDataResult {
  const [data, setData] = useState<UploadedExperimentDataItem[]>([]);
  const [pagination, setPagination] = useState<
    UploadedExperimentDataResponse["pagination"] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<
    UploadedExperimentDataFilters | undefined
  >();

  const hasInitialLoadStarted = useRef(false);
  const isLoadingRef = useRef(false);

  const loadData = useCallback(
    async (filters?: UploadedExperimentDataFilters) => {
      if (isLoadingRef.current) {
        return;
      }

      try {
        isLoadingRef.current = true;
        setLoading(true);
        setError(null);
        setCurrentFilters(filters);

        const response =
          await uploadedExperimentDataApi.getMyExperimentData(filters);

        setData(response.items);
        setPagination(response.pagination);
      } catch (err) {
        const errorMessage = handleApiError(
          err,
          "Failed to load uploaded experiment data"
        );
        setError(errorMessage);
        console.error("Error loading uploaded experiment data:", err);

        toast.error("Failed to load uploaded experiment data", {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    },
    []
  );

  const refetch = useCallback(async () => {
    if (currentFilters !== undefined) {
      await loadData(currentFilters);
    } else {
      await loadData();
    }
  }, [loadData, currentFilters]);

  const clearData = useCallback(() => {
    setData([]);
    setPagination(null);
    setError(null);
    setCurrentFilters(undefined);
    hasInitialLoadStarted.current = false;
  }, []);

  useEffect(() => {
    if (!hasInitialLoadStarted.current) {
      hasInitialLoadStarted.current = true;
      loadData();
    }
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    loadData,
    refetch,
    clearData,
  };
}
