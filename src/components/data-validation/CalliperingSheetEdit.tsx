import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

import { DataTable } from "@/components/organisms/DataTable/DataTable";
import type {
  CalliperingData,
  CalliperingMouseRow,
} from "@/components/organisms/DataTable/tableData";

import { Button, Input, Label } from "../atoms";

interface CalliperingSheetProps {
  data?: CalliperingData;
  onSave: (data: CalliperingData) => void;
  onCancel: () => void;
}

const getEditableCalliperingColumns = (
  onChange: (idx: number, key: keyof CalliperingMouseRow, value: string) => void
): ColumnDef<CalliperingMouseRow>[] => [
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
    cell: ({ row }) => (
      <Input
        type="number"
        value={row.original.length_mm}
        min={0}
        step={0.1}
        className="w-full"
        onChange={(e) => onChange(row.index, "length_mm", e.target.value)}
      />
    ),
  },
  {
    accessorKey: "width_mm",
    header: "Width (mm)",
    cell: ({ row }) => (
      <Input
        type="number"
        value={row.original.width_mm}
        min={0}
        step={0.1}
        className="w-full"
        onChange={(e) => onChange(row.index, "width_mm", e.target.value)}
      />
    ),
  },
];

export function CalliperingSheetEdit({
  data,
  onSave,
  onCancel,
}: CalliperingSheetProps) {
  const [form, setForm] = useState<CalliperingData>(
    data || {
      sex: "",
      strain: "",
      dob: "",
      cell_injection_date: "",
      cell_line: "",
      treatment_date: "",
      measurement_date: "",
      mice: [],
    }
  );

  const handleFieldChange = (key: keyof CalliperingData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleMouseChange = (
    idx: number,
    key: keyof CalliperingMouseRow,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      mice: prev.mice.map((m, i) =>
        i === idx
          ? { ...m, [key]: key === "id" ? value : parseFloat(value) }
          : m
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form
      className="space-y-6 overflow-y-auto h-full flex flex-col"
      onSubmit={handleSubmit}
    >
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
              {group.map(({ key, label }) => (
                <div className="flex items-center gap-3" key={key}>
                  <Label className="font-semibold text-sm w-56">{label}</Label>
                  <Input
                    value={form[key as keyof CalliperingData] as string}
                    onChange={(e) =>
                      handleFieldChange(
                        key as keyof CalliperingData,
                        e.target.value
                      )
                    }
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {form.mice && form.mice.length > 0 && (
        <div className="bg-white mt-4">
          <DataTable
            columns={getEditableCalliperingColumns(handleMouseChange)}
            data={form.mice}
          />
        </div>
      )}
      <div className="flex gap-2 justify-end mt-auto">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
