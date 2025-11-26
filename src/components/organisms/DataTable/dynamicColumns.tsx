import type { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/atoms/Button/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/molecules/DropdownMenu/DropdownMenu";
import type { MasterDataItem } from "@/hooks/useMasterData";
import { formatFieldLabel } from "@/lib/utils";

export type TableDataItem = Omit<MasterDataItem, "id"> & { id: string };

export const createDynamicMasterDataColumns = (
  data: TableDataItem[],
  onEdit: (item: TableDataItem) => void,
  onDelete: (item: TableDataItem) => void
): ColumnDef<TableDataItem>[] => {
  if (data.length === 0) return [];

  const excludedKeys = [
    "id",
    "created_by",
    "updated_by",
    "created_at",
    "updated_at",
    "creator",
    "updator",
    "createdBy",
    "updatedBy",
  ];
  const sampleItem = data[0];
  const dynamicKeys = Object.keys(sampleItem).filter(
    (key) => !excludedKeys.includes(key)
  );

  const dynamicColumns: ColumnDef<TableDataItem>[] = dynamicKeys.map((key) => ({
    accessorKey: key,
    header: formatFieldLabel(key),
    cell: ({ row }) => {
      const value = row.getValue(key);
      return <div className="capitalize">{String(value)}</div>;
    },
  }));

  const commonColumns: ColumnDef<TableDataItem>[] = [
    {
      accessorKey: "createdBy",
      header: "CreatedBy",
      cell: ({ row }) => {
        const email = row.getValue("createdBy");
        return <div className="text-sm">{String(email)}</div>;
      },
    },
    {
      accessorKey: "updatedBy",
      header: "UpdatedBy",
      cell: ({ row }) => {
        const email = row.getValue("updatedBy");
        return <div className="text-sm">{String(email)}</div>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("updated_at"));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(item)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return [...dynamicColumns, ...commonColumns];
};
