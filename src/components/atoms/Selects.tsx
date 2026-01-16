import { SearchableSelect } from "./SearchableSelect/SearchableSelect";

type Project = { id: string; name: string };
type Experiment = {
  id: string;
  name: string;
  cellLines: string[];
  isotope: string;
  projectId: string;
  studyType: string;
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
  const selectOptions = projects.map((project) => ({
    value: project.id,
    label: project.name,
  }));

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
    />
  );
}
