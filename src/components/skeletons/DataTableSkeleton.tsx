import { Card } from "@/components/atoms";
import { Skeleton } from "@/components/atoms/Skeleton/skeleton";

interface DataTableSkeletonProps {
  /** Number of columns to render */
  columns?: number;
  /** Number of rows to render (min 5 recommended) */
  rows?: number;
  /** Show table header skeleton */
  showHeader?: boolean;
}

export function DataTableSkeleton({
  columns = 7,
  rows = 5,
  showHeader = true,
}: DataTableSkeletonProps) {
  return (
    <Card className="p-4 space-y-4 shadow-none">
      {/* Header */}
      {showHeader && (
        <div
          className="grid gap-8 items-center border-b pb-6"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-5 w-full" />
          ))}
        </div>
      )}

      {/* Rows */}
      <div className="space-y-8">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}
