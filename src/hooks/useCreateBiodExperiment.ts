import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  type BiodExperimentResponse,
  type CreateBiodExperimentPayload,
  experimentApi,
  handleApiError,
} from "../lib/api";

export interface UseCreateBiodExperimentProps {
  onSuccess?: (data: BiodExperimentResponse["data"]) => void;
  onError?: (error: Error) => void;
}

export const useCreateBiodExperiment = (
  props?: UseCreateBiodExperimentProps
) => {
  const queryClient = useQueryClient();

  const {
    mutate: createBiodExperiment,
    isPending,
    error,
  } = useMutation({
    mutationFn: (payload: CreateBiodExperimentPayload) =>
      experimentApi.createBiodExperiment(payload),
    retry: 0,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate related queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["experiments"] });
        queryClient.invalidateQueries({ queryKey: ["experiments-dropdown"] });

        toast.success("Biodistribution experiment created successfully", {
          description: `"${response.data.experiment_name}" has been created`,
        });

        props?.onSuccess?.(response.data);
      }
    },
    onError: (error) => {
      console.error("Error creating biodistribution experiment:", error);
      const errorMessage = handleApiError(
        error,
        "Failed to create biodistribution experiment"
      );
      toast.error(errorMessage);
      props?.onError?.(error);
    },
  });

  return {
    createBiodExperiment,
    isCreating: isPending,
    error: error,
  };
};
