import { useMemo } from "react";

import { Badge } from "@/components/atoms/Badge/Badge";
import { SearchableSelect } from "@/components/atoms/SearchableSelect/SearchableSelect";
import { cn } from "@/lib/utils";
import type { SelectOption } from "@/types/utils";

interface FilterOption {
  value: string | number;
  label: string;
}

interface BiodistributionFilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedValues: (string | number)[];
  onSelectionChange: (values: (string | number)[]) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Reusable multi-select dropdown for biodistribution filters
 *
 * Features:
 * - Multi-select with checkboxes
 * - Search functionality
 * - Display selected count badge
 * - Select/deselect all
 */
export function BiodistributionFilterDropdown({
  label,
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Select...",
  className,
}: BiodistributionFilterDropdownProps) {
  const selectedCount = selectedValues.length;
  const totalCount = options.length;

  // Convert FilterOption[] to SelectOption[] format
  const selectOptions: SelectOption[] = useMemo(() => {
    return options.map((opt) => ({
      id: String(opt.value),
      value: String(opt.value),
      label: opt.label,
    }));
  }, [options]);

  // Convert selected values to string array for SearchableSelect
  const selectedStringValues = useMemo(() => {
    return selectedValues.map(String);
  }, [selectedValues]);

  // Handle selection change and convert back to original types
  const handleSelectionChange = (values: string[]) => {
    // Convert string values back to their original types (number or string)
    const convertedValues = values.map((val) => {
      const original = options.find((opt) => String(opt.value) === val);
      return original?.value ?? val;
    });
    onSelectionChange(convertedValues);
  };

  // Display text for selected items
  const displayText = useMemo(() => {
    if (selectedCount === 0) return placeholder;
    if (selectedCount === totalCount) return `All ${label}`;
    return `${selectedCount} selected`;
  }, [selectedCount, totalCount, placeholder, label]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {selectedCount > 0 && selectedCount < totalCount && (
          <Badge variant="secondary" className="px-2 py-0.5 text-xs">
            {selectedCount}
          </Badge>
        )}
      </div>

      <SearchableSelect
        options={selectOptions}
        value={selectedStringValues}
        onValueChange={handleSelectionChange}
        placeholder={displayText}
        multiple={true}
        showSearch={true}
        shouldShowCreateNew={false}
        size="default"
        searchPlaceholder={`Search ${label.toLowerCase()}...`}
      />
    </div>
  );
}
