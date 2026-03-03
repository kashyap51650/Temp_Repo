import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { API_CONFIG, apiClient } from "@/lib/api";
import type {
  CalliperingMouseRow,
  TerminateMicePayload,
  TerminateMiceResponse,
} from "@/types/callipering-sheet";

import { useModal } from "./useModal";

/**
 * API function to terminate mice
 */
const terminateMice = async (
  payload: TerminateMicePayload
): Promise<TerminateMiceResponse> => {
  const response = await apiClient.post<TerminateMiceResponse>(
    API_CONFIG.ENDPOINTS.MICE_TERMINATION.TERMINATE_MICE,
    payload
  );
  return response;
};

interface SelectedMice {
  ids: string[];
  measurementIds: string[];
  onClearSelection?: () => void;
}

/**
 * Custom hook for terminating mice with complete business logic
 *
 * Handles all termination-related state and logic including:
 * - Modal state management (open/close)
 * - Selected mice tracking (IDs and measurement IDs)
 * - Mutation for API call with automatic cache invalidation
 * - Toast notifications for success/error
 *
 * @param experimentDataId - ID of the experiment data to invalidate after termination
 * @param experimentId - ID of the experiment for API call
 * @returns Object with modal state, handlers, and loading state
 *
 * @example
 * ```tsx
 * const {
 *   isModalOpen,
 *   openModal,
 *   closeModal,
 *   selectedMice,
 *   handleTerminateClick,
 *   handleTerminateConfirm,
 *   isLoading,
 * } = useTerminateMice({ experimentDataId, experimentId });
 *
 * // When user selects mice and clicks terminate button
 * handleTerminateClick(selectedRows, onClearCallback);
 *
 * // When user confirms in modal with reason
 * handleTerminateConfirm(reason);
 * ```
 */
export function useTerminateMice({
  experimentDataId,
  experimentId,
}: {
  experimentDataId?: string;
  experimentId: number;
}) {
  const queryClient = useQueryClient();
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const [selectedMice, setSelectedMice] = useState<SelectedMice>({
    ids: [],
    measurementIds: [],
  });

  const mutation = useMutation({
    mutationFn: terminateMice,
    onSuccess: (data) => {
      toast.success(
        `Successfully terminated ${data.data?.terminated_count} ${
          data.data?.terminated_count === 1 ? "mouse" : "mice"
        }`
      );

      // Invalidate experiment data queries to refetch updated data
      if (experimentDataId) {
        queryClient.invalidateQueries({
          queryKey: ["experimentData", experimentDataId],
        });
        // Invalidate callipering sheet queries
        queryClient.invalidateQueries({
          queryKey: ["experimentData", "calliperingSheet", experimentDataId],
        });
      }

      // Close modal and clear selection
      closeModal();
      setSelectedMice({ ids: [], measurementIds: [] });

      // Call the onClearSelection callback if provided
      if (selectedMice.onClearSelection) {
        selectedMice.onClearSelection();
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to terminate mice");
    },
  });

  /**
   * Handle terminate button click - opens modal with selected mice
   * @param selectedRows - Array of selected mouse rows from the table
   * @param onClearSelection - Optional callback to clear selection after successful termination
   */
  const handleTerminateClick = (
    selectedRows: CalliperingMouseRow[],
    onClearSelection?: () => void
  ) => {
    const mouseIds = selectedRows.map((row) => row.mouseId.toString());
    const measurementIds = selectedRows.map((row) => row.id);
    setSelectedMice({ ids: mouseIds, measurementIds, onClearSelection });
    openModal();
  };

  /**
   * Handle termination confirmation from modal
   * @param reason - Termination reason entered by user
   */
  const handleTerminateConfirm = (reason: string) => {
    mutation.mutate({
      experiment_id: experimentId,
      mouse_ids: selectedMice.ids.map((id) => Number.parseInt(id, 10)),
      termination_reason: reason,
    });
  };

  return {
    // Modal state
    isModalOpen,
    openModal,
    closeModal,
    // Selected mice
    selectedMice,
    // Handlers
    handleTerminateClick,
    handleTerminateConfirm,
    // Loading state
    isLoading: mutation.isPending,
  };
}
