import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  type DataType,
  dataTypeApi,
  type StudyType,
  studyTypeApi,
} from "@/api";
import { specialisationOptions } from "@/data/experiments";
import {
  DataValidationFilter,
  RANDOMIZATION_PREVIEW_TYPES,
  SELECT_ALL,
  statusOptions,
  STUDY_TYPE,
  STUDY_TYPE_CODE,
} from "@/lib/constants";

import {
  useExperimentDataModals,
  useModal,
  useMouseGroupsByExperiment,
  usePerformBioD,
  useValidationData,
} from "../../hooks";
import {
  generateQueryKey,
  transformExperimentDataToValidationRows,
} from "../../lib/utils";
import { Card } from "../atoms";
import { CreateExperimentModal } from "../data-upload/CreateExperimentModal";
import { AsyncSelect } from "../molecules";
import { BaseSelect } from "../molecules/BaseSelect";
import { DataTable } from "../organisms/DataTable/DataTable";
import { getValidationColumns } from "../organisms/DataTable/tableColumns";
import type { ValidationRow } from "../organisms/DataTable/tableData";
import { DataTableSkeleton } from "../skeletons/DataTableSkeleton";
import { PerformBioDModal } from "./PerformBioDModal";
import { SelectBioDExperimentModal } from "./SelectBioDExperimentModal";

export default function DataValidation() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [specializationFilter, setSpecializationFilter] =
    useState<string>(SELECT_ALL);
  const [studyTypeFilter, setStudyTypeFilter] = useState<string>(SELECT_ALL);
  const [dataTypeFilter, setDataTypeFilter] = useState<string>(SELECT_ALL);
  const [selectedExperiment, setSelectedExperiment] = useState<{
    id: number;
    name: string;
    projectId: number;
  } | null>(null);
  const [selectedMouseGroups, setSelectedMouseGroups] = useState<number[]>([]);
  const [preselectedCellLineIds, setPreselectedCellLineIds] = useState<
    number[]
  >([]);
  const [preselectedMouseStrainIds, setPreselectedMouseStrainIds] = useState<
    number[]
  >([]); // 👈 Add this state
  const [isBiodCellLinesDisabled, setIsBiodCellLinesDisabled] =
    useState<boolean>(false);

  const { handleViewData, renderModals } = useExperimentDataModals();
  const performBioDModal = useModal();
  const selectExperimentModal = useModal();
  const createExperimentModal = useModal();

  const { data, isLoading, error, setFilters, filters } = useValidationData();

  const { mouseGroups } = useMouseGroupsByExperiment(selectedExperiment?.id);

  const { performBioD, isPerforming } = usePerformBioD({
    onSuccess: () => {
      selectExperimentModal.closeModal();
      setSelectedExperiment(null);
      setSelectedMouseGroups([]);
      setPreselectedCellLineIds([]);
    },
  });

  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      page,
    });
  };

  const normalizeStatus = (value: string) =>
    value === "All Status" ? undefined : value.toLowerCase();

  const normalizeDataType = (value: string) =>
    value === SELECT_ALL ? undefined : value;

  const normalizeStudyType = (value: string) =>
    value === SELECT_ALL ? undefined : value;
  const normalizeSpecialization = (value: string) =>
    value === SELECT_ALL ? undefined : value;

  const handleFilterChange = (type: DataValidationFilter, value: string) => {
    const nextStatus =
      type === DataValidationFilter.Status ? value : statusFilter;
    const nextDataType =
      type === DataValidationFilter.DataType ? value : dataTypeFilter;
    const nextStudyType =
      type === DataValidationFilter.StudyType ? value : studyTypeFilter;
    const nextSpecialization =
      type === DataValidationFilter.Specialization
        ? value
        : specializationFilter;

    if (
      type === DataValidationFilter.Specialization &&
      String(value) !== specializationFilter
    ) {
      setSpecializationFilter(String(value));
      setStudyTypeFilter(SELECT_ALL);
      setDataTypeFilter(SELECT_ALL);
      setFilters({
        status: normalizeStatus(nextStatus),
        specialization: normalizeSpecialization(nextSpecialization),
        study_type: undefined,
        data_type: undefined,
      });
      return;
    }

    if (type === DataValidationFilter.Status) setStatusFilter(value);
    if (type === DataValidationFilter.DataType) setDataTypeFilter(value);
    if (type === DataValidationFilter.StudyType) setStudyTypeFilter(value);

    setFilters({
      status: normalizeStatus(nextStatus),
      data_type: normalizeDataType(nextDataType),
      study_type: normalizeStudyType(nextStudyType),
      specialization: normalizeSpecialization(nextSpecialization),
    });
  };

  const tableData = useMemo(() => {
    if (!data?.items) return [];
    return transformExperimentDataToValidationRows(data.items);
  }, [data?.items]);

  const handleRandomize = useCallback(
    (row: ValidationRow) => {
      const experimentData = data?.items.find(
        (item) => item.id === Number(row.id)
      );
      if (!experimentData) {
        toast.error("Experiment data not found for selected row");
        return;
      }

      // Determine randomization type based on data type and study type
      const isCalliperingSheet = row.dataType
        .toLowerCase()
        .includes("callipering");
      const isWeightSheetDoseRange =
        row.dataType.toLowerCase().includes("weight") &&
        row.studyType === STUDY_TYPE.DOSE_RANGE_FINDING;

      let randomizationType: string = RANDOMIZATION_PREVIEW_TYPES.BODY_WEIGHT; // default fallback
      if (isCalliperingSheet) {
        randomizationType = RANDOMIZATION_PREVIEW_TYPES.VOLUME;
      } else if (isWeightSheetDoseRange) {
        randomizationType = RANDOMIZATION_PREVIEW_TYPES.BODY_WEIGHT;
      }

      navigate({
        to: "/randomization-results",
        search: {
          experiment_id: experimentData?.experiment.id,
          mice_per_group: 5,
          randomization_type: randomizationType,
        },
      });
    },
    [data?.items, navigate]
  );

  const handlePerformBioD = useCallback(
    (row: ValidationRow) => {
      const experimentData = data?.items.find(
        (item) => item.id === Number(row.id)
      );
      if (!experimentData) {
        toast.error("Experiment data not found for selected row");
        return;
      }
      setSelectedExperiment({
        id: experimentData.experiment.id,
        name: experimentData.experiment.experiment_name,
        projectId: experimentData.project.id,
      });
      performBioDModal.openModal();
    },
    [data?.items, performBioDModal]
  );

  const handleSaveMouseGroups = (selectedGroupIds: number[]) => {
    setSelectedMouseGroups(selectedGroupIds);

    if (mouseGroups) {
      const cellLineIds = mouseGroups
        .filter((group) => selectedGroupIds.includes(group.id))
        .map((group) => group.cellLineId)
        .filter((id): id is number => id !== null && id !== undefined)
        .filter((id, index, self) => self.indexOf(id) === index); // unique IDs

      const mouseStrainIds = mouseGroups
        .filter((group) => selectedGroupIds.includes(group.id))
        .map((group) => group.mouseStrainId)
        .filter((id): id is number => id !== null && id !== undefined)
        .filter((id, index, self) => self.indexOf(id) === index); // unique IDs

      setPreselectedCellLineIds(cellLineIds);
      setPreselectedMouseStrainIds(mouseStrainIds); // 👈 Store mouse strain IDs
      setIsBiodCellLinesDisabled(true);
    }

    selectExperimentModal.openModal();
  };

  const handleProceedWithExperiment = async (targetExperimentId: number) => {
    if (!selectedExperiment || selectedMouseGroups.length === 0) {
      return;
    }

    await performBioD({
      group_ids: selectedMouseGroups,
      source_experiment_id: selectedExperiment.id,
      target_experiment_id: targetExperimentId,
    });
  };

  const handleCreateNewExperiment = () => {
    createExperimentModal.openModal();
  };

  const handleCloseSelectExperiment = () => {
    selectExperimentModal.closeModal();
    performBioDModal.openModal();
  };

  const handleCloseCreateExperiment = () => {
    createExperimentModal.closeModal();
  };

  const handleExperimentCreated = async (createdExperiment: {
    id: number;
    name: string;
  }) => {
    createExperimentModal.closeModal();

    if (selectedExperiment && selectedMouseGroups.length > 0) {
      await performBioD({
        group_ids: selectedMouseGroups,
        source_experiment_id: selectedExperiment.id,
        target_experiment_id: createdExperiment.id,
      });
    }
  };

  const handleStudyTypeChange = (value: string | string[]) => {
    const stringValue = String(value);
    handleFilterChange("study_type", stringValue);
    if (stringValue !== studyTypeFilter) {
      setDataTypeFilter(SELECT_ALL);
      setFilters({
        status: normalizeStatus(statusFilter),
        study_type: stringValue === SELECT_ALL ? undefined : stringValue,
        data_type: undefined,
      });
    }
  };

  const columns = useMemo(
    () =>
      getValidationColumns(
        handleViewData,
        handleRandomize,
        handlePerformBioD,
        tableData
      ),
    [handleViewData, handleRandomize, handlePerformBioD, tableData]
  );

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Data Validation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and validate uploaded experiment data
          </p>
        </div>
        <Card className="p-8 shadow-none border-0">
          <div className="text-center text-red-600">
            Error loading data: {error.message}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Data Validation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and validate uploaded experiment data
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-48">
            <label
              htmlFor="study-type-select"
              className="text-sm font-medium text-foreground block mb-2"
            >
              Filter by Status
            </label>
            <BaseSelect
              value={statusFilter}
              onChange={(value: string | string[]) =>
                handleFilterChange("status", String(value))
              }
              options={statusOptions}
              placeholder="All Status"
              disabled={false}
              searchable={false}
            />
          </div>
          <div className="w-full md:w-48">
            <label
              htmlFor="specialization-select"
              className="text-sm font-medium text-foreground block mb-2"
            >
              Filter by Specialization
            </label>
            <BaseSelect
              id="specialization-select"
              value={specializationFilter}
              onChange={(value: string | string[]) =>
                handleFilterChange(
                  DataValidationFilter.Specialization,
                  String(value)
                )
              }
              options={[
                { label: "All Specializations", value: SELECT_ALL },
                ...specialisationOptions,
              ]}
              placeholder="All Specializations"
              disabled={false}
              searchable={false}
            />
          </div>
          <div className="w-full md:w-48">
            <label
              htmlFor="study-type-select"
              className="text-sm font-medium text-foreground block mb-2"
            >
              Filter by Study Type
            </label>
            <AsyncSelect<StudyType>
              value={studyTypeFilter}
              onChange={handleStudyTypeChange}
              query={async () => {
                if (
                  specializationFilter &&
                  specializationFilter !== SELECT_ALL
                ) {
                  const response = await studyTypeApi.getStudyTypes(
                    normalizeSpecialization(specializationFilter),
                    "data_validate"
                  );
                  return response.data;
                }

                return [];
              }}
              mapConfig={{
                labelKey: "study_type_name",
                valueKey: "id",
              }}
              queryKey={generateQueryKey(
                "study-types",
                specializationFilter,
                "data_validate"
              )}
              allLabel="All Study Types"
              disabled={
                !specializationFilter || specializationFilter === SELECT_ALL
              }
              searchable={false}
            />
          </div>

          <div className="w-full md:w-52">
            <label
              htmlFor="data-type-select"
              className="text-sm font-medium text-foreground block mb-2"
            >
              Filter by Data Type
            </label>
            <AsyncSelect<DataType>
              value={dataTypeFilter}
              onChange={(value: string | string[]) =>
                handleFilterChange("data_type", String(value))
              }
              query={async () => {
                if (studyTypeFilter && studyTypeFilter !== SELECT_ALL) {
                  const response = await dataTypeApi.getDataTypes({
                    study_type_id: Number.parseInt(studyTypeFilter, 10),
                    module: "data_validate",
                  });
                  return response.data;
                }
                return [];
              }}
              mapConfig={{
                labelKey: "data_type_name",
                valueKey: "id",
              }}
              queryKey={generateQueryKey(
                "data-types",
                studyTypeFilter,
                "data_validate"
              )}
              allLabel="All Data Types"
              disabled={!studyTypeFilter || studyTypeFilter === SELECT_ALL}
              searchable={false}
            />
          </div>
        </div>

        <Card className="p-0 shadow-none border-0">
          {(() => {
            if (isLoading) {
              return <DataTableSkeleton columns={columns.length} rows={10} />;
            }

            if (tableData.length > 0) {
              return (
                <DataTable
                  columns={columns}
                  data={tableData}
                  paginationState={{
                    mode: "server",
                    currentPage: data?.pagination.page ?? 1,
                    totalPages: data?.pagination.pages ?? 1,
                    hasNextPage: data?.pagination.has_next ?? false,
                    hasPrevPage: data?.pagination.has_prev ?? false,
                    onPageChange: handlePageChange,
                  }}
                />
              );
            }

            return (
              <div className="p-8 text-center text-muted-foreground">
                No data available for validation.
              </div>
            );
          })()}
        </Card>
      </div>

      {renderModals()}

      {/* First Modal: Select Mouse Groups */}
      {selectedExperiment && (
        <PerformBioDModal
          isOpen={performBioDModal.isOpen}
          onClose={performBioDModal.closeModal}
          experimentId={selectedExperiment.id}
          experimentName={selectedExperiment.name}
          onSave={handleSaveMouseGroups}
        />
      )}

      {/* Second Modal: Select Target Experiment */}
      {selectedExperiment && (
        <SelectBioDExperimentModal
          isOpen={selectExperimentModal.isOpen}
          onClose={handleCloseSelectExperiment}
          sourceExperimentId={selectedExperiment.id}
          sourceProjectId={selectedExperiment.projectId}
          onProceed={handleProceedWithExperiment}
          onCreateNew={handleCreateNewExperiment}
          isProceedDisabled={isPerforming}
          cellLineIds={preselectedCellLineIds}
          mouseStrainIds={preselectedMouseStrainIds} // 👈 Pass mouse strain IDs
        />
      )}

      {/* Third Modal: Create New Bio Distribution Experiment */}
      {selectedExperiment && (
        <CreateExperimentModal
          isOpen={createExperimentModal.isOpen}
          onClose={handleCloseCreateExperiment}
          isotopeOptions={[]}
          cellLineOptions={[]}
          studyType={STUDY_TYPE_CODE.BIO_DISTRIBUTION}
          projectId={selectedExperiment.projectId}
          specialization="PRECLINICAL"
          studyTypeId={1}
          onExperimentCreated={handleExperimentCreated}
          preselectedStudyType={STUDY_TYPE_CODE.BIO_DISTRIBUTION}
          preselectedCellLineIds={preselectedCellLineIds}
          isBiodCellLineDisabled={isBiodCellLinesDisabled}
        />
      )}
    </>
  );
}
