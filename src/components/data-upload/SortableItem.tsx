import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/atoms/Button/Button";

interface SortableItemProps {
  id: string;
  index: number;
  groupName: string;
  onRemove: (id: string) => void;
}

export function SortableItem({
  id,
  index,
  groupName,
  onRemove,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? "var(--muted)" : undefined,
  };
  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 rounded-lg border bg-card border-border hover:border-muted-foreground/30"
    >
      <span
        className="flex items-center justify-center mr-2 cursor-grab"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-5 text-muted-foreground" />
      </span>
      <span className="flex items-center justify-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
        {index + 1}
      </span>
      <div className="flex-1 ml-5">
        <span className="text-xs text-muted-foreground font-medium mb-1 block">
          Group Name
        </span>
        <span className="text-sm font-semibold text-gray-900">{groupName}</span>
      </div>
      <Button
        variant={"ghost"}
        size="icon"
        className="ml-auto p-2"
        aria-label="Remove group"
        onClick={() => onRemove(id)}
      >
        <Trash2 className="text-red-400" />
      </Button>
    </li>
  );
}
