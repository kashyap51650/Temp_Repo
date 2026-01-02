import { useDataTypes } from "@/hooks/useDataTypes";

import { Label } from "../atoms/Label/Label";
import { SearchableSelect } from "../atoms/SearchableSelect/SearchableSelect";

interface DataTypeSelectProps {
  value: string;
  onValueChange: (dataTypeId: string) => void;
  studyTypeId?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  enabled?: boolean;
  label?: string;
  showLabel?: boolean;
  showAllOption?: boolean;
  allOptionLabel?: string;
}

/**
 * DataTypeSelect - A searchable dropdown component for selecting data types
 *
 * Features:
 * - Fetches data types from /api/v1/data-types/dropdown filtered by study type
 * - Provides searchable interface for easy selection
 * - Automatically shows search when more than 5 data types available
 * - Depends on study type selection
 *
 * @param value - Currently selected data type ID
 * @param onValueChange - Callback when data type selection changes
 * @param studyTypeId - Study type ID to filter data types (required for fetching)
 * @param placeholder - Placeholder text for the select
 * @param className - Additional CSS classes
 * @param disabled - Whether the select is disabled
 * @param enabled - Whether to fetch data types (default: true if studyTypeId is provided)
 */
export function DataTypeSelect({
  value,
  onValueChange,
  studyTypeId,
  placeholder = "Select Data Type",
  className,
  disabled = false,
  enabled = true,
  label,
  showLabel = true,
  showAllOption = false,
  allOptionLabel = "All Data Types",
}: DataTypeSelectProps) {
  const { dataTypes, loading } = useDataTypes({
    studyTypeId,
    enabled: enabled && !!studyTypeId,
  });

  // Transform data types to SearchableSelect option format
  const dataTypeOptions = dataTypes.map((dataType) => ({
    id: dataType.id.toString(),
    name: dataType.data_type_name,
  }));

  // Add "All Types" option at the beginning if showAllOption is true
  const optionsWithAll = showAllOption
    ? [{ id: "all", name: allOptionLabel }, ...dataTypeOptions]
    : dataTypeOptions;

  const isDisabled = disabled || loading || !studyTypeId;
  const placeholderText = !studyTypeId
    ? "Select study type first"
    : loading
      ? "Loading data types..."
      : placeholder;

  return (
    <>
      {showLabel && label && (
        <Label className="text-sm font-medium mb-2 inline-block">{label}</Label>
      )}
      <SearchableSelect
        options={optionsWithAll}
        value={value}
        onValueChange={onValueChange}
        placeholder={placeholderText}
        searchPlaceholder="Search data types..."
        showSearch={false}
        className={className}
        disabled={isDisabled}
      />
    </>
  );
}
