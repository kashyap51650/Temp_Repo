import { useQuery } from "@tanstack/react-query";

import { type StudyType, studyTypeApi } from "@/api";
import { toast } from "@/components/atoms/Sonner/toast";

import { handleApiError } from "../lib/api";
import { REACT_QUERY_CONFIG } from "../lib/constants";

interface UseStudyTypesProps {
  enabled?: boolean;
}

interface UseStudyTypesResult {
  studyTypes: StudyType[];
  loading: boolean;
  error: string | null;
  loadStudyTypes: () => void;
  clearStudyTypes: () => void;
}

export function useStudyTypes(props?: UseStudyTypesProps): UseStudyTypesResult {
  const { enabled = false } = props || {};

  const {
    data: studyTypes = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["study-types"],
    queryFn: async () => {
      try {
        const response = await studyTypeApi.getStudyTypes();

        if (response.success) {
          return response.data;
        } else {
          const errorMessage = response.message || "Failed to load study types";
          toast.error("Failed to load study types", {
            description: errorMessage,
          });
          throw new Error(errorMessage);
        }
      } catch (err) {
        const errorMessage = handleApiError(err, "Failed to load study types");
        console.error("Error loading study types:", err);
        toast.error("Failed to load study types", {
          description: errorMessage,
        });
        throw err;
      }
    },
    enabled,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.LONG, // 5 minutes
    retry: 1,
  });

  const loadStudyTypes = () => {
    refetch();
  };

  const clearStudyTypes = () => {
    //To be used in future
  };

  return {
    studyTypes,
    loading,
    error: error?.message || null,
    loadStudyTypes,
    clearStudyTypes,
  };
}
