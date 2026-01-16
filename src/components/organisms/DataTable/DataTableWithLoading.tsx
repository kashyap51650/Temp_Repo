import type { ColumnDef } from "@tanstack/react-table";

import type { PaginationConfig } from "@/types/pagination";

import { DataTable } from "./DataTable";

interface DataTableWithLoadingProps<T extends { id: string }> {
  isLoading: boolean;
  isFetching: boolean;
  loadingText?: string;
  refreshingText?: string;
  columns: ColumnDef<T>[];
  data: T[];
  error?: Error | null;
  errorText?: string;
  paginationState?: PaginationConfig;
}

export function DataTableWithLoading<T extends { id: string }>({
  isLoading,
  isFetching,
  loadingText = "Loading...",
  refreshingText = "Refreshing...",
  columns,
  data,
  error,
  errorText = "Error loading data. Please try again later.",
  paginationState,
}: Readonly<DataTableWithLoadingProps<T>>) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p>{loadingText}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-500">{errorText}</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isFetching && !isLoading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <div className="bg-white px-4 py-2 rounded-lg shadow-md">
            <p className="text-sm text-gray-600">{refreshingText}</p>
          </div>
        </div>
      )}
      <DataTable
        columns={columns}
        data={data}
        paginationState={paginationState}
      />
    </div>
  );
}
