import { useCallback } from "react";

import { type StudyType, studyTypeApi } from "@/api";
import { Label } from "@/components/atoms/Label/Label";
import { AsyncSelect } from "@/components/molecules/AsyncSelect";
import { generateQueryKey } from "@/lib";
import queryClient from "@/lib/queryClient";
import type { PermissionModuleType } from "@/types/auth";

interface StudyTypeDropdownProps {
  value: string;
  onValueChange: (value: string, studyType?: StudyType) => void;
  disabled: boolean;
  error?: string;
  showHelperText?: boolean;
  helperText?: string;
  specialization?: string;
  module?: PermissionModuleType;
}

export function StudyTypeDropdown({
  value,
  onValueChange,
  disabled,
  error,
  showHelperText = false,
  helperText = "Please select specialisation to continue",
  specialization,
  module,
}: Readonly<StudyTypeDropdownProps>) {
  const onStudyTypeChange = useCallback(
    (value: string) => {
      const key = generateQueryKey("study-types", specialization, module);

      const studyTypes = queryClient.getQueryData(key) as
        | StudyType[]
        | undefined;

      const selectedStudyType = studyTypes?.find(
        (st) => st.study_type_name === value
      );
      onValueChange(value, selectedStudyType);
    },
    [module, specialization, onValueChange]
  );

  return (
    <div className="space-y-2">
      <Label
        htmlFor="studyType"
        className={`${disabled ? "text-muted-foreground" : ""}`}
      >
        Study Type
      </Label>
      <AsyncSelect
        value={value}
        onChange={(value) => onStudyTypeChange(value as string)}
        mapConfig={{
          labelKey: "study_type_name" as const,
          valueKey: "study_type_name" as const,
        }}
        query={async () => {
          if (!specialization) return [];
          const response = await studyTypeApi.getStudyTypes(
            specialization,
            module
          );
          return response.data;
        }}
        queryKey={generateQueryKey("study-types", specialization, module)}
        placeholder="Select study type"
        disabled={disabled || !specialization}
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
