import { useQueryClient } from "@tanstack/react-query";

import { type DataType, dataTypeApi } from "@/api";
import { Label } from "@/components/atoms/Label/Label";
import { AsyncSelect } from "@/components/molecules/AsyncSelect";

interface DataTypeDropdownProps {
  value: string;
  onValueChange: (value: string, dataTypeId?: number) => void;
  disabled: boolean;
  error?: string;
  showHelperText?: boolean;
  helperText?: string;
  studyTypeId?: number;
}

export function DataTypeDropdown({
  value,
  onValueChange,
  disabled,
  error,
  showHelperText = false,
  helperText = "Please select experiment to continue",
  studyTypeId,
}: Readonly<DataTypeDropdownProps>) {
  const queryClient = useQueryClient();

  const dataTypes = queryClient.getQueryData([
    "data-types",
    ["data-types", String(studyTypeId || "")],
  ]) as DataType[];

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
        onChange={(newValue) => {
          // Find the selected data type to get its ID
          const selectedDataType = dataTypes?.find(
            (dt) => dt.data_type_name === newValue
          );
          onValueChange(newValue as string, selectedDataType?.id);
        }}
        mapConfig={{
          labelKey: "data_type_name" as const,
          valueKey: "data_type_name" as const,
        }}
        query={async () => {
          if (!studyTypeId) return [];
          const response = await dataTypeApi.getDataTypes({
            study_type_id: studyTypeId,
          });
          return response.data || [];
        }}
        queryKey={["data-types", String(studyTypeId || "")]}
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
