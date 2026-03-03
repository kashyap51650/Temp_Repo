import { useMemo } from "react";

import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";

import { SearchableSelect } from "./SearchableSelect/SearchableSelect";

type Project = { id: string; name: string };
type Experiment = {
  id: string;
  name: string;
  cellLines: string[];
  isotope: string;
  projectId?: string;
  studyType?: string;
};

export interface ProjectSelectProps {
  projects: Project[];
  value?: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  onCreateNew?: (name?: string) => void;
  className?: string;
  disabled?: boolean;
}

export function ProjectSelect({
  projects,
  value,
  placeholder = "Select project",
  onValueChange,
  onCreateNew,
  className,
  disabled = false,
}: Readonly<ProjectSelectProps>) {
  const { hasPermission } = usePermissions();
  const canCreateNew = hasPermission(PERMISSIONS.PROJECTS.CREATE);
  const selectOptions = useMemo(
    () =>
      projects.map((project) => ({
        value: project.id,
        label: project.name,
      })),
    [projects]
  );

  return (
    <SearchableSelect
      options={selectOptions}
      value={value}
      placeholder={placeholder}
      onValueChange={onValueChange}
      onCreateNew={onCreateNew}
      createNewLabel="Create New Project"
      className={className}
      searchPlaceholder="Search project..."
      showSearch={true}
      disabled={disabled}
      shouldShowCreateNew={canCreateNew}
      truncateValue={true}
    />
  );
}

export interface ExperimentSelectProps {
  experiments: Experiment[];
  value?: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  onCreateNew?: () => void;
  className?: string;
  disabled?: boolean;
  showSearch?: boolean;
}

export function ExperimentSelect({
  experiments,
  value,
  placeholder = "Select experiment",
  onValueChange,
  onCreateNew,
  className,
  disabled = false,
  showSearch = true,
}: Readonly<ExperimentSelectProps>) {
  const { hasPermission } = usePermissions();
  const canCreateNew = hasPermission(PERMISSIONS.EXPERIMENT.CREATE);
  const selectOptions = experiments.map((experiment) => ({
    value: experiment.id,
    label: experiment.name,
    subtitle: `${experiment.isotope}  ${experiment.cellLines.join(", ")}`,
  }));

  return (
    <SearchableSelect
      options={selectOptions}
      value={value}
      placeholder={placeholder}
      onValueChange={onValueChange}
      onCreateNew={onCreateNew}
      createNewLabel="Create New Experiment"
      className={className}
      searchPlaceholder="Search experiment..."
      showSearch={showSearch}
      disabled={disabled}
      shouldShowCreateNew={canCreateNew}
    />
  );
}
