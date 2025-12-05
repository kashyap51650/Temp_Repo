import { useCallback, useState } from "react";

import { toast } from "@/components/atoms/Sonner/toast";

import { handleApiError, type StudyType, studyTypeApi } from "../lib/api";

interface UseStudyTypesResult {
  studyTypes: StudyType[];
  loading: boolean;
  error: string | null;
  loadStudyTypes: () => void;
  clearStudyTypes: () => void;
}

export function useStudyTypes(): UseStudyTypesResult {
  const [studyTypes, setStudyTypes] = useState<StudyType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStudyTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studyTypeApi.getStudyTypes();

      if (response.success) {
        setStudyTypes(response.data);
      } else {
        const errorMessage = response.message || "Failed to load study types";
        setError(errorMessage);
        toast.error("Failed to load study types", {
          description: errorMessage,
        });
      }
    } catch (err) {
      const errorMessage = handleApiError(err, "Failed to load study types");
      setError(errorMessage);
      console.error("Error loading study types:", err);

      toast.error("Failed to load study types", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const clearStudyTypes = useCallback(() => {
    setStudyTypes([]);
    setError(null);
  }, []);

  return {
    studyTypes,
    loading,
    error,
    loadStudyTypes,
    clearStudyTypes,
  };
}
