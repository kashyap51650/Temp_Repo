import { ArrowDown, ArrowUp } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/atoms/Button/Button";
import { cn } from "@/lib/utils";

type SortableHeaderProps = {
  title: React.ReactNode;
  column: any; // tanstack Column instance
  className?: string;
  size?: "sm" | "md";
};

export function SortableHeader({
  title,
  column,
  className,
  size = "sm",
}: SortableHeaderProps) {
  const handleClick = () =>
    column.toggleSorting(column.getIsSorted() === "asc");

  return (
    <Button
      type="button"
      variant="ghost"
      size={size === "sm" ? "sm" : "default"}
      className={cn("px-0", className)}
      onClick={handleClick}
    >
      {title}
      <span className="inline-block w-4">
        {(() => {
          const sort = column.getIsSorted();
          const Icon = sort === "desc" ? ArrowDown : ArrowUp;
          const iconClass = sort ? "size-4 text-primary" : "size-4 opacity-40";
          return <Icon className={iconClass} />;
        })()}
      </span>
    </Button>
  );
}

export default SortableHeader;
