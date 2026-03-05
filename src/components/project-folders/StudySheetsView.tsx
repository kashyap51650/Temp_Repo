import { ArrowLeft } from "lucide-react";
import React, { useState } from "react";

import type { StudyType } from "@/api";
import { Button } from "@/components/atoms";
import { MoveMiceWizard } from "@/components/project-folders/MoveMiceWizard";
import { useDataTypes } from "@/hooks";
import { PERMISSIONS } from "@/lib/permissions";

import { ProtectedComponent } from "../organisms/ProtectedRoute";

interface StudySheetsViewProps {
  selectedStudyType: StudyType;
  goBackToStudyTypes: () => void;
  sourceExperimentId: number;
  projectId: number;
  specialization?: string;
}

export const StudySheetsView: React.FC<StudySheetsViewProps> = ({
  selectedStudyType,
  goBackToStudyTypes,
  sourceExperimentId,
  projectId,
  specialization = "Preclinical",
}) => {
  const [isMoveMiceWizardOpen, setIsMoveMiceWizardOpen] = useState(false);

  const { dataTypes, loading, error } = useDataTypes({
    enabled: true,
    studyTypeId: selectedStudyType.id,
    module: "data_view",
  });

  const handleMoveMiceClick = () => {
    setIsMoveMiceWizardOpen(true);
  };

  const handleWizardClose = () => {
    setIsMoveMiceWizardOpen(false);
  };

  const handleMoveComplete = () => {
    setIsMoveMiceWizardOpen(false);
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {selectedStudyType.study_type_name}
        </h2>
        <div className="flex gap-2">
          <ProtectedComponent
            permissions={PERMISSIONS.MOUSE.MOVE_MICE}
            redirectTo={false}
          >
            <Button variant="outline" onClick={handleMoveMiceClick}>
              Move Mice
            </Button>
          </ProtectedComponent>
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

      {/* ✅ Move Mice Wizard */}
      <MoveMiceWizard
        isOpen={isMoveMiceWizardOpen}
        onClose={handleWizardClose}
        onComplete={handleMoveComplete}
        sourceExperimentId={sourceExperimentId}
        projectId={projectId}
        // Might be used in future
        // studyTypeId={studyTypeId}
        specialization={specialization}
      />
    </div>
  );
};
