import { useStudyTypes } from "@/hooks/useStudyTypes";

import { Label } from "../atoms/Label/Label";
import { SearchableSelect } from "../atoms/SearchableSelect/SearchableSelect";

interface StudyTypeSelectProps {
  value: string;
  onValueChange: (studyTypeId: string) => void;
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
 * StudyTypeSelect - A searchable dropdown component for selecting study types
 *
 * Features:
 * - Fetches study types from /api/v1/study-types/dropdown
 * - Provides searchable interface for easy selection
 * - Automatically shows search when more than 5 study types available
 *
 * @param value - Currently selected study type ID
 * @param onValueChange - Callback when study type selection changes
 * @param placeholder - Placeholder text for the select
 * @param className - Additional CSS classes
 * @param disabled - Whether the select is disabled
 * @param enabled - Whether to fetch study types (default: true)
 */
export function StudyTypeSelect({
  value,
  onValueChange,
  placeholder = "Select Study Type",
  className,
  disabled = false,
  enabled = true,
  label,
  showLabel = true,
  showAllOption = false,
  allOptionLabel = "All Study Types",
}: StudyTypeSelectProps) {
  const { studyTypes, loading } = useStudyTypes({ enabled });

  // Transform study types to SearchableSelect option format
  const studyTypeOptions = studyTypes.map((studyType) => ({
    id: studyType.id.toString(),
    name: studyType.study_type_name,
  }));

  // Add "All Types" option at the beginning if showAllOption is true
  const optionsWithAll = showAllOption
    ? [{ id: "all", name: allOptionLabel }, ...studyTypeOptions]
    : studyTypeOptions;

  return (
    <>
      {showLabel && label && (
        <Label className="text-sm font-medium mb-2 inline-block">{label}</Label>
      )}
      <SearchableSelect
        options={optionsWithAll}
        value={value}
        onValueChange={onValueChange}
        placeholder={loading ? "Loading study types..." : placeholder}
        searchPlaceholder="Search study types..."
        showSearch={false}
        className={className}
        disabled={disabled || loading}
      />
    </>
  );
}
