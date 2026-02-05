import { useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/molecules";
import { useCalliperingSheetData } from "@/hooks/useCalliperingSheetData";
import { useTerminateMice } from "@/hooks/useTerminateMice";
import { DATA_TYPE, STUDY_TYPE } from "@/lib/constants";
import type { CalliperingSheetApiResponse } from "@/types/callipering-sheet";

import { WorksheetContent } from "./callipering-sheet/WorkSheet";
import { NotesDialog } from "./NotesDialog";
import { TerminateMouseModal } from "./TerminateMouseModal";

export interface SelectedNoteType {
  mouse_delivery_id: string;
  id: number;
}

interface CalliperingSheetViewProps {
  experimentDataId?: string;
  experimentDataType?: string;
  experimentStudyType?: string;
  apiData?: CalliperingSheetApiResponse;
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

  // Termination hook with all business logic
  const {
    isModalOpen: showTerminateModal,
    closeModal: closeTerminateModal,
    selectedMice,
    handleTerminateClick,
    handleTerminateConfirm,
    isLoading: isTerminating,
  } = useTerminateMice(experimentDataId);

  // Transform API data into component-friendly format
  const { worksheets, hasMultipleWorksheets } =
    useCalliperingSheetData(apiData);

  // Determine if notes column should be shown
  const shouldShowNotesColumn =
    experimentDataType === DATA_TYPE.CALLIPERING_SHEET &&
    experimentStudyType === STUDY_TYPE.MODEL_STUDY;

  // Enable row selection for terminating mice (independent of notes column)
  const enableRowSelection = true;

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
            enableRowSelection={enableRowSelection}
            onViewNotes={handleViewNotes}
            onTerminateClick={handleTerminateClick}
          />
        </div>
        <NotesDialog
          open={showNotesDialog}
          onOpenChange={setShowNotesDialog}
          noteData={selectedNote}
        />
        <TerminateMouseModal
          open={showTerminateModal}
          onOpenChange={closeTerminateModal}
          selectedCount={selectedMice.ids.length}
          selectedMouseIds={selectedMice.measurementIds}
          onConfirm={handleTerminateConfirm}
          isLoading={isTerminating}
        />
      </>
    );
  }

  // Multi-worksheet view (with tabs)
  return (
    <>
      <div className="space-y-4 overflow-y-auto h-[calc(100%-5%)]">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="justify-start overflow-x-auto flex-nowrap">
            {worksheets.map((worksheet, index) => (
              <TabsTrigger
                key={`${worksheet.worksheetName}-${index}`}
                value={index.toString()}
                className="whitespace-nowrap"
              >
                {worksheet.worksheetName}
              </TabsTrigger>
            ))}
          </TabsList>

          {worksheets.map((worksheet, index) => (
            <TabsContent
              key={`${worksheet.worksheetName}-${index}`}
              value={index.toString()}
            >
              <WorksheetContent
                worksheet={worksheet}
                shouldShowNotesColumn={shouldShowNotesColumn}
                enableRowSelection={enableRowSelection}
                onViewNotes={handleViewNotes}
                onTerminateClick={handleTerminateClick}
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
      <TerminateMouseModal
        open={showTerminateModal}
        onOpenChange={closeTerminateModal}
        selectedCount={selectedMice.ids.length}
        selectedMouseIds={selectedMice.measurementIds}
        onConfirm={handleTerminateConfirm}
        isLoading={isTerminating}
      />
    </>
  );
}
