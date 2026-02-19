import type { ColumnDef } from "@tanstack/react-table";

import { Badge, Label } from "@/components/atoms";
import { DataTable } from "@/components/organisms";
import { cn } from "@/lib";
import type {
  SaturationBindingAssaySheetRowData,
  TransformedWorksheetData,
} from "@/types/saturationBindingAssay";

interface WorksheetContentProps {
  worksheet: TransformedWorksheetData;
}

const getKdValueSheetColumns = ({
  nValue,
}: {
  nValue: number;
}): ColumnDef<SaturationBindingAssaySheetRowData>[] => {
  const hasAvgAndSd = nValue === 3;

  return [
    {
      accessorKey: "sample",
      header: () => <span className="block lg:w-40">Sample</span>,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.sample}</span>
      ),
      size: hasAvgAndSd ? undefined : 300,
    },
    {
      accessorKey: "measurements",
      header: () => (
        <span
          className={cn(
            "block lg:w-60",
            !hasAvgAndSd && "w-full lg:w-full text-center"
          )}
        >
          Non-specific binding subtracted wells (cells)
        </span>
      ),
      cell: ({ row }) => {
        const cells = row.original.measurements;

        return (
          <div
            className={cn(
              "flex flex-col gap-1.5 justify-center items-center",
              hasAvgAndSd && "max-w-60"
            )}
          >
            {!cells || cells.length === 0 ? (
              <span>-</span>
            ) : (
              cells.map((value, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="font-mono text-xs px-2 py-0.5"
                >
                  {value.toLocaleString()}
                </Badge>
              ))
            )}
          </div>
        );
      },
      size: hasAvgAndSd ? undefined : 600,
    },
    ...(hasAvgAndSd
      ? [
          {
            accessorKey: "average",
            header: () => <span className="block lg:w-32">Average</span>,
            cell: ({
              row,
            }: {
              row: { original: SaturationBindingAssaySheetRowData };
            }) => (
              <span className="font-medium">
                {row.original.average !== undefined &&
                row.original.average !== null
                  ? row.original.average.toFixed(1)
                  : "-"}
              </span>
            ),
          },
          {
            accessorKey: "sd",
            header: () => <span className="block lg:w-32">SD</span>,
            cell: ({
              row,
            }: {
              row: { original: SaturationBindingAssaySheetRowData };
            }) => (
              <span className="font-medium">
                {row.original.sd !== undefined && row.original.sd !== null
                  ? row.original.sd.toFixed(1)
                  : "-"}
              </span>
            ),
          },
        ]
      : []),
  ];
};

export function WorksheetContent({ worksheet }: WorksheetContentProps) {
  const hasAnyKdValues = worksheet.kdValues && worksheet.kdValues.length > 0;
  return (
    <div className="space-y-4">
      {/* Metadata section with N value and KD values */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {/* N Value Section */}
        <div
          className={cn(hasAnyKdValues && "mb-5 pb-5 border-b border-gray-200")}
        >
          <div className="flex items-center gap-3">
            <Label className="font-semibold text-base text-gray-800 min-w-[120px]">
              N Value (No of replica):
            </Label>
            <Badge variant="default" className="text-sm px-3 py-1">
              n = {worksheet.nValue}
            </Badge>
          </div>
        </div>

        {/* KD Values Section */}
        {hasAnyKdValues && (
          <div className="space-y-2">
            <Label className="font-semibold text-base text-gray-800 block mb-2">
              KD Values:
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              {worksheet.kdValues.map((kdValueObj, objIndex) => (
                <div
                  key={`${objIndex}-${kdValueObj.key}`}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm font-medium text-gray-700 min-w-[140px]">
                    {kdValueObj.key}:
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {String(kdValueObj.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Additional Metadata Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="space-y-4">
          {/* Isotope Name */}
          {worksheet.isotopeName && (
            <div className="flex items-center gap-3">
              <Label className="font-semibold text-base text-gray-800 min-w-[140px]">
                Isotope:
              </Label>
              <span className="text-sm font-semibold text-gray-900">
                {worksheet.isotopeName}
              </span>
            </div>
          )}

          {/* Peptide Cells */}
          {worksheet.peptideCells && (
            <div className="flex items-center gap-3">
              <Label className="font-semibold text-base text-gray-800 min-w-[140px]">
                Peptide Cells:
              </Label>
              <span className="text-sm font-semibold text-gray-900">
                {worksheet.peptideCells}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Measurements table */}
      {worksheet.saturationBindingData &&
        worksheet.saturationBindingData.length > 0 && (
          <div className="bg-white mt-4">
            <DataTable
              columns={getKdValueSheetColumns({ nValue: worksheet.nValue })}
              data={worksheet.saturationBindingData}
            />
          </div>
        )}
    </div>
  );
}
