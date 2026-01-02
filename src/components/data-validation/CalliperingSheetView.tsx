import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { DataTable } from "@/components/organisms/DataTable/DataTable";
import type {
  CalliperingData,
  CalliperingMouseRow,
} from "@/components/organisms/DataTable/tableData";
import { useExperimentDataByIdForCalliperingSheet } from "@/hooks/useExperimentDataById";

import { Label } from "../atoms";

const getReadOnlyCalliperingColumns = (): ColumnDef<CalliperingMouseRow>[] => [
  {
    accessorKey: "id",
    header: () => <span className="block lg:w-96">Mouse Delivery ID</span>,
    cell: ({ row }) => (
      <span className="font-medium text-center">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "length_mm",
    header: () => <span className="block lg:w-66">Length (mm)</span>,
    cell: ({ row }) => <span>{row.original.length_mm}</span>,
  },
  {
    accessorKey: "width_mm",
    header: () => <span className="block lg:w-66">Width (mm)</span>,
    cell: ({ row }) => <span>{row.original.width_mm}</span>,
  },
  {
    accessorKey: "volume_mm3",
    header: () => <span className="block lg:w-66">Volume (mm³)</span>,
    cell: ({ row }) => <span>{row.original.volume_mm3}</span>,
  },
];

interface CalliperingSheetViewProps {
  readonly data?: CalliperingData;
  readonly experimentDataId?: string;
}

export function CalliperingSheetView({
  data,
  experimentDataId,
}: Readonly<CalliperingSheetViewProps>) {
  const [viewData, setViewData] = useState<CalliperingData | null>(
    data || null
  );

  const {
    data: apiData,
    isLoading,
    error,
  } = useExperimentDataByIdForCalliperingSheet(experimentDataId || "");

  useEffect(() => {
    if (apiData && !data) {
      const transformedData: CalliperingData = {
        sex: apiData.uploaded_data.sex ?? "",
        strain: apiData.uploaded_data.strain ?? "",
        dob: apiData.uploaded_data.date_of_birth ?? "",
        cell_injection_date: apiData.uploaded_data.cell_inj_date ?? "",
        cell_line: apiData.uploaded_data.cell_line?.cell_line_name ?? "",
        treatment_date: apiData.uploaded_data.treatment_date ?? "",
        measurement_date: apiData.uploaded_data.measurement_date ?? "",
        mice:
          apiData.uploaded_data.calliper_measurements?.map((measurement) => ({
            id: measurement.mouse?.mouse_delivery_id ?? "",
            length_mm: measurement.length_mm ?? 0,
            width_mm: measurement.width_mm ?? 0,
            volume_mm3: measurement.volume_mm3 ?? 0,
          })) ?? [],
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
              { key: "cell_injection_date", label: "Cell Injection Date:" },
            ],
            [
              { key: "cell_line", label: "Cell Line:" },
              { key: "treatment_date", label: "Treatment Date:" },
              { key: "measurement_date", label: "Measurement Date:" },
            ],
          ].map((group) => (
            <div className="space-y-3" key={group[0].key}>
              {group.map(({ key, label }) => {
                const value = viewData[key as keyof CalliperingData];
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
      {viewData.mice && viewData.mice.length > 0 && (
        <div className="bg-white mt-4">
          <DataTable
            columns={getReadOnlyCalliperingColumns()}
            data={viewData.mice}
          />
        </div>
      )}
    </div>
  );
}
