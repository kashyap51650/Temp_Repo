import { format } from "date-fns";
import { Send } from "lucide-react";
import { useRef, useState } from "react";

import { useCalliperingNoteComments } from "@/hooks/useCalliperingNoteComments";
import { useCreateCalliperingNoteComment } from "@/hooks/useCreateCalliperingNoteComment";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

import { Input } from "../atoms";
import { Button } from "../atoms/Button/Button";
import { Dialog } from "../atoms/Dialog/Dialog";
import type { SelectedNoteType } from "./CalliperingSheetView";

export interface Note {
  author: string;
  timestamp: string;
  text: string;
}

export interface NotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteData: SelectedNoteType | null;
}

export function NotesDialog({
  open,
  onOpenChange,
  noteData,
}: Readonly<NotesDialogProps>) {
  const [commentText, setCommentText] = useState("");
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useCalliperingNoteComments({
    calliperMeasurementId: noteData?.id || 0,
    params: { size: 10, desc: true },
    enabled: open && !!noteData?.id,
  });

  const { createComment, isCreating } = useCreateCalliperingNoteComment({
    calliperMeasurementId: noteData?.id || 0,
    onSuccess: () => {
      setCommentText("");
    },
  });

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    enabled: hasNextPage && !isFetchingNextPage,
  });

  const handleAddComment = () => {
    if (!commentText.trim() || !noteData?.id) return;

    createComment({
      caliper_measurement_id: noteData.id,
      comment: commentText.trim(),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  if (!noteData) {
    return null;
  }

  const renderCommentsContent = () => {
    if (isLoading) {
      return (
        <div className="text-center text-muted-foreground py-8">
          Loading comments...
        </div>
      );
    }

    if (comments.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-8">
          No notes available for this entry.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-3 border rounded-lg bg-muted/30">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-sm">
                {comment.creator.first_name} {comment.creator.last_name}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(comment.created_at), "MMM dd, yyyy HH:mm")}
              </span>
            </div>
            <p className="text-sm break-words">{comment.comment}</p>
          </div>
        ))}

        {hasNextPage && (
          <div ref={loadMoreRef} className="py-4 text-center">
            {isFetchingNextPage ? (
              <span className="text-sm text-muted-foreground">
                Loading more comments...
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">
                Scroll for more
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      trigger={<span />}
      title={`Notes - ${noteData.mouse_delivery_id}`}
      description={"View and add notes for this measurement entry"}
      showClose={true}
      className="max-w-lg"
    >
      <div className="flex gap-2 pb-4 border-b">
        <Input
          placeholder="Add a new note..."
          size="lg"
          className="w-full"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isCreating}
        />
        <Button
          size="lg"
          variant="default"
          className="px-4 py-2"
          aria-label="Add note"
          onClick={handleAddComment}
          disabled={!commentText.trim() || isCreating}
        >
          {isCreating ? (
            <div
              role="status"
              aria-live="polite"
              className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </div>
      <div className="h-80 pr-2 overflow-y-auto mt-4">
        {renderCommentsContent()}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          aria-label="Close notes dialog"
        >
          Close
        </Button>
      </div>
    </Dialog>
  );
}

NotesDialog.displayName = "NotesDialog";
