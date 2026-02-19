import { specializationApi } from "@/api";
import { Label } from "@/components/atoms/Label/Label";
import type { PermissionModuleType } from "@/lib";
import { cn, generateQueryKey } from "@/lib/utils";

import { AsyncSelect } from "../molecules";

interface SpecialisationDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  error?: string;
  showHelperText?: boolean;
  helperText?: string;
  module_perm?: PermissionModuleType;
  label?: string;
  placeholder?: string;
  optionWithAll?: boolean;
  allLabel?: string;
  className?: string;
}

export function SpecialisationDropdown({
  value,
  onValueChange,
  disabled,
  error,
  showHelperText = false,
  helperText = "Please select a project to continue",
  module_perm,
  label = "Specialisation",
  placeholder = "Select specialisation",
  optionWithAll = false,
  allLabel,
  className,
}: Readonly<SpecialisationDropdownProps>) {
  const handleChange = (selectedValue: string | string[]) => {
    const val =
      typeof selectedValue === "string" ? selectedValue : selectedValue[0];
    onValueChange(val);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor="specialisation"
        className={`${disabled ? "text-muted-foreground" : ""}`}
      >
        {label}
      </Label>
      <AsyncSelect
        id="specialisation"
        value={value}
        onChange={handleChange}
        query={async () => {
          try {
            const response = await specializationApi.specializationDropdown({
              module_perm,
            });
            return response.data ?? [];
          } catch {
            return [];
          }
        }}
        queryKey={generateQueryKey("specialization", module_perm)}
        mapConfig={{
          valueKey: "value",
          labelKey: "label",
        }}
        searchable={false}
        optionWithAll={optionWithAll}
        allLabel={allLabel}
        disabled={disabled}
        placeholder={placeholder}
      />
      {showHelperText && (
        <span className="text-xs text-muted-foreground">{helperText}</span>
      )}
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
