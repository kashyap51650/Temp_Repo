import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { DataTable } from "@/components/organisms/DataTable/DataTable";
import type {
  CalliperingData,
  CalliperingMouseRow,
} from "@/components/organisms/DataTable/tableData";
import { useExperimentDataByIdForCalliperingSheet } from "@/hooks/useExperimentDataById";
import { DATA_TYPE, STUDY_TYPE } from "@/lib/constants";

import {
  Button,
  Label,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../atoms";
import { NotesDialog } from "./NotesDialog";

export interface SelectedNoteType {
  mouse_delivery_id: string;
  id: number;
}

const getReadOnlyCalliperingColumns = ({
  shouldShowNotesColumn = false,
  onViewNotes,
}: {
  shouldShowNotesColumn?: boolean;
  onViewNotes: (note: SelectedNoteType) => void;
}): ColumnDef<CalliperingMouseRow>[] => [
  {
    accessorKey: "id",
    header: () => <span className="block lg:w-60">Mouse Delivery ID</span>,
    cell: ({ row }) => (
      <span className="font-medium text-center">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "length_mm",
    header: () => <span className="block lg:w-40">Length (mm)</span>,
    cell: ({ row }) => <span>{row.original.length_mm}</span>,
  },
  {
    accessorKey: "width_mm",
    header: () => <span className="block lg:w-40">Width (mm)</span>,
    cell: ({ row }) => <span>{row.original.width_mm}</span>,
  },
  {
    accessorKey: "volume_mm3",
    header: () => <span className="block lg:w-40">Volume (mm³)</span>,
    cell: ({ row }) => <span>{row.original.volume_mm3}</span>,
  },
  ...(shouldShowNotesColumn
    ? [
        {
          accessorKey: "notes",
          header: () => <span className="block lg:w-64">Notes</span>,
          cell: ({ row }: { row: { original: CalliperingMouseRow } }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={`m-auto text-left p-0 ${!row.original.notes ? "cursor-default" : ""}`}
                  size="sm"
                  onClick={() => {
                    if (row.original.notes && row.original.measurement_id) {
                      onViewNotes({
                        mouse_delivery_id: row.original.id,
                        id: row.original.measurement_id,
                      });
                    }
                  }}
                  disabled={!row.original.notes}
                  aria-label="View notes"
                >
                  <span className="w-48 block truncate">
                    {row.original.notes || "-"}
                  </span>
                </Button>
              </TooltipTrigger>
              {row.original.notes && (
                <TooltipContent align="start" className="max-w-xl">
                  <div className="space-y-2">
                    <p>{row.original.notes}</p>
                    <p className="text-xs text-muted-foreground italic border-t pt-2">
                      Click to view and add comments
                    </p>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          ),
        },
      ]
    : []),
];

interface CalliperingSheetViewProps {
  data?: CalliperingData;
  experimentDataId?: string;
  experimentDataType?: string;
  experimentStudyType?: string;
}

export function CalliperingSheetView({
  data,
  experimentDataId,
  experimentDataType,
  experimentStudyType,
}: Readonly<CalliperingSheetViewProps>) {
  const [viewData, setViewData] = useState<CalliperingData | null>(
    data || null
  );
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState<SelectedNoteType | null>(
    null
  );

  const handleViewNotes = (note: SelectedNoteType) => {
    setSelectedNote(note);
    setShowNotesDialog(true);
  };

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
            notes: measurement?.notes,
            measurement_id: measurement.id,
          })) ?? [],
      };
      setViewData(transformedData);
    } else if (data) {
      setViewData(data);
    }
  }, [apiData, data]);

  const shouldShowNotesColumn =
    experimentDataType === DATA_TYPE.CALLIPERING_SHEET &&
    experimentStudyType === STUDY_TYPE.MODEL_STUDY;

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
    <>
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
              columns={getReadOnlyCalliperingColumns({
                shouldShowNotesColumn,
                onViewNotes: handleViewNotes,
              })}
              data={viewData.mice}
            />
          </div>
        )}
      </div>
      <NotesDialog
        open={showNotesDialog}
        onOpenChange={setShowNotesDialog}
        noteData={selectedNote}
      />
    </>
  );
}
