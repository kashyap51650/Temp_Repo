import { useEffect, useState } from "react";

import { DatePicker } from "@/components/atoms/Input/DatePicker";
import { Input } from "@/components/atoms/Input/Input";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import type { MousePairRow } from "@/components/organisms/DataTable/tableColumns";
import { getBioDWeightMousePairColumns } from "@/components/organisms/DataTable/tableColumns";
import { useExperimentDataByIdForWeightSheet } from "@/hooks/useExperimentDataById";

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
    measurementId?: number;
  }[];
}

interface BioDWeightSheetProps {
  data?: BioDWeightData;
  onSave?: (data: BioDWeightData) => void;
  experimentDataId?: string;
}

export function BioDWeightSheet({
  data: BioDWeightData,
  experimentDataId,
  onSave,
}: BioDWeightSheetProps) {
  const [formData, setFormData] = useState<BioDWeightData>({
    sex: "",
    strain: "",
    dob: "",
    cellInjectionDate: "",
    cellLine: "",
    treatmentDate: "",
    measurementDate: "",
    mice: [],
  });

  const {
    data: apiData,
    isLoading,
    error,
  } = useExperimentDataByIdForWeightSheet(experimentDataId || "");

  useEffect(() => {
    if (apiData && !BioDWeightData) {
      const transformedData: BioDWeightData = {
        sex: apiData.uploaded_data.sex || "",
        strain: apiData.uploaded_data.strain || "",
        dob: apiData.uploaded_data.date_of_birth || "",
        cellInjectionDate: apiData.uploaded_data.cell_inj_date || "",
        cellLine: apiData.uploaded_data.cell_line.cell_line_name || "",
        treatmentDate: apiData.uploaded_data.treatment_date || "",
        measurementDate: apiData.uploaded_data.measurement_date || "",
        mice: apiData.uploaded_data.body_weight_measurements.map(
          (measurement) => ({
            id: measurement.mouse.mouse_delivery_id,
            bodyWeight: measurement.body_weight_grams,
            measurementId: measurement.id, // Add measurement ID for API updates
          })
        ),
      };
      setFormData(transformedData);
      if (onSave) {
        onSave(transformedData);
      }
    } else if (BioDWeightData) {
      setFormData(BioDWeightData);
      if (onSave) {
        onSave(BioDWeightData);
      }
    }
  }, [apiData, BioDWeightData]);

  const handleHeaderChange = (field: keyof BioDWeightData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    if (onSave) {
      onSave(updatedData);
    }
  };

  const handleFormDataChange = (
    updater: (prevData: BioDWeightData) => BioDWeightData
  ) => {
    setFormData((prevData) => {
      const newData =
        typeof updater === "function" ? updater(prevData) : updater;
      if (onSave) {
        onSave(newData);
      }
      return newData;
    });
  };

  if (isLoading && experimentDataId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading experiment data...</div>
      </div>
    );
  }

  if (error && experimentDataId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          Error loading experiment data. Please try again.
        </div>
      </div>
    );
  }

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
        const columns = getBioDWeightMousePairColumns(handleFormDataChange);
        return (
          <div className="bg-white h-96">
            <DataTable
              columns={columns}
              data={mousePairRows}
              pagination={false}
              pageSize={50}
            />
          </div>
        );
      })()}
    </div>
  );
}
