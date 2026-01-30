import type { ColumnDef, Row } from "@tanstack/react-table";
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
import { STUDY_TYPE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type {
  MousePairRow,
  TransformedWorksheetData,
} from "@/types/weight-sheet";
import { getWeightColumnColor } from "@/utils/tableUtils";

/**
 * Generate columns for read-only mouse pair display
 */
const getReadOnlyMousePairColumns = ({
  showPercentChangeColumn,
  showFlaggedWeightColor,
}: {
  showPercentChangeColumn: boolean;
  showFlaggedWeightColor: boolean;
}): ColumnDef<MousePairRow>[] => {
  const headerClassName = showPercentChangeColumn
    ? "block lg:w-52"
    : "block lg:w-72";

  return [
    {
      accessorKey: "leftId",
      header: () => <span className={headerClassName}>Mouse Delivery ID</span>,
      cell: ({ row }) => (
        <span className="font-medium text-center">{row.original.leftId}</span>
      ),
    },
    {
      accessorKey: "leftWeight",
      header: () => <span className={headerClassName}>Body Weight (g)</span>,
      cell: ({ row }) => (
        <div className="flex items-stretch h-full min-h-12">
          <div
            className={cn(
              "border-gray-200 h-auto flex items-center w-full",
              showPercentChangeColumn ? "" : "border-r",
              showFlaggedWeightColor &&
                getWeightColumnColor({
                  isFlagged: row.original.isLeftFlagged,
                  percentageChange: row.original.leftPercentageChange,
                })
            )}
          >
            {row.original.leftWeight}
          </div>
        </div>
      ),
    },
    ...(showPercentChangeColumn
      ? [
          {
            accessorKey: "leftPercentageChange",
            header: () => (
              <span className={headerClassName}>Percentage Change</span>
            ),
            cell: ({ row }: { row: Row<MousePairRow> }) => (
              <div className="flex items-stretch h-full min-h-12">
                <div
                  className={`border-r border-gray-200 h-auto flex items-center w-full`}
                >
                  {row.original.leftPercentageChange !== undefined &&
                    `${row.original.leftPercentageChange}%`}
                </div>
              </div>
            ),
          },
        ]
      : []),
    {
      accessorKey: "rightId",
      header: () => <span className={headerClassName}>Mouse Delivery ID</span>,
      cell: ({ row }) =>
        row.original.rightId ? (
          <span className="font-medium text-center">
            {row.original.rightId}
          </span>
        ) : null,
    },
    {
      accessorKey: "rightWeight",
      header: () => <span className={headerClassName}>Body Weight (g)</span>,
      cell: ({ row }) =>
        row.original.rightId ? (
          <span
            className={cn(
              showFlaggedWeightColor &&
                getWeightColumnColor({
                  isFlagged: row.original.isRightFlagged,
                  percentageChange: row.original.rightPercentageChange,
                })
            )}
          >
            {row.original.rightWeight}
          </span>
        ) : null,
    },
    ...(showPercentChangeColumn
      ? [
          {
            accessorKey: "rightPercentageChange",
            header: () => (
              <span className={headerClassName}>Percentage Change</span>
            ),
            cell: ({ row }: { row: Row<MousePairRow> }) => (
              <span>
                {row.original.rightPercentageChange !== undefined &&
                  `${row.original.rightPercentageChange}%`}
              </span>
            ),
          },
        ]
      : []),
  ];
};

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
      isLeftFlagged: left?.isFlagged,
      leftPercentageChange: left?.percentageChange,
      rightId: right?.id,
      rightWeight: right?.bodyWeight,
      isRightFlagged: right?.isFlagged,
      rightPercentageChange: right?.percentageChange,
    };
  });
};

interface BioDWeightSheetViewProps {
  experimentDataId?: string;
  apiData: ExperimentDataForWeightSheetResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  experimentStudyType: string;
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
  experimentStudyType,
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
    return (
      <div className="space-y-4 overflow-y-auto h-[calc(100%-5%)]">
        <WorksheetContent
          worksheet={worksheets[0]}
          experimentStudyType={experimentStudyType}
        />
      </div>
    );
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
            <WorksheetContent
              worksheet={worksheet}
              experimentStudyType={experimentStudyType}
            />
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
  experimentStudyType: string;
}

function WorksheetContent({
  worksheet,
  experimentStudyType,
}: Readonly<WorksheetContentProps>) {
  const isDoseRangeFinding =
    experimentStudyType === STUDY_TYPE.DOSE_RANGE_FINDING;
  const showPercentChangeColumn = isDoseRangeFinding;
  const showFlaggedWeightColor = isDoseRangeFinding;
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
            columns={getReadOnlyMousePairColumns({
              showFlaggedWeightColor,
              showPercentChangeColumn,
            })}
            data={transformMiceToPairs(worksheet.mice)}
          />
        </div>
      )}
    </div>
  );
}
