import { type Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";

import { Button } from "../../atoms";

interface SortableHeaderProps<T> {
  column: Column<T>;
  title: string;
  className?: string;
}

export function SortableHeader<T>({
  column,
  title,
  className = "",
}: Readonly<SortableHeaderProps<T>>) {
  if (!column.getCanSort()) {
    return <span className={className}>{title}</span>;
  }

  const handleSort = () => {
    column.toggleSorting(column.getIsSorted() === "asc");
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={`flex items-center gap-1 group text-left px-0 hover:bg-transparent ${className}`}
      onClick={handleSort}
    >
      {title}
      <span className="inline-block w-4">
        {column.getIsSorted() === "asc" && (
          <ArrowUp className="size-4 text-primary" />
        )}
        {column.getIsSorted() === "desc" && (
          <ArrowDown className="size-4 text-primary" />
        )}
        {!column.getIsSorted() && (
          <ArrowUp className="size-4 opacity-40 group-hover:opacity-60 transition-opacity" />
        )}
      </span>
    </Button>
  );
}
export default SortableHeader;
