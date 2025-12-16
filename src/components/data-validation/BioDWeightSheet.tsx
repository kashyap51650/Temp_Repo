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
          {[
            [
              { key: "sex", label: "Sex:", type: "input" },
              { key: "strain", label: "Strain:", type: "input" },
              { key: "dob", label: "DOB:", type: "date" },
              {
                key: "cellInjectionDate",
                label: "Cell Injection Date:",
                type: "date",
              },
            ],
            [
              { key: "cellLine", label: "Cell Line:", type: "input" },
              { key: "treatmentDate", label: "Treatment Date:", type: "date" },
              {
                key: "measurementDate",
                label: "Measurement Date:",
                type: "input",
              },
            ],
          ].map((group, groupIdx) => (
            <div className="space-y-3" key={groupIdx}>
              {group.map(({ key, label, type }) => (
                <div className="flex items-center gap-3" key={key}>
                  <Label className="font-semibold text-sm w-56">{label}</Label>
                  {type === "input" ? (
                    <Input
                      size="sm"
                      value={formData[key as keyof BioDWeightData] as string}
                      onChange={(e) =>
                        handleHeaderChange(
                          key as keyof BioDWeightData,
                          e.target.value
                        )
                      }
                      className="flex-1"
                    />
                  ) : (
                    <DatePicker
                      value={formData[key as keyof BioDWeightData] as string}
                      onChange={(date) =>
                        handleHeaderChange(key as keyof BioDWeightData, date)
                      }
                      className="flex-1"
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
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
            <DataTable
              columns={columns}
              data={mousePairRows}
              pagination={false}
            />
          </div>
        );
      })()}
    </div>
  );
}
