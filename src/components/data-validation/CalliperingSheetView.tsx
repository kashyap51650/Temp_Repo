import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/organisms/DataTable/DataTable";
import type { CalliperingData } from "@/components/organisms/DataTable/tableData";

import { Label } from "../atoms";

interface CalliperingMouseRow {
  id: string;
  length_mm: number;
  width_mm: number;
}

const getReadOnlyCalliperingColumns = (): ColumnDef<CalliperingMouseRow>[] => [
  {
    accessorKey: "id",
    header: () => <span className="w-96 block">Mouse Delivery ID</span>,
    cell: ({ row }) => (
      <span className="font-medium text-center w-96">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "length_mm",
    header: "Length (mm)",
    cell: ({ row }) => <span>{row.original.length_mm}</span>,
  },
  {
    accessorKey: "width_mm",
    header: "Width (mm)",
    cell: ({ row }) => <span>{row.original.width_mm}</span>,
  },
];

interface CalliperingSheetViewProps {
  data?: CalliperingData;
}

export function CalliperingSheetView({ data }: CalliperingSheetViewProps) {
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
              { key: "cell_injection_date", label: "Cell Injection Date:" },
            ],
            [
              { key: "cell_line", label: "Cell Line:" },
              { key: "treatment_date", label: "Treatment Date:" },
              { key: "measurement_date", label: "Measurement Date:" },
            ],
          ].map((group, groupIdx) => (
            <div className="space-y-3" key={groupIdx}>
              {group.map(({ key, label }) => {
                const value = data[key as keyof CalliperingData];
                // Only render if value is a string (not the mice array)
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
            columns={getReadOnlyCalliperingColumns()}
            data={data.mice}
          />
        </div>
      )}
    </div>
  );
}
