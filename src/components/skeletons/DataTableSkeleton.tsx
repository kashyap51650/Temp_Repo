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
}: Readonly<DataTableSkeletonProps>) {
  const columnIds = Array.from({ length: columns }, (_, i) => `col-${i}`);
  const rowIds = Array.from({ length: rows }, (_, i) => `row-${i}`);

  return (
    <Card className="p-4 space-y-4 shadow-none">
      {/* Header */}
      {showHeader && (
        <div
          className="grid gap-8 items-center border-b pb-6"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {columnIds.map((colId) => (
            <Skeleton key={`header-${colId}`} className="h-5 w-full" />
          ))}
        </div>
      )}

      {/* Rows */}
      <div className="space-y-8">
        {rowIds.map((rowId) => (
          <div
            key={`skeleton-${rowId}`}
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {columnIds.map((colId) => (
              <Skeleton
                key={`skeleton-${rowId}-${colId}`}
                className="h-4 w-full"
              />
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}
