import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/atoms";
import { mockExperiments, mockMice } from "@/data/mockData";
import { useDataTypes, useModal } from "@/hooks";
import type { StudyType } from "@/lib/api";

import { SelectMiceModal } from "./SelectMiceModal";
import { SelectTargetExperimentModal } from "./SelectTargetExperimentModal";

interface StudySheetsViewProps {
  selectedStudyType: StudyType;
  goBackToStudyTypes: () => void;
}

export const StudySheetsView: React.FC<StudySheetsViewProps> = ({
  selectedStudyType,
  goBackToStudyTypes,
}) => {
  const miceModal = useModal();
  const targetModal = useModal();

  const [selectedMiceForMove, setSelectedMiceForMove] = useState<string[]>([]);

  const { dataTypes, loading, error } = useDataTypes({
    enabled: true,
    studyTypeId: selectedStudyType.id,
  });

  const handleMoveMiceClick = () => {
    miceModal.openModal();
  };

  const handleMiceSelected = (selectedMice: string[]) => {
    setSelectedMiceForMove(selectedMice);
    miceModal.closeModal();
    targetModal.openModal();
  };

  const handleMoveComplete = () => {
    targetModal.closeModal();
    setSelectedMiceForMove([]);
  };

  const handleCloseModals = () => {
    miceModal.closeModal();
    targetModal.closeModal();
    setSelectedMiceForMove([]);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {selectedStudyType.study_type_name}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMoveMiceClick}>
            Move Mice
          </Button>
          <Button variant="outline" onClick={goBackToStudyTypes}>
            <ArrowLeft /> Back to Study Types
          </Button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8 text-muted-foreground">
          Loading study types...
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500">
          Error loading data types: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {dataTypes?.map((dataType) => (
            <Button
              variant={"outline"}
              key={dataType.id}
              className="w-full text-left p-4 h-16 justify-start rounded-lg border text-base font-medium bg-background hover:bg-muted transition-all cursor-pointer"
            >
              {dataType.data_type_name}
            </Button>
          ))}
        </div>
      )}

      {/* Move Mice Modals */}
      <SelectMiceModal
        isOpen={miceModal.isOpen}
        onClose={handleCloseModals}
        onNext={handleMiceSelected}
        mice={mockMice}
      />

      <SelectTargetExperimentModal
        isOpen={targetModal.isOpen}
        onClose={handleCloseModals}
        onMove={handleMoveComplete}
        selectedMiceCount={selectedMiceForMove.length}
        experiments={mockExperiments}
      />
    </div>
  );
};
