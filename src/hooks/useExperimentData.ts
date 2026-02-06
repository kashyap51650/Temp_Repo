import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  type CellLine,
  cellLineApi,
  type Isotope,
  isotopeApi,
  type MouseStrain,
  mouseStrainApi,
} from "@/api";
import { toast } from "@/components/atoms/Sonner/toast";

import { handleApiError } from "../lib/api";

interface UseExperimentDataResult {
  isotopes: Isotope[];
  cellLines: CellLine[];
  mouseStrains: MouseStrain[];
  loading: {
    isotopes: boolean;
    cellLines: boolean;
    mouseStrains: boolean;
  };
  errors: {
    isotopes: string | null;
    cellLines: string | null;
    mouseStrains: string | null;
  };
  loadExperimentData: () => void;
}

export function useExperimentData(): UseExperimentDataResult {
  const {
    data: isotopes = [],
    isLoading: isLoadingIsotopes,
    error: isotopesError,
    refetch: refetchIsotopes,
  } = useQuery({
    queryKey: ["isotopes"],
    queryFn: async () => {
      try {
        const response = await isotopeApi.getIsotopes();
        if (response.success) {
          return response.data;
        } else {
          const errorMessage = response.message || "Failed to load isotopes";
          toast.error("Failed to load isotopes", {
            description: errorMessage,
          });
          throw new Error(errorMessage);
        }
      } catch (err) {
        const errorMessage = handleApiError(err, "Failed to load isotopes");
        toast.error("Failed to load isotopes", {
          description: errorMessage,
        });
        throw err;
      }
    },
    enabled: false,
  });

  const {
    data: cellLines = [],
    isLoading: isLoadingCellLines,
    error: cellLinesError,
    refetch: refetchCellLines,
  } = useQuery({
    queryKey: ["cellLines"],
    queryFn: async () => {
      try {
        const response = await cellLineApi.getCellLines();
        if (response.success) {
          return response.data;
        } else {
          const errorMessage = response.message || "Failed to load cell lines";
          toast.error("Failed to load cell lines", {
            description: errorMessage,
          });
          throw new Error(errorMessage);
        }
      } catch (err) {
        const errorMessage = handleApiError(err, "Failed to load cell lines");
        toast.error("Failed to load cell lines", {
          description: errorMessage,
        });
        throw err;
      }
    },
    enabled: false,
  });

  const {
    data: mouseStrains = [],
    isLoading: isLoadingMouseStrains,
    error: mousestrainsError,
    refetch: refetchMouseStrains,
  } = useQuery({
    queryKey: ["mouseStrains"],
    queryFn: async () => {
      try {
        const response = await mouseStrainApi.getMouseStrains();
        if (response.success) {
          return response.data;
        } else {
          const errorMessage =
            response.message || "Failed to load mouse strains";
          toast.error("Failed to load mouse strains", {
            description: errorMessage,
          });
          throw new Error(errorMessage);
        }
      } catch (err) {
        const errorMessage = handleApiError(
          err,
          "Failed to load mouse strains"
        );
        toast.error("Failed to load mouse strains", {
          description: errorMessage,
        });
        throw err;
      }
    },
    enabled: false,
  });

  const loading = {
    isotopes: isLoadingIsotopes,
    cellLines: isLoadingCellLines,
    mouseStrains: isLoadingMouseStrains,
  };

  const errors = {
    isotopes: isotopesError
      ? handleApiError(isotopesError, "Failed to load isotopes")
      : null,
    cellLines: cellLinesError
      ? handleApiError(cellLinesError, "Failed to load cell lines")
      : null,
    mouseStrains: mousestrainsError
      ? handleApiError(mousestrainsError, "Failed to load mouse strains")
      : null,
  };

  const loadExperimentData = useCallback(async () => {
    await Promise.all([
      refetchIsotopes(),
      refetchCellLines(),
      refetchMouseStrains(),
    ]);
  }, [refetchIsotopes, refetchCellLines, refetchMouseStrains]);

  return {
    isotopes,
    cellLines,
    mouseStrains,
    loading,
    errors,
    loadExperimentData,
  };
}
