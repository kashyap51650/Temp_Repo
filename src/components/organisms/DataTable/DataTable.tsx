import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";

import type { PaginationConfig, PaginationState } from "@/types/pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../Table/Table";
import { PaginationControls } from "./PaginationControls";

type DataTableProps<T extends { id: string | number }> = {
  columns: ColumnDef<T>[];
  data: T[];
  pageSize?: number;
  paginationState?: PaginationConfig;
};

export function DataTable<T extends { id: string | number }>(
  props: Readonly<DataTableProps<T>>
) {
  const {
    columns,
    data,
    pageSize = 10,
    paginationState = { mode: "none" },
  } = props;

  const isClientSidePagination = paginationState.mode === "client";
  const isServerSidePagination = paginationState.mode === "server";

  const [tableData, setTableData] = React.useState<T[]>(data);

  // Sync internal state with data prop changes
  React.useEffect(() => {
    setTableData(data);
  }, [data]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      ...(isClientSidePagination && {
        pagination,
      }),
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    ...(isClientSidePagination && { onPaginationChange: setPagination }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: isClientSidePagination
      ? getPaginationRowModel()
      : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: isServerSidePagination,
  });

  const paginationControls: PaginationState | null = isClientSidePagination
    ? {
        page: table.getState().pagination.pageIndex + 1,
        totalPages: table.getPageCount(),
        canNext: table.getCanNextPage(),
        canPrev: table.getCanPreviousPage(),
        onFirst: () => table.setPageIndex(0),
        onPrev: () => table.previousPage(),
        onNext: () => table.nextPage(),
        onLast: () => table.setPageIndex(table.getPageCount() - 1),
      }
    : isServerSidePagination
      ? {
          page: paginationState.currentPage,
          totalPages: paginationState.totalPages,
          canNext: paginationState.hasNextPage,
          canPrev: paginationState.hasPrevPage,
          onFirst: () => paginationState.onPageChange(1),
          onPrev: () =>
            paginationState.onPageChange(paginationState.currentPage - 1),
          onNext: () =>
            paginationState.onPageChange(paginationState.currentPage + 1),
          onLast: () =>
            paginationState.onPageChange(paginationState.totalPages),
        }
      : null;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setTableData((data) => {
        return data;
      });
    }
  }

  return (
    <div className="w-full flex-col justify-start gap-6">
      <div className="relative flex flex-col gap-4">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-6">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          {paginationControls && (
            <PaginationControls pagination={paginationControls} />
          )}
        </div>
      </div>
    </div>
  );
}
