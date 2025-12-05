import { useCallback, useState } from "react";

import { toast } from "@/components/atoms/Sonner/toast";

import {
  type CellLine,
  cellLineApi,
  handleApiError,
  type Isotope,
  isotopeApi,
  type MouseStrain,
  mouseStrainApi,
} from "../lib/api";

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
  clearExperimentData: () => void;
}

export function useExperimentData(): UseExperimentDataResult {
  const [isotopes, setIsotopes] = useState<Isotope[]>([]);
  const [cellLines, setCellLines] = useState<CellLine[]>([]);
  const [mouseStrains, setMouseStrains] = useState<MouseStrain[]>([]);

  const [loading, setLoading] = useState({
    isotopes: false,
    cellLines: false,
    mouseStrains: false,
  });

  const [errors, setErrors] = useState({
    isotopes: null as string | null,
    cellLines: null as string | null,
    mouseStrains: null as string | null,
  });

  const loadIsotopes = async () => {
    try {
      setLoading((prev) => ({ ...prev, isotopes: true }));
      setErrors((prev) => ({ ...prev, isotopes: null }));

      const response = await isotopeApi.getIsotopes();

      if (response.success) {
        setIsotopes(response.data);
      } else {
        const errorMessage = response.message || "Failed to load isotopes";
        setErrors((prev) => ({ ...prev, isotopes: errorMessage }));
        toast.error("Failed to load isotopes", {
          description: errorMessage,
        });
      }
    } catch (err) {
      const errorMessage = handleApiError(err, "Failed to load isotopes");
      setErrors((prev) => ({ ...prev, isotopes: errorMessage }));
      console.error("Error loading isotopes:", err);

      toast.error("Failed to load isotopes", {
        description: errorMessage,
      });
    } finally {
      setLoading((prev) => ({ ...prev, isotopes: false }));
    }
  };

  const loadCellLines = async () => {
    try {
      setLoading((prev) => ({ ...prev, cellLines: true }));
      setErrors((prev) => ({ ...prev, cellLines: null }));

      const response = await cellLineApi.getCellLines();

      if (response.success) {
        setCellLines(response.data);
      } else {
        const errorMessage = response.message || "Failed to load cell lines";
        setErrors((prev) => ({ ...prev, cellLines: errorMessage }));
        toast.error("Failed to load cell lines", {
          description: errorMessage,
        });
      }
    } catch (err) {
      const errorMessage = handleApiError(err, "Failed to load cell lines");
      setErrors((prev) => ({ ...prev, cellLines: errorMessage }));
      console.error("Error loading cell lines:", err);

      toast.error("Failed to load cell lines", {
        description: errorMessage,
      });
    } finally {
      setLoading((prev) => ({ ...prev, cellLines: false }));
    }
  };

  const loadMouseStrains = async () => {
    try {
      setLoading((prev) => ({ ...prev, mouseStrains: true }));
      setErrors((prev) => ({ ...prev, mouseStrains: null }));

      const response = await mouseStrainApi.getMouseStrains();

      if (response.success) {
        setMouseStrains(response.data);
      } else {
        const errorMessage = response.message || "Failed to load mouse strains";
        setErrors((prev) => ({ ...prev, mouseStrains: errorMessage }));
        toast.error("Failed to load mouse strains", {
          description: errorMessage,
        });
      }
    } catch (err) {
      const errorMessage = handleApiError(err, "Failed to load mouse strains");
      setErrors((prev) => ({ ...prev, mouseStrains: errorMessage }));
      console.error("Error loading mouse strains:", err);

      toast.error("Failed to load mouse strains", {
        description: errorMessage,
      });
    } finally {
      setLoading((prev) => ({ ...prev, mouseStrains: false }));
    }
  };

  const loadExperimentData = useCallback(async () => {
    await Promise.all([loadIsotopes(), loadCellLines(), loadMouseStrains()]);
  }, []);

  const clearExperimentData = useCallback(() => {
    setIsotopes([]);
    setCellLines([]);
    setMouseStrains([]);
    setErrors({
      isotopes: null,
      cellLines: null,
      mouseStrains: null,
    });
  }, []);

  return {
    isotopes,
    cellLines,
    mouseStrains,
    loading,
    errors,
    loadExperimentData,
    clearExperimentData,
  };
}
