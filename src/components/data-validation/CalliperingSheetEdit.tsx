import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/organisms/DataTable/DataTable";
import type {
  CalliperingData,
  CalliperingMouseRow,
} from "@/components/organisms/DataTable/tableData";
import useBulkUpdateCalliperMeasurements from "@/hooks/useBulkUpdateCalliperMeasurements";
import { useExperimentDataByIdForCalliperingSheet } from "@/hooks/useExperimentDataById";

import { Button, Input, Label } from "../atoms";

interface CalliperingMouseRowWithMeasurementId extends CalliperingMouseRow {
  measurement_id: number;
}

interface CalliperingSheetProps {
  data?: CalliperingData;
  onSave: (data: CalliperingData) => void;
  onCancel: () => void;
  experimentDataId?: string;
}

const getEditableCalliperingColumns = (
  onChange: (idx: number, key: keyof CalliperingMouseRow, value: string) => void
): ColumnDef<CalliperingMouseRow>[] => [
  {
    accessorKey: "id",
    header: () => <span className="block">Mouse Delivery ID</span>,
    cell: ({ row }) => (
      <span className="font-medium text-center">{row.original.id}</span>
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
  experimentDataId,
}: Readonly<CalliperingSheetProps>) {
  const [form, setForm] = useState<
    CalliperingData & { mice: CalliperingMouseRowWithMeasurementId[] }
  >({
    sex: "",
    strain: "",
    dob: "",
    cell_injection_date: "",
    cell_line: "",
    treatment_date: "",
    measurement_date: "",
    mice: [],
  });

  const [editedMeasurementIds, setEditedMeasurementIds] = useState<Set<number>>(
    new Set()
  );

  const bulkUpdateMutation = useBulkUpdateCalliperMeasurements();

  const {
    data: apiData,
    isLoading,
    error,
  } = useExperimentDataByIdForCalliperingSheet(experimentDataId || "");

  const handleMouseChange = useCallback(
    (idx: number, key: keyof CalliperingMouseRow, value: string) => {
      setForm((prev) => {
        const updatedMice = prev.mice.map((m, i) =>
          i === idx
            ? {
                ...m,
                [key]: key === "id" ? value : Number.parseFloat(value),
              }
            : m
        ) as CalliperingMouseRowWithMeasurementId[];

        const measurementId = prev.mice[idx]?.measurement_id;
        if (measurementId) {
          setEditedMeasurementIds((prevIds) =>
            new Set(prevIds).add(measurementId)
          );
        }

        return {
          ...prev,
          mice: updatedMice,
        };
      });
    },
    []
  );

  const editableColumns = useMemo(
    () => getEditableCalliperingColumns(handleMouseChange),
    [handleMouseChange]
  );

  useEffect(() => {
    if (apiData && !data) {
      const transformedData = {
        sex: apiData.uploaded_data.sex || "",
        strain: apiData.uploaded_data.strain || "",
        dob: apiData.uploaded_data.date_of_birth || "",
        cell_injection_date: apiData.uploaded_data.cell_inj_date || "",
        cell_line: apiData.uploaded_data.cell_line.cell_line_name || "",
        treatment_date: apiData.uploaded_data.treatment_date || "",
        measurement_date: apiData.uploaded_data.measurement_date || "",
        mice: apiData.uploaded_data.calliper_measurements.map(
          (measurement) => ({
            id: measurement.mouse.mouse_delivery_id,
            measurement_id: measurement.id,
            length_mm: measurement.length_mm,
            width_mm: measurement.width_mm,
          })
        ),
      };
      setForm(transformedData);
    } else if (data) {
      setForm(data as typeof form);
    }
  }, [apiData, data]);

  if (isLoading && experimentDataId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading experiment data...</div>
      </div>
    );
  }

  if (error && experimentDataId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          Error loading experiment data. Please try again.
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const measurements = form.mice
      .filter((mouse) =>
        editedMeasurementIds.has(
          (mouse as CalliperingMouseRowWithMeasurementId).measurement_id
        )
      )
      .map((mouse) => ({
        id: (mouse as CalliperingMouseRowWithMeasurementId).measurement_id,
        length_mm: mouse.length_mm,
        width_mm: mouse.width_mm,
      }));

    if (measurements.length === 0) {
      onSave(form);
      return;
    }

    bulkUpdateMutation.mutate(
      { measurements },
      {
        onSuccess: () => {
          onSave(form);
        },
      }
    );
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
          ].map((group) => (
            <div className="space-y-3" key={group[0].key}>
              {group.map(({ key, label }) => (
                <div className="flex items-center gap-3" key={key}>
                  <Label className="font-semibold text-sm w-56">{label}</Label>
                  <Input
                    value={form[key as keyof CalliperingData] as string}
                    disabled
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
            pagination={false}
            pageSize={100}
            columns={editableColumns}
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
