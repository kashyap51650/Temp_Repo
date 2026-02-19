import { useCallback } from "react";

import { type DataType, dataTypeApi } from "@/api";
import { Label } from "@/components/atoms/Label/Label";
import { AsyncSelect } from "@/components/molecules/AsyncSelect";
import { generateQueryKey, queryClient } from "@/lib";
import type { PermissionModuleType } from "@/types/auth";

interface DataTypeDropdownProps {
  value: string;
  onValueChange: (value: string, dataTypeId?: number) => void;
  disabled: boolean;
  error?: string;
  showHelperText?: boolean;
  helperText?: string;
  studyTypeId?: number;
  module?: PermissionModuleType;
}

export function DataTypeDropdown({
  value,
  onValueChange,
  disabled,
  error,
  showHelperText = false,
  helperText = "Please select experiment to continue",
  studyTypeId,
  module,
}: Readonly<DataTypeDropdownProps>) {
  const onDataTypeChange = useCallback(
    (newValue: string) => {
      const key = generateQueryKey("data-types", String(studyTypeId), module);
      const dataTypes = queryClient.getQueryData(key) as DataType[];
      const selectedDataType = dataTypes?.find(
        (dt) => dt.data_type_name === newValue
      );
      onValueChange(newValue, selectedDataType?.id);
    },
    [module, studyTypeId, onValueChange]
  );

  return (
    <div className="space-y-2">
      <Label
        htmlFor="dataType"
        className={`${disabled ? "text-muted-foreground" : ""}`}
      >
        Data Type
      </Label>
      <AsyncSelect
        value={value}
        onChange={(newValue) => onDataTypeChange(newValue as string)}
        mapConfig={{
          labelKey: "data_type_name" as const,
          valueKey: "data_type_name" as const,
        }}
        query={async () => {
          if (!studyTypeId) return [];
          const response = await dataTypeApi.getDataTypes({
            study_type_id: studyTypeId,
            module,
          });
          return response.data || [];
        }}
        queryKey={generateQueryKey("data-types", String(studyTypeId), module)}
        placeholder="Select data type"
        disabled={disabled || !studyTypeId}
        searchable={false}
        optionWithAll={false}
        size="lg"
      />
      {showHelperText && (
        <span className="text-xs text-muted-foreground">{helperText}</span>
      )}
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
