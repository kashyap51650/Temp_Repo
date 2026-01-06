import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/atoms";
import { mockExperiments, mockMice } from "@/data/mockData";

import { SelectMiceModal } from "./SelectMiceModal";
import { SelectTargetExperimentModal } from "./SelectTargetExperimentModal";

interface StudySheetsViewProps {
  sheetData?: { title?: string; options?: string[] };
  selectedStudyType: { name: string };
  goBackToStudyTypes: () => void;
}

export const StudySheetsView: React.FC<StudySheetsViewProps> = ({
  sheetData,
  selectedStudyType,
  goBackToStudyTypes,
}) => {
  const [isSelectMiceModalOpen, setIsSelectMiceModalOpen] = useState(false);
  const [isSelectTargetModalOpen, setIsSelectTargetModalOpen] = useState(false);
  const [selectedMiceForMove, setSelectedMiceForMove] = useState<string[]>([]);

  const handleMoveMiceClick = () => {
    setIsSelectMiceModalOpen(true);
  };

  const handleMiceSelected = (selectedMice: string[]) => {
    setSelectedMiceForMove(selectedMice);
    setIsSelectMiceModalOpen(false);
    setIsSelectTargetModalOpen(true);
  };

  const handleMoveComplete = (targetExperimentId: string) => {
    console.log(
      "Moving mice:",
      selectedMiceForMove,
      "to experiment:",
      targetExperimentId
    );
    // Handle the actual move logic here
    setIsSelectTargetModalOpen(false);
    setSelectedMiceForMove([]);
  };

  const handleCloseModals = () => {
    setIsSelectMiceModalOpen(false);
    setIsSelectTargetModalOpen(false);
    setSelectedMiceForMove([]);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {sheetData?.title || selectedStudyType.name}
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
      <div className="space-y-4">
        {sheetData?.options?.map((option: string) => (
          <Button
            variant={"outline"}
            key={option}
            className="w-full text-left p-4 h-16 justify-start rounded-lg border text-base font-medium bg-background hover:bg-muted transition-all cursor-pointer"
          >
            {option}
          </Button>
        ))}
      </div>

      {/* Move Mice Modals */}
      <SelectMiceModal
        isOpen={isSelectMiceModalOpen}
        onClose={handleCloseModals}
        onNext={handleMiceSelected}
        mice={mockMice}
      />

      <SelectTargetExperimentModal
        isOpen={isSelectTargetModalOpen}
        onClose={handleCloseModals}
        onMove={handleMoveComplete}
        selectedMiceCount={selectedMiceForMove.length}
        experiments={mockExperiments}
      />
    </div>
  );
};
