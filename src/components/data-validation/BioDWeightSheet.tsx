import { useEffect, useMemo, useState } from "react";

import { DatePicker } from "@/components/atoms/Input/DatePicker";
import { Input } from "@/components/atoms/Input/Input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/molecules";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import { getBioDWeightMousePairColumns } from "@/components/organisms/DataTable/tableColumns";
import type { BioDWeightData } from "@/components/organisms/DataTable/tableData";
import { useBioDWeightSheetEdit } from "@/hooks/useBioDWeightSheetEdit";
import { STUDY_TYPE } from "@/lib/constants";
import type { WorksheetEditData } from "@/types/weight-sheet";

import { Label } from "../atoms";
import { CellLineField, StrainField } from "../data-upload/FormFields";

interface BioDWeightSheetProps {
  onSave?: (data: WorksheetEditData[]) => void;
  experimentDataId?: string;
  experimentStudyType: string;
}

export function BioDWeightSheet({
  experimentDataId,
  onSave,
  experimentStudyType,
}: Readonly<BioDWeightSheetProps>) {
  const [activeTab, setActiveTab] = useState<string>("0");

  // Business logic hook for editing
  const {
    worksheetData,
    handleHeaderChange,
    handleMouseDataChange,
    getCurrentData,
    hasMultipleWorksheets,
    isLoading,
    error,
  } = useBioDWeightSheetEdit(experimentDataId);

  // Call onSave when worksheetData changes, but use getCurrentData to avoid passing unstable references
  useEffect(() => {
    if (onSave && worksheetData.size > 0) {
      const data = getCurrentData();
      onSave(data);
    }
  }, [worksheetData, onSave]);

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

  // No worksheets - show empty state
  if (worksheetData.size === 0) {
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
    const worksheet = worksheetData.get(0)!;
    return (
      <div className="space-y-4 overflow-y-auto h-[calc(100%-5%)]">
        <WorksheetEditForm
          worksheet={worksheet}
          worksheetIndex={0}
          experimentDataId={experimentDataId}
          onHeaderChange={handleHeaderChange}
          onMouseDataChange={handleMouseDataChange}
          experimentStudyType={experimentStudyType}
        />
      </div>
    );
  }

  // Multi-worksheet view (with tabs)
  return (
    <div className="space-y-4 overflow-y-auto h-[calc(100%-5%)]">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
          {Array.from(worksheetData.values()).map((worksheet, index) => (
            <TabsTrigger
              key={`${worksheet.worksheetName}-${index}`}
              value={index.toString()}
              className="whitespace-nowrap"
            >
              {worksheet.worksheetName}
            </TabsTrigger>
          ))}
        </TabsList>

        {Array.from(worksheetData.entries()).map(([index, worksheet]) => (
          <TabsContent
            key={`${worksheet.worksheetName}-${index}`}
            value={index.toString()}
          >
            <WorksheetEditForm
              worksheet={worksheet}
              worksheetIndex={index}
              experimentDataId={experimentDataId}
              onHeaderChange={handleHeaderChange}
              onMouseDataChange={handleMouseDataChange}
              experimentStudyType={experimentStudyType}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

/**
 * WorksheetEditForm Component
 *
 * Renders editable form for a single worksheet including metadata and mouse pair table.
 * Follows Atomic Design principles and project patterns.
 */
interface WorksheetEditFormProps {
  worksheet: WorksheetEditData;
  worksheetIndex: number;
  experimentDataId?: string;
  onHeaderChange: (
    worksheetIndex: number,
    field: string,
    value: string
  ) => void;
  onMouseDataChange: (
    worksheetIndex: number,
    updater: (
      prev: Array<{
        id: string;
        bodyWeight: number;
        measurementId?: number;
      }>
    ) => Array<{
      id: string;
      bodyWeight: number;
      measurementId?: number;
    }>
  ) => void;
  experimentStudyType: string;
}

function WorksheetEditForm({
  worksheet,
  worksheetIndex,
  experimentDataId,
  onHeaderChange,
  onMouseDataChange,
  experimentStudyType,
}: Readonly<WorksheetEditFormProps>) {
  // ✅ Memoize header fields to prevent recreation on every render
  const isDoseRangeFinding =
    experimentStudyType === STUDY_TYPE.DOSE_RANGE_FINDING;
  const headerFields = useMemo(
    () => [
      [
        { key: "sex", label: "Sex:", type: "input" },
        { key: "strain", label: "Strain:", type: "select" },
        { key: "dob", label: "DOB:", type: "date" },
        ...(isDoseRangeFinding
          ? []
          : [
              {
                key: "cellInjectionDate",
                label: "Cell Injection Date:",
                type: "date",
              },
            ]),
      ],
      [
        ...(isDoseRangeFinding
          ? []
          : [{ key: "cellLine", label: "Cell Line:", type: "select" }]),
        { key: "treatmentDate", label: "Treatment Date:", type: "date" },
        {
          key: "measurementDate",
          label: "Measurement Date:",
          type: "date",
        },
      ],
    ],
    [isDoseRangeFinding]
  );

  // ✅ Memoize mouse pair rows calculation to prevent unnecessary recalculations
  const mousePairRows = useMemo(() => {
    return Array.from({
      length: Math.ceil(worksheet.mice.length / 2),
    }).map((_, idx) => {
      const left = worksheet.mice[idx * 2];
      const right = worksheet.mice[idx * 2 + 1];
      return {
        id: left.id + (right ? `-${right.id}` : ""),
        leftId: left.id,
        leftWeight: left.bodyWeight,
        rightId: right?.id,
        rightWeight: right?.bodyWeight,
      };
    });
  }, [worksheet.mice]);

  // ✅ Memoize columns with stable handleFormDataChange callback
  const columns = useMemo(() => {
    const handleFormDataChange = (
      updater: (prevData: BioDWeightData) => BioDWeightData
    ) => {
      onMouseDataChange(worksheetIndex, (prevMice) => {
        const prevData: BioDWeightData = {
          sex: worksheet.sex,
          strain: worksheet.strainId?.toString() || "",
          dob: worksheet.dob,
          cellInjectionDate: worksheet.cellInjectionDate,
          cellLine: worksheet.cellLineId?.toString() || "",
          treatmentDate: worksheet.treatmentDate,
          measurementDate: worksheet.measurementDate,
          mice: prevMice,
        };
        const newData = updater(prevData);
        return newData.mice;
      });
    };

    return getBioDWeightMousePairColumns(handleFormDataChange);
  }, [worksheetIndex, worksheet, onMouseDataChange]);

  /**
   * Render a single header field based on type (input, select, date)
   * Uses semantic HTML and accessibility best practices
   */
  const renderHeaderField = (field: {
    key: string;
    label: string;
    type: string;
  }) => {
    const { key, label, type } = field;
    const value = worksheet[key as keyof typeof worksheet];

    const handleChange = (val: string) => {
      onHeaderChange(worksheetIndex, key, val);
    };

    let fieldElement;

    switch (type) {
      case "select":
        if (key === "strain") {
          fieldElement = (
            <div className="flex-1">
              <StrainField
                value={worksheet.strainId || 0}
                onChange={(value) => handleChange(String(value))}
                size="default"
                experimentId={experimentDataId}
                hideLabel
              />
            </div>
          );
        } else if (key === "cellLine") {
          fieldElement = (
            <div className="flex-1">
              <CellLineField
                value={worksheet.cellLineId || 0}
                onChange={(value) => handleChange(String(value))}
                size="default"
                experimentId={experimentDataId}
                hideLabel
              />
            </div>
          );
        }
        break;

      case "date":
        fieldElement = (
          <DatePicker
            value={value === "N/A" ? "" : (value as string)}
            onChange={(date) => handleChange(date)}
            className="flex-1"
          />
        );
        break;

      case "input":
      default:
        fieldElement = (
          <Input
            size="sm"
            value={value as string}
            onChange={(e) => handleChange(e.target.value)}
            className="flex-1"
          />
        );
        break;
    }

    return (
      <div className="flex items-center gap-3" key={key}>
        <Label className="font-semibold text-sm w-56">{label}</Label>
        {fieldElement}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-10">
          {headerFields.map((group, groupIndex) => (
            <div
              className="space-y-3"
              key={`header-${group?.[0]?.key}-${groupIndex}`}
            >
              {group.map((field) => renderHeaderField(field))}
            </div>
          ))}
        </div>
      </div>

      {mousePairRows.length > 0 && (
        <div className="bg-white h-96">
          <DataTable columns={columns} data={mousePairRows} />
        </div>
      )}
    </>
  );
}
