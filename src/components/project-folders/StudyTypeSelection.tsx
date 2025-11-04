import React from "react";

import { Button } from "@/components/atoms";
import { type StudyType } from "@/components/organisms/DataTable/tableData";

interface StudyTypeSelectionProps {
  studyTypes: StudyType[];
  onSelect: (studyType: StudyType) => void;
}

export const StudyTypeSelection: React.FC<StudyTypeSelectionProps> = ({
  studyTypes,
  onSelect,
}) => (
  <>
    <h3 className="text-lg mb-4 font-medium">Select Study Type </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {studyTypes.map((studyType) => (
        <Button
          key={studyType.id}
          onClick={() => onSelect(studyType)}
          className={`p-6 h-20 rounded-lg border-2 text-center font-medium transition-all ${studyType.color}`}
        >
          {studyType.name}
        </Button>
      ))}
    </div>
  </>
);
