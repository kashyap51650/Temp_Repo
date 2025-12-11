import { Label } from "@/components/atoms/Label/Label";

import { CustomSelect } from "./CustomSelect";

interface SpecializationSectionProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  errors: any;
  specialisationOptions: any[];
  studyTypeOptions: any[];
  strainOptions: any[];
  isProjectSelected: boolean;
  isPreclinicSelected: boolean;
  isSpecialisationSelected: boolean;
  studyTypesLoading?: boolean;
  studyTypesError?: string | null;
  loadStudyTypes?: () => void;
  clearStudyTypes?: () => void;
}

export function SpecializationSection({
  formData,
  setFormData,
  errors,
  specialisationOptions,
  studyTypeOptions,
  isProjectSelected,
  isPreclinicSelected,
  isSpecialisationSelected,
  studyTypesLoading = false,
  studyTypesError,
}: SpecializationSectionProps) {
  const handleSpecialisationChange = (value: string | string[]) => {
    const selectedValue = typeof value === "string" ? value : value[0];
    setFormData((prev: any) => ({
      ...prev,
      specialisation: selectedValue,
      studyType: "",
    }));
  };

  return (
    <>
      {/* Specialisation */}
      <div className="space-y-2">
        <Label
          htmlFor="specialisation"
          className={`${!isProjectSelected ? "text-muted-foreground" : ""}`}
        >
          Specialisation
        </Label>
        <CustomSelect
          options={specialisationOptions}
          placeholder="Select specialisation"
          value={formData.specialisation}
          onValueChange={handleSpecialisationChange}
          disabled={!isProjectSelected}
          className={
            !isProjectSelected
              ? "opacity-50 cursor-not-allowed w-full"
              : "w-full"
          }
        />
        {!isProjectSelected && (
          <span className="text-xs text-muted-foreground">
            Please select a project to continue
          </span>
        )}
        {errors.specialisation && (
          <span className="text-sm text-red-500">{errors.specialisation}</span>
        )}
      </div>

      {/* Study Type - Only show when preclinical is selected */}
      {isPreclinicSelected && (
        <div className="space-y-2">
          <Label
            htmlFor="studyType"
            className={`${!isSpecialisationSelected ? "text-muted-foreground" : ""}`}
          >
            Study Type
          </Label>
          <CustomSelect
            options={studyTypeOptions}
            placeholder="Select study type"
            value={formData.studyType}
            onValueChange={(value: string | string[]) => {
              const selectedValue =
                typeof value === "string" ? value : value[0];
              setFormData((prev: any) => ({
                ...prev,
                studyType: selectedValue,
              }));
            }}
            disabled={!isSpecialisationSelected || studyTypesLoading}
            className={
              !isSpecialisationSelected || studyTypesLoading
                ? "opacity-50 cursor-not-allowed w-full"
                : "w-full"
            }
          />
          {!isSpecialisationSelected && (
            <span className="text-xs text-muted-foreground">
              Please select specialisation to continue
            </span>
          )}
          {studyTypesError && (
            <span className="text-xs text-red-500">
              Error loading study types: {studyTypesError}
            </span>
          )}
          {errors.studyType && (
            <span className="text-sm text-red-500">{errors.studyType}</span>
          )}
        </div>
      )}
    </>
  );
}
