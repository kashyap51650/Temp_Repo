import { type StudyType, studyTypeApi } from "@/api";
import { Label } from "@/components/atoms/Label/Label";
import { AsyncSelect } from "@/components/molecules/AsyncSelect";
import queryClient from "@/lib/queryClient";

interface StudyTypeDropdownProps {
  value: string;
  onValueChange: (value: string, studyTypeId?: number) => void;
  disabled: boolean;
  error?: string;
  showHelperText?: boolean;
  helperText?: string;
  specialization?: string;
}

export function StudyTypeDropdown({
  value,
  onValueChange,
  disabled,
  error,
  showHelperText = false,
  helperText = "Please select specialisation to continue",
  specialization,
}: Readonly<StudyTypeDropdownProps>) {
  const studyTypes = queryClient.getQueryData([
    "study-types",
    specialization || "",
  ]) as StudyType[] | undefined;
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
        onChange={(newValue) => {
          // Find the selected study type to get its ID
          const selectedStudyType = studyTypes?.find(
            (st) => st.study_type_name === newValue
          );
          onValueChange(newValue as string, selectedStudyType?.id);
        }}
        mapConfig={{
          labelKey: "study_type_name" as const,
          valueKey: "study_type_name" as const,
        }}
        query={async () => {
          if (!specialization) return [];
          const response = await studyTypeApi.getStudyTypes(specialization);
          return response.data;
        }}
        queryKey={["study-types", specialization || ""]}
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
