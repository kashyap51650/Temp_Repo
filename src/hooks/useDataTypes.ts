import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { type DataType, dataTypeApi, handleApiError } from "../lib/api";
import { REACT_QUERY_CONFIG } from "../lib/constants";

interface UseDataTypesProps {
  studyTypeId?: number;
  enabled?: boolean;
}

interface UseDataTypesResult {
  dataTypes: DataType[];
  loading: boolean;
  error: string | null;
  loadDataTypes: (studyTypeId: number) => void;
  clearDataTypes: () => void;
}

export function useDataTypes(props?: UseDataTypesProps): UseDataTypesResult {
  const { studyTypeId, enabled = false } = props || {};

  const {
    data: dataTypes = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["data-types", studyTypeId],
    queryFn: async () => {
      if (!studyTypeId) {
        return [];
      }

      try {
        const response = await dataTypeApi.getDataTypes({
          study_type_id: studyTypeId,
        });

        if (response.success) {
          return response.data;
        } else {
          const errorMessage = response.message || "Failed to load data types";
          toast.error("Failed to load data types", {
            description: errorMessage,
          });
          throw new Error(errorMessage);
        }
      } catch (err) {
        const errorMessage = handleApiError(err, "Failed to load data types");
        console.error("Error loading data types:", err);
        toast.error("Failed to load data types", {
          description: errorMessage,
        });
        throw err;
      }
    },
    enabled: enabled && !!studyTypeId,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME.LONG, // 5 minutes
    retry: 1,
  });

  const loadDataTypes = (newStudyTypeId: number) => {
    if (newStudyTypeId === studyTypeId) {
      refetch();
    }
  };

  const clearDataTypes = () => {
    // to be kept for future use
  };

  return {
    dataTypes,
    loading,
    error: error?.message || null,
    loadDataTypes,
    clearDataTypes,
  };
}
