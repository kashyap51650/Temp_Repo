import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

import { Label } from "@/components/atoms";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/molecules";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import { useBioDWeightSheetData } from "@/hooks/useBioDWeightSheetData";
import { type ExperimentDataForWeightSheetResponse } from "@/hooks/useExperimentDataById";
import type {
  MousePairRow,
  TransformedWorksheetData,
} from "@/types/weight-sheet";

/**
 * Generate columns for read-only mouse pair display
 */
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

/**
 * Transform mice data to pairs for table display
 */
const transformMiceToPairs = (
  mice: TransformedWorksheetData["mice"]
): MousePairRow[] => {
  return Array.from({
    length: Math.ceil(mice.length / 2),
  }).map((_, idx) => {
    const left = mice[idx * 2];
    const right = mice[idx * 2 + 1];
    return {
      id: left.id + (right ? `-${right.id}` : ""),
      leftId: left.id,
      leftWeight: left.bodyWeight,
      rightId: right?.id,
      rightWeight: right?.bodyWeight,
    };
  });
};

interface BioDWeightSheetViewProps {
  experimentDataId?: string;
  apiData: ExperimentDataForWeightSheetResponse | undefined;
  isLoading: boolean;
  error: Error | null;
}

/**
 * BioDWeightSheetView - Multi-worksheet tab view component
 * Displays body weight measurements across multiple worksheets with tabbed navigation
 */
export function BioDWeightSheetView({
  experimentDataId,
  apiData,
  isLoading,
  error,
}: Readonly<BioDWeightSheetViewProps>) {
  const [activeTab, setActiveTab] = useState("0");

  // Transform API data using custom hook
  const { worksheets, hasMultipleWorksheets } = useBioDWeightSheetData(apiData);

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

  // No data state
  if (!worksheets || worksheets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">
          No worksheet data available.
        </div>
      </div>
    );
  }

  // Single worksheet view (no tabs needed)
  if (!hasMultipleWorksheets) {
    return <WorksheetContent worksheet={worksheets[0]} />;
  }

  // Multiple worksheets view with tabs
  return (
    <div className="space-y-4 overflow-y-auto h-[calc(100%-5%)]">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {worksheets.map((worksheet, index) => (
            <TabsTrigger
              key={index}
              value={index.toString()}
              className="text-sm"
            >
              {worksheet.worksheetName}
            </TabsTrigger>
          ))}
        </TabsList>

        {worksheets.map((worksheet, index) => (
          <TabsContent key={index} value={index.toString()}>
            <WorksheetContent worksheet={worksheet} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

/**
 * WorksheetContent - Displays individual worksheet data
 */
interface WorksheetContentProps {
  worksheet: TransformedWorksheetData;
}

function WorksheetContent({ worksheet }: Readonly<WorksheetContentProps>) {
  return (
    <div className="space-y-4">
      {/* Metadata section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-10">
          {[
            {
              id: "left-column",
              fields: [
                { key: "sex", label: "Sex:" },
                { key: "strain", label: "Strain:" },
                { key: "dob", label: "DOB:" },
                { key: "cellInjectionDate", label: "Cell Injection Date:" },
              ],
            },
            {
              id: "right-column",
              fields: [
                { key: "cellLine", label: "Cell Line:" },
                { key: "treatmentDate", label: "Treatment Date:" },
                { key: "measurementDate", label: "Measurement Date:" },
              ],
            },
          ].map((group) => (
            <div className="space-y-3" key={group.id}>
              {group.fields.map(({ key, label }) => {
                const value = worksheet[key as keyof TransformedWorksheetData];
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

      {/* Measurements table */}
      {worksheet.mice && worksheet.mice.length > 0 && (
        <div className="bg-white mt-4">
          <DataTable
            columns={getReadOnlyMousePairColumns()}
            data={transformMiceToPairs(worksheet.mice)}
          />
        </div>
      )}
    </div>
  );
}
