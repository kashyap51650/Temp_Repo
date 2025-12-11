import { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearExperimentEvents } from "@/app/store/slices/experimentSlice";
import { Label } from "@/components/atoms/Label/Label";
import { ExperimentSelect } from "@/components/atoms/Selects";
import { useDataTypes, useExperimentsDropdown } from "@/hooks";

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
  } = useExperimentsDropdown({
    filters:
      projectId && specialization && studyTypeId
        ? {
            project_id: projectId,
            study_type_id: studyTypeId,
            specialization: specialization.toUpperCase(),
          }
        : undefined,
    enabled:
      isStudyTypeSelected && !!projectId && !!specialization && !!studyTypeId,
  });

  const dispatch = useAppDispatch();

  const { lastCreatedExperiment, experimentEventCounter } = useAppSelector(
    (state) => state.experiment
  );

  const processedExperimentCounter = useRef<number>(0);

  useEffect(() => {
    if (studyTypeId && isStudyTypeSelected && loadDataTypes) {
      loadDataTypes(studyTypeId);
    } else if (!isStudyTypeSelected && clearDataTypes) {
      clearDataTypes();
    }
  }, [studyTypeId, isStudyTypeSelected, loadDataTypes, clearDataTypes]);

  useEffect(() => {
    if (
      lastCreatedExperiment &&
      experimentEventCounter > 0 &&
      processedExperimentCounter.current !== experimentEventCounter
    ) {
      processedExperimentCounter.current = experimentEventCounter;

      const { experimentId, experimentName } = lastCreatedExperiment;

      const formattedExperiment = {
        id: experimentId,
        experiment_name: experimentName,
      };

      setFormData((prev: any) => ({
        ...prev,
        experiment: formattedExperiment,
      }));

      dispatch(clearExperimentEvents());
    }
  }, [experimentEventCounter, lastCreatedExperiment, setFormData, dispatch]);

  const {
    dataTypes: queryDataTypes,
    loading: queryDataTypesLoading,
    error: queryDataTypesError,
  } = useDataTypes({
    studyTypeId,
    enabled: isStudyTypeSelected && !!studyTypeId,
  });

  const actualDataTypes =
    queryDataTypes.length > 0 ? queryDataTypes : apiDataTypes || [];
  const actualDataTypesLoading = queryDataTypesLoading || dataTypesLoading;
  const actualDataTypesError = queryDataTypesError || dataTypesError;

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
      : existingExperiments
          .filter(
            (e: any) =>
              e.projectId === formData.project?.id &&
              e.studyType === formData.studyType
          )
          .map((exp: any) => ({
            id: exp.id ? exp.id.toString() : "",
            name: exp.experiment_name || exp.name,
            cellLines: [],
            isotope: "",
            projectId: projectId?.toString() || "",
            studyType: formData.studyType || "",
          }));

  const selectedExperimentId = formData.experiment
    ? formData.experiment.id
      ? formData.experiment.id.toString()
      : ""
    : "";

  const dataTypeOptions = actualDataTypes
    ? actualDataTypes.map((dataType: any) => ({
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
          value={selectedExperimentId}
          onValueChange={(val: string) => {
            const experiment = experimentsToShow.find((e: any) => e.id === val);

            const formattedExperiment = experiment
              ? {
                  id: parseInt(experiment.id),
                  experiment_name: experiment.name,
                }
              : null;

            setFormData((prev: any) => ({
              ...prev,
              experiment: formattedExperiment,
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
          disabled={!isExperimentSelected || actualDataTypesLoading}
          className={
            !isExperimentSelected || actualDataTypesLoading
              ? "opacity-50 cursor-not-allowed w-full"
              : "w-full"
          }
        />
        {!isExperimentSelected && (
          <span className="text-xs text-muted-foreground">
            Please select experiment to continue
          </span>
        )}
        {actualDataTypesLoading && (
          <span className="text-xs text-muted-foreground">
            Loading data types...
          </span>
        )}
        {actualDataTypesError && (
          <span className="text-xs text-red-500">
            Error loading data types: {actualDataTypesError}
          </span>
        )}
        {errors.dataType && (
          <span className="text-sm text-red-500">{errors.dataType}</span>
        )}
      </div>
    </div>
  );
}
