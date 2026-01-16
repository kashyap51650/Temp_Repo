import { useCallback, useEffect, useState } from "react";

import { DatePicker } from "@/components/atoms/Input/DatePicker";
import { Input } from "@/components/atoms/Input/Input";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import type { MousePairRow } from "@/components/organisms/DataTable/tableColumns";
import { getBioDWeightMousePairColumns } from "@/components/organisms/DataTable/tableColumns";
import type { BioDWeightData } from "@/components/organisms/DataTable/tableData";
import { useExperimentDataByIdForWeightSheet } from "@/hooks/useExperimentDataById";

import { Label } from "../atoms";
import { CellLineField, StrainField } from "../data-upload/FormFields";

interface BioDWeightSheetProps {
  data?: BioDWeightData;
  onSave?: (data: BioDWeightData) => void;
  experimentDataId?: string;
}

interface HeaderField {
  key: string;
  label: string;
  type: string;
}

export function BioDWeightSheet({
  data,
  experimentDataId,
  onSave,
}: Readonly<BioDWeightSheetProps>) {
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
    if (apiData && !data) {
      const transformedData: BioDWeightData = {
        sex: apiData.uploaded_data.sex ?? "",
        strain: apiData.uploaded_data.mouse_strain?.id.toString() ?? "",
        dob: apiData.uploaded_data.date_of_birth ?? "",
        cellInjectionDate: apiData.uploaded_data.cell_inj_date ?? "",
        cellLine: apiData.uploaded_data.cell_line?.id.toString() ?? "",
        treatmentDate: apiData.uploaded_data.treatment_date ?? "",
        measurementDate: apiData.uploaded_data.measurement_date ?? "",
        mice:
          apiData.uploaded_data.body_weight_measurements?.map(
            (measurement) => ({
              id: measurement.mouse?.mouse_delivery_id ?? "",
              bodyWeight: measurement.body_weight_grams ?? 0,
              measurementId: measurement.id,
            })
          ) ?? [],
      };

      setFormData(transformedData);
      onSave?.(transformedData);
    } else if (data) {
      setFormData(data);
      onSave?.(data);
    }
  }, [apiData, data]);

  const handleHeaderChange = useCallback(
    (field: keyof BioDWeightData, value: string) => {
      const updatedData = { ...formData, [field]: value };
      setFormData(updatedData);
      if (onSave) {
        onSave(updatedData);
      }
    },
    [onSave]
  );

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

  const renderHeaderField = useCallback(
    (headerField: HeaderField) => {
      const { key, label, type } = headerField;

      const value = formData[key as keyof BioDWeightData];

      const handleChange = (val: string) => {
        handleHeaderChange(key as keyof BioDWeightData, val);
      };

      const renderField = () => {
        switch (type) {
          case "select":
            if (key === "strain") {
              return (
                <div className="flex-1">
                  <StrainField
                    value={Number(formData.strain)}
                    onChange={(value) => handleChange(String(value))}
                    size="default"
                    experimentId={experimentDataId}
                    hideLabel
                  />
                </div>
              );
            }
            if (key === "cellLine") {
              return (
                <div className="flex-1">
                  <CellLineField
                    value={Number(formData.cellLine)}
                    onChange={(value) => handleChange(String(value))}
                    size="default"
                    experimentId={experimentDataId}
                    hideLabel
                  />
                </div>
              );
            }
            return null;

          case "date":
            return (
              <DatePicker
                value={value as string}
                onChange={(date) => handleChange(date)}
                className="flex-1"
              />
            );

          case "input":
          default:
            return (
              <Input
                size="sm"
                value={value as string}
                onChange={(e) => handleChange(e.target.value)}
                className="flex-1"
              />
            );
        }
      };

      return (
        <div className="flex items-center gap-3" key={key}>
          <Label className="font-semibold text-sm w-56">{label}</Label>
          {renderField()}
        </div>
      );
    },
    [experimentDataId]
  );

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
              { key: "strain", label: "Strain:", type: "select" },
              { key: "dob", label: "DOB:", type: "date" },
              {
                key: "cellInjectionDate",
                label: "Cell Injection Date:",
                type: "date",
              },
            ],
            [
              { key: "cellLine", label: "Cell Line:", type: "select" },
              { key: "treatmentDate", label: "Treatment Date:", type: "date" },
              {
                key: "measurementDate",
                label: "Measurement Date:",
                type: "date",
              },
            ],
          ].map((group) => (
            <div className="space-y-3" key={group[0].key}>
              {group.map(({ key, label, type }) =>
                renderHeaderField({ key, label, type })
              )}
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
            <DataTable columns={columns} data={mousePairRows} />
          </div>
        );
      })()}
    </div>
  );
}
