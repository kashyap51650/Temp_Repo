import { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearExperimentEvents } from "@/app/store/slices/experimentSlice";
import { Label } from "@/components/atoms/Label/Label";
import { ExperimentSelect } from "@/components/atoms/Selects";
import { useDataTypes, useExperimentsDropdown } from "@/hooks";
import type {
  DataType,
  ExperimentDropdownItem,
  Project,
  RandomizationStatus,
} from "@/lib/api";
import { DATA_TYPE } from "@/lib/constants";

import { ViewRandomizationButton } from "../molecules/ViewRandomizationButton/ViewRandomizationButton";
import { CustomSelect } from "./CustomSelect";

interface SelectOption {
  value: string;
  label: string;
  code?: string;
}

interface FormData {
  project: Project | null;
  specialisation: string;
  studyType: string;
  experiment: ExperimentDropdownItem | null;
  dataType: string;
  uploadedFile: File | null;
  newExperimentName?: string;
}

interface ValidationErrors {
  project?: string;
  specialisation?: string;
  studyType?: string;
  experiment?: string;
  dataType?: string;
  uploadedFile?: string;
}

interface LocalExperiment {
  id: string;
  name: string;
  cellLines: string[];
  isotope: string;
  projectId: string;
  studyType: string;
  randomization_status: RandomizationStatus;
}

interface ExperimentSectionProps {
  formData: FormData;
  setFormData: (updater: (prev: FormData) => FormData) => void;
  errors: ValidationErrors;

  onShowCreateExperimentModal?: () => void;
  isPreclinicSelected: boolean;
  isStudyTypeSelected: boolean;
  isExperimentSelected: boolean;
  projectId?: number;
  specialization?: string;
  studyTypeId?: number;
  apiDataTypes?: DataType[];
  dataTypesLoading?: boolean;
  dataTypesError?: string | null;
  loadDataTypes?: (studyTypeId: number) => void; // Keep for interface compatibility
  clearDataTypes?: () => void; // Keep for interface compatibility
}

export function ExperimentSection({
  formData,
  setFormData,
  errors,
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
}: Readonly<ExperimentSectionProps>) {
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

      const formattedExperiment: ExperimentDropdownItem = {
        id: experimentId,
        experiment_name: experimentName,
        randomization_status: lastCreatedExperiment.randomizationStatus,
      };

      setFormData((prev: FormData) => ({
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

  const experimentsToShow: LocalExperiment[] = apiExperiments.map(
    (exp: ExperimentDropdownItem) => ({
      id: exp.id.toString(),
      name: exp.experiment_name,
      cellLines: [],
      isotope: "",
      projectId: projectId?.toString() || "",
      studyType: formData.studyType || "",
      randomization_status: exp?.randomization_status ?? "pending",
    })
  );

  const selectedExperimentId = formData.experiment
    ? formData.experiment.id.toString()
    : "";

  const dataTypeOptions: SelectOption[] = actualDataTypes.map(
    (dataType: DataType) => ({
      value: dataType.data_type_name,
      label: dataType.data_type_name,
    })
  );

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
          showSearch={apiExperiments.length > 0}
          onValueChange={(val: string) => {
            const experiment = experimentsToShow.find(
              (e: LocalExperiment) => e.id === val
            );

            const formattedExperiment: ExperimentDropdownItem | null =
              experiment
                ? {
                    id: Number.parseInt(experiment.id, 10),
                    experiment_name: experiment.name,
                    randomization_status: experiment.randomization_status,
                  }
                : null;

            setFormData((prev: FormData) => ({
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
            setFormData((prev: FormData) => ({
              ...prev,
              dataType: selectedValue,
              uploadedFile: null, // Reset uploaded file when data type changes
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

      <div className="md:mt-6">
        {formData.experiment?.randomization_status === "completed" &&
          formData.dataType === DATA_TYPE.ORGAN_WEIGHT_SHEET && (
            <ViewRandomizationButton experimentId={formData.experiment?.id} />
          )}
      </div>
    </div>
  );
}
