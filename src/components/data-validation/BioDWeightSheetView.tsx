import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { DataTable } from "@/components/organisms/DataTable/DataTable";
import type { BioDWeightData } from "@/components/organisms/DataTable/tableData";
import { useExperimentDataByIdForWeightSheet } from "@/hooks/useExperimentDataById";

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
    header: () => <span className="block lg:w-72">Mouse Delivery ID</span>,
    cell: ({ row }) => (
      <span className="font-medium text-center">{row.original.leftId}</span>
    ),
  },
  {
    accessorKey: "leftWeight",
    header: () => <span className="block lg:w-72">Body Weight (g)</span>,
    cell: ({ row }) => (
      <div className="flex items-stretch h-full min-h-12">
        <div className="border-r border-gray-200 h-auto flex items-center w-full">
          {row.original.leftWeight}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "rightId",
    header: () => <span className="lg:w-72 block">Mouse Delivery ID</span>,
    cell: ({ row }) =>
      row.original.rightId ? (
        <span className="font-medium text-center">{row.original.rightId}</span>
      ) : null,
  },
  {
    accessorKey: "rightWeight",
    header: () => <span className="block lg:w-72">Body Weight (g)</span>,
    cell: ({ row }) =>
      row.original.rightId ? <span>{row.original.rightWeight}</span> : null,
  },
];

interface BioDWeightSheetViewProps {
  data?: BioDWeightData;
  experimentDataId?: string;
}

export function BioDWeightSheetView({
  data,
  experimentDataId,
}: BioDWeightSheetViewProps) {
  const [viewData, setViewData] = useState<BioDWeightData | null>(data || null);

  const {
    data: apiData,
    isLoading,
    error,
  } = useExperimentDataByIdForWeightSheet(experimentDataId || "");

  useEffect(() => {
    if (apiData && !data) {
      const transformedData: BioDWeightData = {
        sex: apiData.uploaded_data.sex || "",
        strain: apiData.uploaded_data.strain || "",
        dob: apiData.uploaded_data.date_of_birth || "",
        cellInjectionDate: apiData.uploaded_data.cell_inj_date || "",
        cellLine: apiData.uploaded_data.cell_line.cell_line_name || "",
        treatmentDate: apiData.uploaded_data.treatment_date || "",
        measurementDate: apiData.uploaded_data.measurement_date || "",
        mice: apiData.uploaded_data.body_weight_measurements.map(
          (measurement) => ({
            id: measurement.mouse.mouse_delivery_id,
            bodyWeight: measurement.body_weight_grams,
          })
        ),
      };
      setViewData(transformedData);
    } else if (data) {
      setViewData(data);
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

  if (!viewData) return null;

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
                const value = viewData[key as keyof BioDWeightData];
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

      {viewData.mice && viewData.mice.length > 0 && (
        <div className="bg-white mt-4">
          <DataTable
            pagination={false}
            columns={getReadOnlyMousePairColumns()}
            data={Array.from({
              length: Math.ceil(viewData.mice.length / 2),
            }).map((_, idx) => {
              const left = viewData.mice[idx * 2];
              const right = viewData.mice[idx * 2 + 1];
              return {
                id: left.id + (right ? `-${right.id}` : ""),
                leftId: left.id,
                leftWeight: left.bodyWeight,
                rightId: right?.id,
                rightWeight: right?.bodyWeight,
              };
            })}
          />
        </div>
      )}
    </div>
  );
}
