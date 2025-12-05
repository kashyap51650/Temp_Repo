import { useEffect } from "react";

import { Label } from "@/components/atoms/Label/Label";
import { ExperimentSelect } from "@/components/atoms/Selects";
import { useExperimentsDropdown } from "@/hooks";

import { CustomSelect } from "./CustomSelect";

interface ExperimentSectionProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  errors: any;
  existingExperiments: any[];
  onShowCreateExperimentModal?: () => void;
  isPreclinicSelected: boolean;
  isStudyTypeSelected: boolean;
  isExperimentSelected: boolean;
  projectId?: number;
  specialization?: string;
  studyTypeId?: number;
  apiDataTypes?: any[];
  dataTypesLoading?: boolean;
  dataTypesError?: string | null;
  loadDataTypes?: (studyTypeId: number) => void;
  clearDataTypes?: () => void;
}

export function ExperimentSection({
  formData,
  setFormData,
  errors,
  existingExperiments,
  onShowCreateExperimentModal,
  isPreclinicSelected,
  isStudyTypeSelected,
  isExperimentSelected,
  projectId,
  specialization,
  studyTypeId,
  apiDataTypes,
  dataTypesLoading,
  dataTypesError,
  loadDataTypes,
  clearDataTypes,
}: ExperimentSectionProps) {
  const {
    experiments: apiExperiments,
    loading: experimentsLoading,
    error: experimentsError,
    loadExperiments,
    clearExperiments,
  } = useExperimentsDropdown();

  useEffect(() => {
    if (isStudyTypeSelected && projectId && specialization && studyTypeId) {
      loadExperiments({
        project_id: projectId,
        study_type_id: studyTypeId,
        specialization: specialization.toUpperCase(),
      });
    } else if (!isStudyTypeSelected) {
      clearExperiments();
    }
  }, [
    isStudyTypeSelected,
    projectId,
    specialization,
    studyTypeId,
    loadExperiments,
    clearExperiments,
  ]);

  useEffect(() => {
    if (studyTypeId && isStudyTypeSelected && loadDataTypes) {
      loadDataTypes(studyTypeId);
    } else if (!isStudyTypeSelected && clearDataTypes) {
      clearDataTypes();
    }
  }, [studyTypeId, isStudyTypeSelected, loadDataTypes, clearDataTypes]);

  useEffect(() => {
    const handleExperimentCreated = (event: CustomEvent) => {
      const { experimentId, experimentName } = event.detail;

      if (projectId && specialization && studyTypeId) {
        loadExperiments({
          project_id: projectId,
          study_type_id: studyTypeId,
          specialization: specialization.toUpperCase(),
        }).then(() => {
          const experimentToSelect = {
            id: experimentId.toString(),
            name: experimentName,
            cellLines: [],
            isotope: "",
            projectId: projectId?.toString() || "",
            studyType: formData.studyType || "",
          };

          setFormData((prev: any) => ({
            ...prev,
            experiment: experimentToSelect,
          }));
        });
      }
    };

    const handleProjectChanged = (event: CustomEvent) => {
      const {
        newProjectId,
        specialization: newSpecialization,
        studyType,
      } = event.detail;

      clearExperiments();
      setFormData((prev: any) => ({
        ...prev,
        experiment: null,
        dataType: "",
      }));

      if (newProjectId && newSpecialization && studyType && studyTypeId) {
        loadExperiments({
          project_id: newProjectId,
          study_type_id: studyTypeId,
          specialization: newSpecialization.toUpperCase(),
        });
      }
    };

    window.addEventListener(
      "experimentCreated",
      handleExperimentCreated as EventListener
    );
    window.addEventListener(
      "projectChanged",
      handleProjectChanged as EventListener
    );

    return () => {
      window.removeEventListener(
        "experimentCreated",
        handleExperimentCreated as EventListener
      );
      window.removeEventListener(
        "projectChanged",
        handleProjectChanged as EventListener
      );
    };
  }, [
    projectId,
    specialization,
    studyTypeId,
    loadExperiments,
    clearExperiments,
    setFormData,
    formData.studyType,
  ]);

  const experimentsToShow =
    apiExperiments.length > 0
      ? apiExperiments.map((exp: any) => ({
          id: exp.id.toString(),
          name: exp.experiment_name,
          cellLines: [],
          isotope: "",
          projectId: projectId?.toString() || "",
          studyType: formData.studyType || "",
        }))
      : existingExperiments.filter(
          (e: any) =>
            e.projectId === formData.project?.id &&
            e.studyType === formData.studyType
        );

  const dataTypeOptions = apiDataTypes
    ? apiDataTypes.map((dataType: any) => ({
        value: dataType.data_type_name,
        label: dataType.data_type_name,
      }))
    : [];

  if (!isPreclinicSelected) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label
          htmlFor="experiment"
          className={`${!isStudyTypeSelected ? "text-muted-foreground" : ""}`}
        >
          Experiment
        </Label>

        <ExperimentSelect
          experiments={experimentsToShow}
          value={formData.experiment?.id || ""}
          onValueChange={(val: string) => {
            const experiment = experimentsToShow.find((e: any) => e.id === val);
            setFormData((prev: any) => ({
              ...prev,
              experiment: experiment || null,
            }));
          }}
          onCreateNew={() => onShowCreateExperimentModal?.()}
          disabled={!isStudyTypeSelected || experimentsLoading}
          className={
            !isStudyTypeSelected || experimentsLoading
              ? "opacity-50 cursor-not-allowed w-full"
              : "w-full"
          }
        />

        {!isStudyTypeSelected && (
          <span className="text-xs text-muted-foreground">
            Please select study type to continue
          </span>
        )}
        {experimentsError && (
          <span className="text-xs text-red-500">
            Error loading experiments: {experimentsError}
          </span>
        )}
        {errors.experiment && (
          <span className="text-sm text-red-500">{errors.experiment}</span>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="dataType"
          className={`${!isExperimentSelected ? "text-muted-foreground" : ""}`}
        >
          Data Type
        </Label>
        <CustomSelect
          options={dataTypeOptions}
          placeholder="Select data type"
          value={formData.dataType}
          onValueChange={(value: string | string[]) => {
            const selectedValue = typeof value === "string" ? value : value[0];
            setFormData((prev: any) => ({
              ...prev,
              dataType: selectedValue,
            }));
          }}
          disabled={!isExperimentSelected || dataTypesLoading}
          className={
            !isExperimentSelected || dataTypesLoading
              ? "opacity-50 cursor-not-allowed w-full"
              : "w-full"
          }
        />
        {!isExperimentSelected && (
          <span className="text-xs text-muted-foreground">
            Please select experiment to continue
          </span>
        )}
        {dataTypesLoading && (
          <span className="text-xs text-muted-foreground">
            Loading data types...
          </span>
        )}
        {dataTypesError && (
          <span className="text-xs text-red-500">
            Error loading data types: {dataTypesError}
          </span>
        )}
        {errors.dataType && (
          <span className="text-sm text-red-500">{errors.dataType}</span>
        )}
      </div>
    </div>
  );
}
