import { Send } from "lucide-react";

import { Input } from "../atoms";
import { Button } from "../atoms/Button/Button";
import { Dialog } from "../atoms/Dialog/Dialog";

export interface Note {
  author: string;
  timestamp: string;
  text: string;
}

export interface NotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotesDialog({ open, onOpenChange }: NotesDialogProps) {
  const staticNotes: Note[] = [
    {
      author: "Dr. Smith",
      timestamp: "2026-01-09 10:15",
      text: "Measurement looks consistent with previous entries.",
    },
    {
      author: "Lab Tech",
      timestamp: "2026-01-09 09:45",
      text: "Mouse was slightly agitated during measurement.",
    },
  ];
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      trigger={<span />}
      title={"Notes"}
      description={"View notes for this measurement entry"}
      showClose={true}
      className="max-w-lg"
    >
      <div className="flex gap-2 mb-4">
        <Input placeholder="Add a new note..." size="lg" className="w-full" />
        <Button size="lg" variant="default" className="px-4 py-2">
          <Send className="size-4" />
        </Button>
      </div>
      <div className="h-80 pr-4 overflow-y-auto">
        <div className="space-y-4">
          {staticNotes.length > 0 ? (
            staticNotes.map((note, idx) => (
              <div key={idx} className="p-3 border rounded-lg bg-muted/30">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm">{note.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {note.timestamp}
                  </span>
                </div>
                <p className="text-sm">{note.text}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No notes available for this entry.
            </div>
          )}
        </div>
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
