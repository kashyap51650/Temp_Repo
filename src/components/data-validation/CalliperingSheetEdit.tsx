import type { ColumnDef } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/molecules";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import type { CalliperingMouseRow } from "@/components/organisms/DataTable/tableData";
import { useCalliperingSheetEdit } from "@/hooks/useCalliperingSheetEdit";
import { calculateTumorVolume } from "@/lib/utils";
import type { CalliperingWorksheetEditData } from "@/types/callipering-sheet";

import { Input, Label } from "../atoms";

interface CalliperingSheetProps {
  onSave?: (data: CalliperingWorksheetEditData[]) => void;
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
  {
    accessorKey: "volume_mm3",
    header: "Volume (mm³)",
    cell: ({ row }) => (
      <span className="text-center font-mono">
        {row.original.volume_mm3?.toFixed(2) || "0.00"}
      </span>
    ),
  },
];

export function CalliperingSheetEdit({
  experimentDataId,
  onSave,
}: Readonly<CalliperingSheetProps>) {
  const [activeTab, setActiveTab] = useState<string>("0");

  // Business logic hook for editing
  const {
    worksheetData,
    handleMouseDataChange,
    getCurrentData,
    hasMultipleWorksheets,
    isLoading,
    error,
  } = useCalliperingSheetEdit(experimentDataId);

  // Call onSave when worksheetData changes
  useEffect(() => {
    if (onSave && worksheetData.size > 0) {
      const data = getCurrentData();
      onSave(data);
    }
  }, [worksheetData, onSave]);

  // Loading state
  if (isLoading && experimentDataId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading experiment data...</div>
      </div>
    );
  }

  // Error state
  if (error && experimentDataId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          Error loading experiment data. Please try again.
        </div>
      </div>
    );
  }

  // No worksheets - show empty state
  if (worksheetData.size === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">
          No worksheet data available.
        </div>
      </div>
    );
  }

  // Single worksheet view (no tabs)
  if (!hasMultipleWorksheets) {
    const worksheet = worksheetData.get(0)!;
    return (
      <div className="space-y-4 overflow-y-auto h-[calc(100%-5%)]">
        <WorksheetEditForm
          worksheet={worksheet}
          worksheetIndex={0}
          onMouseDataChange={handleMouseDataChange}
        />
      </div>
    );
  }

  // Multi-worksheet view (with tabs)
  return (
    <div className="space-y-4 overflow-y-auto ">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
          {Array.from(worksheetData.values()).map((worksheet, index) => (
            <TabsTrigger
              key={`${worksheet.worksheetName}-${index}`}
              value={index.toString()}
              className="whitespace-nowrap"
            >
              {worksheet.worksheetName}
            </TabsTrigger>
          ))}
        </TabsList>

        {Array.from(worksheetData.entries()).map(([index, worksheet]) => (
          <TabsContent
            key={`${worksheet.worksheetName}-${index}`}
            value={index.toString()}
          >
            <WorksheetEditForm
              worksheet={worksheet}
              worksheetIndex={index}
              onMouseDataChange={handleMouseDataChange}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface WorksheetEditFormProps {
  worksheet: CalliperingWorksheetEditData;
  worksheetIndex: number;
  onMouseDataChange: (
    worksheetIndex: number,
    updater: (
      prev: Array<{
        id: string;
        measurement_id?: number;
        length_mm: number;
        width_mm: number;
        volume_mm3: number;
      }>
    ) => Array<{
      id: string;
      measurement_id?: number;
      length_mm: number;
      width_mm: number;
      volume_mm3: number;
    }>
  ) => void;
}

function WorksheetEditForm({
  worksheet,
  worksheetIndex,
  onMouseDataChange,
}: Readonly<WorksheetEditFormProps>) {
  // Memoize header fields to prevent recreation on every render
  const headerFields = useMemo(
    () => [
      [
        { key: "sex", label: "Sex:" },
        { key: "strain", label: "Strain:" },
        { key: "dob", label: "DOB:" },
        {
          key: "cellInjectionDate",
          label: "Cell Injection Date:",
        },
      ],
      [
        { key: "cellLine", label: "Cell Line:" },
        { key: "treatmentDate", label: "Treatment Date:" },
        { key: "measurementDate", label: "Measurement Date:" },
      ],
    ],
    []
  );

  // Transform mice data for table display
  const mousePairRows = useMemo<CalliperingMouseRow[]>(() => {
    return worksheet.mice.map((mouse) => ({
      id: mouse.id,
      measurement_id: mouse.measurement_id,
      length_mm: mouse.length_mm,
      width_mm: mouse.width_mm,
      volume_mm3: mouse.volume_mm3,
      notes: null,
    }));
  }, [worksheet.mice]);

  // Handle mouse measurement changes
  const handleMouseChange = useCallback(
    (idx: number, key: keyof CalliperingMouseRow, value: string) => {
      onMouseDataChange(worksheetIndex, (prevMice) => {
        return prevMice.map((mouse, i) => {
          if (i === idx) {
            const updatedMouse = {
              ...mouse,
              [key]: key === "id" ? value : Number.parseFloat(value),
            };

            // Calculate volume automatically when length or width changes
            if (key === "length_mm" || key === "width_mm") {
              const length =
                key === "length_mm"
                  ? Number.parseFloat(value)
                  : updatedMouse.length_mm;
              const width =
                key === "width_mm"
                  ? Number.parseFloat(value)
                  : updatedMouse.width_mm;

              updatedMouse.volume_mm3 = calculateTumorVolume(length, width);
            }

            return updatedMouse;
          }
          return mouse;
        });
      });
    },
    [worksheetIndex, onMouseDataChange]
  );

  const editableColumns = useMemo(
    () => getEditableCalliperingColumns(handleMouseChange),
    [handleMouseChange]
  );

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-3">
          {headerFields.map((group, groupIndex) => (
            <div
              className="space-y-3"
              key={`group-${group?.[0]?.key}-${groupIndex}`}
            >
              {group.map(({ key, label }, index) => (
                <div
                  className="flex items-center gap-3"
                  key={`field-${key}-${index}`}
                >
                  <Label className="font-semibold text-sm w-56">{label}</Label>
                  <Input
                    value={
                      worksheet[
                        key as keyof CalliperingWorksheetEditData
                      ] as string
                    }
                    disabled
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {mousePairRows.length > 0 && (
        <div className="bg-white h-96">
          <DataTable columns={editableColumns} data={mousePairRows} />
        </div>
      )}
    </>
  );
}
