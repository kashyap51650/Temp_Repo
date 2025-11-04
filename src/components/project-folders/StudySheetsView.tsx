import { ArrowLeft } from "lucide-react";
import React from "react";

import { Button } from "@/components/atoms";

interface StudySheetsViewProps {
  sheetData?: { title?: string; options?: string[] };
  selectedStudyType: { name: string };
  goBackToStudyTypes: () => void;
}

export const StudySheetsView: React.FC<StudySheetsViewProps> = ({
  sheetData,
  selectedStudyType,
  goBackToStudyTypes,
}) => (
  <div className="mt-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold">
        {sheetData?.title || selectedStudyType.name}
      </h2>
      <Button variant="outline" onClick={goBackToStudyTypes} className="ml-4">
        <ArrowLeft /> Back to Study Types
      </Button>
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
  </div>
);
