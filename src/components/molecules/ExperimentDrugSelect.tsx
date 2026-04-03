import { useExperimentsDrugsDropdown } from "@/hooks/useExperimentDrugsDropdown";
import type { DrugDropdownOption } from "@/types/common";

import { SearchableSelect } from "../atoms/SearchableSelect/SearchableSelect";

interface ExperimentDrugSelectProps {
  value: string;
  onValueChange?: (drugId: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  projectId: number;
}

/**
 * ExperimentDrugSelect - A searchable dropdown component for selecting experiment drugs
 *
 * Features:
 * - Fetches experiment drugs via useExperimentsDrugsDropdown hook
 * - Provides searchable interface for easy drug selection
 * - Automatically shows search when more than 5 drugs available
 *
 * @param value - Currently selected drug ID
 * @param onValueChange - Callback when drug selection changes
 * @param placeholder - Placeholder text for the select
 * @param className - Additional CSS classes
 * @param disabled - Whether the select is disabled
 * @param projectId - ID of the project to fetch drugs for
 */
export function ExperimentDrugSelect({
  value,
  onValueChange = () => {},
  placeholder = "Select Drug",
  className,
  disabled = false,
  projectId,
}: Readonly<ExperimentDrugSelectProps>) {
  const { experimentDrugs, loading } = useExperimentsDrugsDropdown(projectId);

  // Transform experiment drugs to SearchableSelect option format
  const drugOptions = experimentDrugs.map((drug: DrugDropdownOption) => ({
    label: drug.drug_display_name,
    value: drug.id.toString(),
  }));

  return (
    <SearchableSelect
      options={drugOptions}
      value={value}
      onValueChange={onValueChange}
      placeholder={loading ? "Loading drugs..." : placeholder}
      searchPlaceholder="Search drugs..."
      showSearch={true}
      className={className}
      disabled={disabled || loading}
    />
  );
}
