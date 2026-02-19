import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiClient, handleApiError } from "@/lib/api";

export interface AddCellLineMouseStrainPayload {
  cellLineId: number;
  mouseStrainId: number;
}

export interface UseAddCellLineMouseStrainAssociationProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface UseAddCellLineMouseStrainAssociationReturn {
  addAssociation: (payload: AddCellLineMouseStrainPayload) => Promise<boolean>;
  isAdding: boolean;
  error: string | null;
}

export const useAddCellLineMouseStrainAssociation = (
  props?: UseAddCellLineMouseStrainAssociationProps
): UseAddCellLineMouseStrainAssociationReturn => {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (payload: AddCellLineMouseStrainPayload) => {
      return apiClient.patch(
        `/api/v1/cell-lines/${payload.cellLineId}/mouse-strain`,
        { mouse_strain_id: payload.mouseStrainId }
      );
    },
    retry: 0,
    onSuccess: () => {
      // Invalidate validation queries to refresh cached validation results
      queryClient.invalidateQueries({ queryKey: ["cell-line-validation"] });
      queryClient.invalidateQueries({ queryKey: ["cell-lines"] });
      queryClient.invalidateQueries({ queryKey: ["mouse-groups"] });

      props?.onSuccess?.();
    },
    onError: (error) => {
      const errorMessage = handleApiError(
        error,
        "Failed to add association. Please try again."
      );

      toast.error("Failed to add association", {
        description: errorMessage,
      });

      props?.onError?.(error as Error);
    },
  });

  const addAssociation = async (
    payload: AddCellLineMouseStrainPayload
  ): Promise<boolean> => {
    try {
      await addMutation.mutateAsync(payload);
      return true;
    } catch {
      return false;
    }
  };

  return {
    addAssociation,
    isAdding: addMutation.isPending,
    error: addMutation.error?.message || null,
  };
};
