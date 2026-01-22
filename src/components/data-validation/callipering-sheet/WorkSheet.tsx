import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import {
  Button,
  Checkbox,
  Label,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/atoms";
import { DataTable } from "@/components/organisms";
import type { CalliperingMouseRow } from "@/types/callipering-sheet";

import type { SelectedNoteType } from "../CalliperingSheetView";

/**
 * Generate columns for read-only callipering measurements display
 */
const getReadOnlyCalliperingColumns = ({
  shouldShowNotesColumn = false,
  onViewNotes,
  enableRowSelection = false,
  selectedRowIds = new Set<string>(),
  onCheckboxChange,
  onSelectAll,
  allRowsCount = 0,
}: {
  shouldShowNotesColumn?: boolean;
  onViewNotes: (note: SelectedNoteType) => void;
  enableRowSelection?: boolean;
  selectedRowIds?: Set<string>;
  onCheckboxChange?: (id: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
  allRowsCount?: number;
}): ColumnDef<CalliperingMouseRow>[] => [
  ...(enableRowSelection
    ? [
        {
          id: "select",
          header: () => (
            <Checkbox
              checked={selectedRowIds.size === allRowsCount && allRowsCount > 0}
              onCheckedChange={(value) => onSelectAll?.(!!value)}
              aria-label="Select all"
            />
          ),
          cell: ({ row }: { row: { original: CalliperingMouseRow } }) => (
            <Checkbox
              checked={selectedRowIds.has(row.original.id)}
              onCheckedChange={(value) =>
                onCheckboxChange?.(row.original.id, !!value)
              }
              aria-label="Select row"
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
      ]
    : []),
  {
    accessorKey: "id",
    header: () => <span className="block lg:w-60">Mouse Delivery ID</span>,
    cell: ({ row }) => (
      <span className="font-medium text-center">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "length_mm",
    header: () => <span className="block lg:w-40">Length (mm)</span>,
    cell: ({ row }) => <span>{row.original.length_mm}</span>,
  },
  {
    accessorKey: "width_mm",
    header: () => <span className="block lg:w-40">Width (mm)</span>,
    cell: ({ row }) => <span>{row.original.width_mm}</span>,
  },
  {
    accessorKey: "volume_mm3",
    header: () => <span className="block lg:w-40">Volume (mm³)</span>,
    cell: ({ row }) => {
      return (
        <span
          className={
            row.original.is_flagged ? "text-red-600 font-semibold" : ""
          }
        >
          {row.original.volume_mm3}
        </span>
      );
    },
  },
  ...(shouldShowNotesColumn
    ? [
        {
          accessorKey: "notes",
          header: () => <span className="block lg:w-64">Notes</span>,
          cell: ({ row }: { row: { original: CalliperingMouseRow } }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={`m-auto text-left p-0 ${!row.original.notes ? "cursor-default" : ""}`}
                  size="sm"
                  onClick={() => {
                    if (row.original.notes && row.original.measurement_id) {
                      onViewNotes({
                        mouse_delivery_id: row.original.id,
                        id: row.original.measurement_id,
                      });
                    }
                  }}
                  disabled={!row.original.notes}
                  aria-label="View notes"
                >
                  <span className="w-48 block truncate">
                    {row.original.notes || "-"}
                  </span>
                </Button>
              </TooltipTrigger>
              {row.original.notes && (
                <TooltipContent align="start" className="max-w-xl">
                  <div className="space-y-2">
                    <p>{row.original.notes}</p>
                    <p className="text-xs text-muted-foreground italic border-t pt-2">
                      Click to view and add comments
                    </p>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          ),
        },
      ]
    : []),
];

/**
 * WorksheetContent Component
 *
 * Renders the content for a single worksheet including metadata and measurements table.
 * Extracted for reusability in both single and multi-worksheet views.
 */
interface WorksheetContentProps {
  worksheet: {
    sex: string;
    strain: string;
    dob: string;
    cellInjectionDate: string;
    cellLine: string;
    treatmentDate: string;
    measurementDate: string;
    mice: CalliperingMouseRow[];
  };
  shouldShowNotesColumn: boolean;
  enableRowSelection: boolean;
  onViewNotes: (note: SelectedNoteType) => void;
  onTerminateClick: (
    selectedRows: CalliperingMouseRow[],
    onSuccess?: () => void
  ) => void;
}

export function WorksheetContent({
  worksheet,
  shouldShowNotesColumn,
  enableRowSelection,
  onViewNotes,
  onTerminateClick,
}: WorksheetContentProps) {
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // Get actual selected rows based on IDs
  const selectedRows = worksheet.mice.filter((mouse) =>
    selectedRowIds.has(mouse.id)
  );

  const handleCheckboxChange = (mouseId: string, isSelected: boolean) => {
    setSelectedRowIds((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(mouseId);
      } else {
        newSet.delete(mouseId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedRowIds(new Set(worksheet.mice.map((m) => m.id)));
    } else {
      setSelectedRowIds(new Set());
    }
  };

  const handleTerminate = () => {
    if (selectedRows.length > 0) {
      onTerminateClick(selectedRows, () => {
        // Clear selection only after successful termination
        setSelectedRowIds(new Set());
      });
    }
  };

  // Create columns with selection handlers
  const columnsWithSelection = getReadOnlyCalliperingColumns({
    shouldShowNotesColumn,
    enableRowSelection,
    onViewNotes,
    selectedRowIds,
    onCheckboxChange: handleCheckboxChange,
    onSelectAll: handleSelectAll,
    allRowsCount: worksheet.mice.length,
  });

  const metadataFields = [
    [
      { key: "sex", label: "Sex:", value: worksheet.sex },
      { key: "strain", label: "Strain:", value: worksheet.strain },
      {
        key: "dob",
        label: "Date of Birth:",
        value: worksheet.dob,
      },
    ],
    [
      {
        key: "cellInjectionDate",
        label: "Cell Injection Date:",
        value: worksheet.cellInjectionDate,
      },
      { key: "cellLine", label: "Cell Line:", value: worksheet.cellLine },
    ],
    [
      {
        key: "treatmentDate",
        label: "Treatment Date:",
        value: worksheet.treatmentDate,
      },
      {
        key: "measurementDate",
        label: "Measurement Date:",
        value: worksheet.measurementDate,
      },
    ],
  ];

  return (
    <>
      {enableRowSelection && selectedRows.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted/50 border-b flex-shrink-0">
          <span className="text-sm font-medium">
            {selectedRows.length} {selectedRows.length === 1 ? "mouse" : "mice"}{" "}
            selected
          </span>
          <Button size="sm" onClick={handleTerminate} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Terminate Selected
          </Button>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-10">
          {metadataFields.map((group, groupIndex) => (
            <div className="space-y-3" key={groupIndex}>
              {group.map(({ key, label, value }) => (
                <div className="flex items-center gap-3" key={key}>
                  <Label className="font-semibold text-sm w-56">{label}</Label>
                  <span className="flex-1">{value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {worksheet.mice && worksheet.mice.length > 0 && (
        <div className="bg-white mt-4">
          <DataTable columns={columnsWithSelection} data={worksheet.mice} />
        </div>
      )}
    </>
  );
}
