import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { calliperingNotesCommentsApi } from "@/lib/api";
import type {
  CreateCalliperingNotesCommentPayload,
  CreateCalliperingNotesCommentResponse,
} from "@/types/modelStudy";

interface UseCreateCalliperingNoteCommentProps {
  calliperMeasurementId: number;
  onSuccess?: (data: CreateCalliperingNotesCommentResponse) => void;
  onError?: (error: Error) => void;
}

export const useCreateCalliperingNoteComment = (
  props: UseCreateCalliperingNoteCommentProps
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CreateCalliperingNotesCommentPayload) =>
      await calliperingNotesCommentsApi.createNoteComment(payload),
    onSuccess: (data: CreateCalliperingNotesCommentResponse) => {
      queryClient.invalidateQueries({
        queryKey: ["callipering-notes-comments", props.calliperMeasurementId],
      });

      toast.success("Comment added successfully");

      props?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast.error("Failed to add comment", {
        description: error.message || "An error occurred while adding comment.",
      });

      props?.onError?.(error);
    },
  });

  return {
    createComment: mutation.mutate,
    isCreating: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};
