import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/organisms/DataTable/DataTable";
import type { BioDWeightData } from "@/components/organisms/DataTable/tableData";

import { Label } from "../atoms";

interface MousePairRow {
  id: string;
  leftId: string;
  leftWeight: number;
  rightId?: string;
  rightWeight?: number;
}

const getReadOnlyMousePairColumns = (): ColumnDef<MousePairRow>[] => [
  {
    accessorKey: "leftId",
    header: "Mouse Delivery ID",
    cell: ({ row }) => (
      <span className="font-medium text-center">{row.original.leftId}</span>
    ),
  },
  {
    accessorKey: "leftWeight",
    header: "Body Weight (g)",
    cell: ({ row }) => <span>{row.original.leftWeight}</span>,
  },
  {
    accessorKey: "rightId",
    header: "Mouse Delivery ID",
    cell: ({ row }) =>
      row.original.rightId ? (
        <span className="font-medium text-center">{row.original.rightId}</span>
      ) : null,
  },
  {
    accessorKey: "rightWeight",
    header: "Body Weight (g)",
    cell: ({ row }) =>
      row.original.rightId ? <span>{row.original.rightWeight}</span> : null,
  },
];

interface BioDWeightSheetViewProps {
  data?: BioDWeightData;
}

export function BioDWeightSheetView({ data }: BioDWeightSheetViewProps) {
  if (!data) return null;
  return (
    <div className="space-y-4 overflow-y-auto h-[calc(100%-20%)]">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Label className="font-semibold text-sm w-56">Sex:</Label>
              <span className="flex-1">{data.sex}</span>
            </div>
            <div className="flex items-center gap-3">
              <Label className="font-semibold text-sm w-56">Strain:</Label>
              <span className="flex-1">{data.strain}</span>
            </div>
            <div className="flex items-center gap-3">
              <Label className="font-semibold text-sm w-56">DOB:</Label>
              <span className="flex-1">{data.dob}</span>
            </div>
            <div className="flex items-center gap-3">
              <Label className="font-semibold text-sm w-56">
                Cell Injection Date:
              </Label>
              <span className="flex-1">{data.cellInjectionDate}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Label className="font-semibold text-sm w-56">Cell Line:</Label>
              <span className="flex-1">{data.cellLine}</span>
            </div>
            <div className="flex items-center gap-3">
              <Label className="font-semibold text-sm w-56">
                Treatment Date:
              </Label>
              <span className="flex-1">{data.treatmentDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <Label className="font-semibold text-sm w-56">
                Measurement Date:
              </Label>
              <span className="flex-1">{data.measurementDate}</span>
            </div>
          </div>
        </div>
      </div>

      {data.mice && data.mice.length > 0 && (
        <div className="bg-white mt-4">
          <DataTable
            columns={getReadOnlyMousePairColumns()}
            data={Array.from({ length: Math.ceil(data.mice.length / 2) }).map(
              (_, idx) => {
                const left = data.mice[idx * 2];
                const right = data.mice[idx * 2 + 1];
                return {
                  id: left.id + (right ? `-${right.id}` : ""),
                  leftId: left.id,
                  leftWeight: left.bodyWeight,
                  rightId: right?.id,
                  rightWeight: right?.bodyWeight,
                };
              }
            )}
          />
        </div>
      )}
    </div>
  );
}
