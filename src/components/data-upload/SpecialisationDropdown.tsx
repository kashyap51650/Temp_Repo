import { Label } from "@/components/atoms/Label/Label";

import { CustomSelect } from "./CustomSelect";

interface SpecialisationDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled: boolean;
  error?: string;
  showHelperText?: boolean;
  helperText?: string;
}

const specialisationOptions = [
  { value: "Preclinical", label: "Preclinical" },
  { value: "CMC", label: "CMC" },
  { value: "chemistry", label: "Chemistry" },
  { value: "hotlab", label: "Hotlab" },
];

export function SpecialisationDropdown({
  value,
  onValueChange,
  disabled,
  error,
  showHelperText = false,
  helperText = "Please select a project to continue",
}: Readonly<SpecialisationDropdownProps>) {
  const handleChange = (selectedValue: string | string[]) => {
    const val =
      typeof selectedValue === "string" ? selectedValue : selectedValue[0];
    onValueChange(val);
  };

  return (
    <div className="space-y-2">
      <Label
        htmlFor="specialisation"
        className={`${disabled ? "text-muted-foreground" : ""}`}
      >
        Specialisation
      </Label>
      <CustomSelect
        options={specialisationOptions}
        placeholder="Select specialisation"
        value={value}
        onValueChange={handleChange}
        disabled={disabled}
        className={disabled ? "opacity-50 cursor-not-allowed w-full" : "w-full"}
      />
      {showHelperText && (
        <span className="text-xs text-muted-foreground">{helperText}</span>
      )}
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
