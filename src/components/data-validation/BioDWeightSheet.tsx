import { useState } from "react";

import { DatePicker } from "@/components/atoms/Input/DatePicker";
import { Input } from "@/components/atoms/Input/Input";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import type { MousePairRow } from "@/components/organisms/DataTable/tableColumns";
import { getBioDWeightMousePairColumns } from "@/components/organisms/DataTable/tableColumns";

import { Label } from "../atoms";

interface BioDWeightData {
  sex: string;
  strain: string;
  dob: string;
  cellInjectionDate: string;
  cellLine: string;
  treatmentDate: string;
  measurementDate: string;
  mice: {
    id: string;
    bodyWeight: number;
  }[];
}

interface BioDWeightSheetProps {
  data?: BioDWeightData;
  onSave?: (data: BioDWeightData) => void;
}

export function BioDWeightSheet({ data }: BioDWeightSheetProps) {
  const [formData, setFormData] = useState<BioDWeightData>(
    data || {
      sex: "Female",
      strain: "R2G2",
      dob: "01/11/2024",
      cellInjectionDate: "",
      cellLine: "",
      treatmentDate: "",
      measurementDate: "1 Nov 25",
      mice: Array.from({ length: 25 }, (_, i) => ({
        id: `MUS${String(i + 1).padStart(2, "0")}`,
        bodyWeight: 101 + i,
      })),
    }
  );

  const handleHeaderChange = (field: keyof BioDWeightData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 overflow-y-auto h-[calc(100%-20%)]">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Label className="font-semibold text-sm w-56">Sex:</Label>
              <Input
                size="sm"
                value={formData.sex}
                onChange={(e) => handleHeaderChange("sex", e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label className="font-semibold text-sm w-56">Strain:</Label>
              <Input
                size="sm"
                value={formData.strain}
                onChange={(e) => handleHeaderChange("strain", e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label className="font-semibold text-sm w-56">DOB:</Label>
              <DatePicker
                value={formData.dob}
                onChange={(date) => handleHeaderChange("dob", date)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label className="font-semibold text-sm w-56">
                Cell Injection Date:
              </Label>
              <DatePicker
                value={formData.cellInjectionDate}
                onChange={(date) =>
                  handleHeaderChange("cellInjectionDate", date)
                }
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Label className="font-semibold text-sm w-56">Cell Line:</Label>
              <Input
                size="sm"
                value={formData.cellLine}
                onChange={(e) => handleHeaderChange("cellLine", e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label className="font-semibold text-sm w-56">
                Treatment Date:
              </Label>
              <DatePicker
                value={formData.treatmentDate}
                onChange={(date) => handleHeaderChange("treatmentDate", date)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label className="font-semibold text-sm w-56">
                Measurement Date:
              </Label>
              <Input
                size="sm"
                value={formData.measurementDate}
                onChange={(e) =>
                  handleHeaderChange("measurementDate", e.target.value)
                }
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {(() => {
        const mousePairRows: MousePairRow[] = Array.from({
          length: Math.ceil(formData.mice.length / 2),
        }).map((_, idx) => {
          const left = formData.mice[idx * 2];
          const right = formData.mice[idx * 2 + 1];
          return {
            id: left.id + (right ? `-${right.id}` : ""),
            leftId: left.id,
            leftWeight: left.bodyWeight,
            rightId: right?.id,
            rightWeight: right?.bodyWeight,
          };
        });
        const columns = getBioDWeightMousePairColumns(setFormData);
        return (
          <div className="bg-white h-96">
            <DataTable columns={columns} data={mousePairRows} />
          </div>
        );
      })()}
    </div>
  );
}
