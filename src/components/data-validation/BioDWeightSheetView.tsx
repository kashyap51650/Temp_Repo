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
    header: () => <span className="w-80 block">Mouse Delivery ID</span>,
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
    header: () => <span className="w-80 block">Mouse Delivery ID</span>,
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
          {[
            [
              { key: "sex", label: "Sex:" },
              { key: "strain", label: "Strain:" },
              { key: "dob", label: "DOB:" },
              { key: "cellInjectionDate", label: "Cell Injection Date:" },
            ],
            [
              { key: "cellLine", label: "Cell Line:" },
              { key: "treatmentDate", label: "Treatment Date:" },
              { key: "measurementDate", label: "Measurement Date:" },
            ],
          ].map((group, groupIdx) => (
            <div className="space-y-3" key={groupIdx}>
              {group.map(({ key, label }) => {
                const value = data[key as keyof BioDWeightData];
                if (typeof value !== "string") return null;
                return (
                  <div className="flex items-center gap-3" key={key}>
                    <Label className="font-semibold text-sm w-56">
                      {label}
                    </Label>
                    <span className="flex-1">{value}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {data.mice && data.mice.length > 0 && (
        <div className="bg-white mt-4">
          <DataTable
            pagination={false}
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
