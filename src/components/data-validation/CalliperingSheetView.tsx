import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

import {
  Button,
  Label,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/atoms";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/molecules";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import { useCalliperingSheetData } from "@/hooks/useCalliperingSheetData";
import { DATA_TYPE, STUDY_TYPE } from "@/lib/constants";
import type {
  CalliperingMouseRow,
  CalliperingSheetApiResponse,
} from "@/types/callipering-sheet";

import { NotesDialog } from "./NotesDialog";

export interface SelectedNoteType {
  mouse_delivery_id: string;
  id: number;
}

/**
 * Generate columns for read-only callipering measurements display
 */
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
  experimentDataId?: string;
  experimentDataType?: string;
  experimentStudyType?: string;
  apiData?: CalliperingSheetApiResponse | undefined;
  isLoading?: boolean;
  error?: Error | null;
}

/**
 * CalliperingSheetView Component
 *
 * Displays callipering measurement data with multi-worksheet tab support.
 * Shows metadata (sex, strain, DOB, etc.) and a table of measurements per worksheet.
 *
 * @param experimentDataId - ID to fetch experiment data from API
 * @param experimentDataType - Type of experiment data
 * @param experimentStudyType - Study type (e.g., MODEL_STUDY)
 * @param apiData - Pre-fetched API data for the callipering sheet
 * @param isLoading - Loading state for the API data
 * @param error - Error state for the API data
 */
export function CalliperingSheetView({
  experimentDataId,
  experimentDataType,
  experimentStudyType,
  apiData,
  isLoading,
  error,
}: Readonly<CalliperingSheetViewProps>) {
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState<SelectedNoteType | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<string>("0");

  const handleViewNotes = (note: SelectedNoteType) => {
    setSelectedNote(note);
    setShowNotesDialog(true);
  };

  // Fetch experiment data from API

  // Transform API data into component-friendly format
  const { worksheets, hasMultipleWorksheets } =
    useCalliperingSheetData(apiData);

  // Determine if notes column should be shown
  const shouldShowNotesColumn =
    experimentDataType === DATA_TYPE.CALLIPERING_SHEET &&
    experimentStudyType === STUDY_TYPE.MODEL_STUDY;

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
  if (!worksheets.length) {
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
    const worksheet = worksheets[0];
    return (
      <>
        <div className="space-y-4 overflow-y-auto h-[calc(100%-5%)]">
          <WorksheetContent
            worksheet={worksheet}
            shouldShowNotesColumn={shouldShowNotesColumn}
            onViewNotes={handleViewNotes}
          />
        </div>
        <NotesDialog
          open={showNotesDialog}
          onOpenChange={setShowNotesDialog}
          noteData={selectedNote}
        />
      </>
    );
  }

  // Multi-worksheet view (with tabs)
  return (
    <>
      <div className="space-y-4 overflow-y-auto h-[calc(100%-5%)]">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
            {worksheets.map((worksheet, index) => (
              <TabsTrigger
                key={index}
                value={index.toString()}
                className="whitespace-nowrap"
              >
                {worksheet.worksheetName}
              </TabsTrigger>
            ))}
          </TabsList>

          {worksheets.map((worksheet, index) => (
            <TabsContent key={index} value={index.toString()}>
              <WorksheetContent
                worksheet={worksheet}
                shouldShowNotesColumn={shouldShowNotesColumn}
                onViewNotes={handleViewNotes}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
      <NotesDialog
        open={showNotesDialog}
        onOpenChange={setShowNotesDialog}
        noteData={selectedNote}
      />
    </>
  );
}

/**
 * WorksheetContent Component
 *
 * Renders the content for a single worksheet including metadata and measurements table.
 * Extracted for reusability in both single and multi-worksheet views.
 */
interface WorksheetContentProps {
  worksheet: {
    sex: string;
    strain: string;
    dob: string;
    cellInjectionDate: string;
    cellLine: string;
    treatmentDate: string;
    measurementDate: string;
    mice: CalliperingMouseRow[];
  };
  shouldShowNotesColumn: boolean;
  onViewNotes: (note: SelectedNoteType) => void;
}

function WorksheetContent({
  worksheet,
  shouldShowNotesColumn,
  onViewNotes,
}: WorksheetContentProps) {
  const metadataFields = [
    [
      { key: "sex", label: "Sex:", value: worksheet.sex },
      { key: "strain", label: "Strain:", value: worksheet.strain },
      { key: "dob", label: "DOB:", value: worksheet.dob },
      {
        key: "cellInjectionDate",
        label: "Cell Injection Date:",
        value: worksheet.cellInjectionDate,
      },
    ],
    [
      { key: "cellLine", label: "Cell Line:", value: worksheet.cellLine },
      {
        key: "treatmentDate",
        label: "Treatment Date:",
        value: worksheet.treatmentDate,
      },
      {
        key: "measurementDate",
        label: "Measurement Date:",
        value: worksheet.measurementDate,
      },
    ],
  ];

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-10">
          {metadataFields.map((group, groupIndex) => (
            <div className="space-y-3" key={groupIndex}>
              {group.map(({ key, label, value }) => (
                <div className="flex items-center gap-3" key={key}>
                  <Label className="font-semibold text-sm w-56">{label}</Label>
                  <span className="flex-1">{value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {worksheet.mice && worksheet.mice.length > 0 && (
        <div className="bg-white mt-4">
          <DataTable
            columns={getReadOnlyCalliperingColumns({
              shouldShowNotesColumn,
              onViewNotes,
            })}
            data={worksheet.mice}
          />
        </div>
      )}
    </>
  );
}
