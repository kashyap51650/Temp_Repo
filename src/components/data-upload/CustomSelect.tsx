// ...existing code...
import { X } from "lucide-react";

import { Button } from "../atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/Select/Select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../atoms/Tooltip/Tooltip";

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
}: Readonly<CustomSelectProps>) {
  const handleMultiSelectChange = (newValue: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (currentValues.includes(newValue)) {
      onValueChange(currentValues.filter((v) => v !== newValue));
    } else {
      onValueChange([...currentValues, newValue]);
    }
  };

  const handleRemoveValue = (
    selectedValues: string[],
    valueToRemove: string
  ) => {
    onValueChange(selectedValues.filter((v) => v !== valueToRemove));
  };

  const renderSelectedBadges = (
    selectedOpts: Option[],
    selectedValues: string[]
  ) => {
    const maxToShow = 3;
    const shown = selectedOpts.slice(0, maxToShow);
    const hidden = selectedOpts.slice(maxToShow);

    return (
      <>
        {shown.map((opt) => (
          <span
            key={opt.value}
            className="flex items-center bg-muted px-2 mt-2 rounded gap-1 group"
          >
            {opt.label}
            <Button
              type="button"
              aria-label={`Remove ${opt.label}`}
              size={"icon-sm"}
              variant="ghost"
              className="w-4"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveValue(selectedValues, opt.value);
              }}
              tabIndex={0}
            >
              <X className="size-3 text-muted-foreground group-hover:text-destructive" />
            </Button>
          </span>
        ))}
        {hidden.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"icon-sm"}
                className="mt-2 bg-muted text-muted-foreground rounded-xs"
                variant="ghost"
              >
                +{hidden.length}
              </Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={4}>
              <div className="flex flex-col gap-1">
                {hidden.map((opt) => (
                  <span key={opt.value}>{opt.label}</span>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </>
    );
  };

  if (multiple) {
    const selectedValues = Array.isArray(value) ? value : [];
    const selectedOpts = options.filter((opt) =>
      selectedValues.includes(opt.value)
    );

    return (
      <div className="space-y-1">
        <Select
          value={selectedValues.join(",")}
          onValueChange={handleMultiSelectChange}
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

        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 text-xs items-center">
            {renderSelectedBadges(selectedOpts, selectedValues)}
          </div>
        )}
      </div>
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
