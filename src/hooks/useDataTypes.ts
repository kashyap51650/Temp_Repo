import { useCallback, useState } from "react";

import { toast } from "@/components/atoms/Sonner/toast";

import { type DataType, dataTypeApi, handleApiError } from "../lib/api";

interface UseDataTypesResult {
  dataTypes: DataType[];
  loading: boolean;
  error: string | null;
  loadDataTypes: (studyTypeId: number) => void;
  clearDataTypes: () => void;
}

export function useDataTypes(): UseDataTypesResult {
  const [dataTypes, setDataTypes] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDataTypes = useCallback(async (studyTypeId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await dataTypeApi.getDataTypes({
        study_type_id: studyTypeId,
      });

      if (response.success) {
        setDataTypes(response.data);
      } else {
        const errorMessage = response.message || "Failed to load data types";
        setError(errorMessage);
        toast.error("Failed to load data types", {
          description: errorMessage,
        });
      }
    } catch (err) {
      const errorMessage = handleApiError(err, "Failed to load data types");
      setError(errorMessage);
      console.error("Error loading data types:", err);

      toast.error("Failed to load data types", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const clearDataTypes = useCallback(() => {
    setDataTypes([]);
    setError(null);
  }, []);

  return {
    dataTypes,
    loading,
    error,
    loadDataTypes,
    clearDataTypes,
  };
}
