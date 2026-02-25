import { useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/molecules";
import { useDelfiaAndSBASheetData } from "@/hooks/useDelfiaAndSBASheetData";
import type { DelfiaOrSBAExperimentDataResponse } from "@/types/delfiaAndSBA";

import { WorksheetContent } from "./delfia-and-sba-sheet/WorksheetContent";

interface DelfiaAndSBASheetViewProps {
  experimentDataId?: string;
  apiData?: DelfiaOrSBAExperimentDataResponse;
  isLoading?: boolean;
  error?: Error | null;
}

export function DelfiaAndSBASheetView({
  experimentDataId,
  apiData,
  isLoading,
  error,
}: DelfiaAndSBASheetViewProps) {
  const [activeTab, setActiveTab] = useState<string>("0");
  const { worksheets, hasMultipleWorksheets } =
    useDelfiaAndSBASheetData(apiData);

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
      <div className="space-y-4 overflow-y-auto h-[calc(100%-5%)]">
        <WorksheetContent worksheet={worksheet} />
      </div>
    );
  }

  // Multiple worksheets view with tabs
  return (
    <div className="space-y-4 overflow-y-auto h-[calc(100%-5%)]">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {worksheets.map((worksheet, index) => (
            <TabsTrigger
              key={`${worksheet.worksheetName}-${index}`}
              value={index.toString()}
              className="text-sm"
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
            <WorksheetContent worksheet={worksheet} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
