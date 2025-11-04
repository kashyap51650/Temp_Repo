import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/Select/Select";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  placeholder?: string;
  value?: string | string[];
  onValueChange: (value: string | string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CustomSelect({
  options,
  placeholder = "Select an option",
  value,
  onValueChange,
  multiple = false,
  disabled = false,
  className,
}: CustomSelectProps) {
  if (multiple) {
    const selectedValues = Array.isArray(value) ? value : [];

    return (
      <Select
        value={selectedValues.join(",")}
        onValueChange={(newValue) => {
          const currentValues = Array.isArray(value) ? value : [];
          if (currentValues.includes(newValue)) {
            onValueChange(currentValues.filter((v) => v !== newValue));
          } else {
            onValueChange([...currentValues, newValue]);
          }
        }}
        disabled={disabled}
      >
        <SelectTrigger className={className} size="lg">
          <SelectValue placeholder={placeholder}>
            {selectedValues.length > 0
              ? `${selectedValues.length} selected`
              : placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
              {selectedValues.includes(option.value) && " ✓"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select
      value={typeof value === "string" ? value : ""}
      onValueChange={(newValue) => onValueChange(newValue)}
      disabled={disabled}
    >
      <SelectTrigger className={className} size="lg">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
