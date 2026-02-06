import React from "react";

import type { StudyType } from "@/api";
import { Button } from "@/components/atoms";
import { useStudyTypes } from "@/hooks";
import { STUDY_TYPE_COLORS } from "@/lib/constants";

interface StudyTypeSelectionProps {
  onSelect: (studyType: StudyType) => void;
}

export const StudyTypeSelection: React.FC<StudyTypeSelectionProps> = ({
  onSelect,
}) => {
  const { studyTypes, loading } = useStudyTypes({ enabled: true });
  return (
    <>
      {loading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading study types...
        </div>
      ) : (
        <>
          <h3 className="text-lg mb-4 font-medium">Select Study Type </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studyTypes.map((studyType, index) => (
              <Button
                key={studyType.id}
                onClick={() => onSelect(studyType)}
                className={`p-6 h-20 rounded-lg border-2 text-center font-medium transition-all ${STUDY_TYPE_COLORS[index % STUDY_TYPE_COLORS.length]}`}
              >
                {studyType.study_type_name}
              </Button>
            ))}
          </div>
        </>
      )}
    </>
  );
};
