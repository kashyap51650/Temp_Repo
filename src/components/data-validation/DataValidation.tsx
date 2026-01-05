import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";

import type { DataType, StudyType } from "@/lib/api";
import { dataTypeApi, studyTypeApi } from "@/lib/api";
import {
  DataValidationFilter,
  RANDOMIZATION_PREVIEW_TYPES,
  SELECT_ALL,
  statusOptions,
} from "@/lib/constants";

import { useModal, useValidationData } from "../../hooks";
import { transformExperimentDataToValidationRows } from "../../lib/utils";
import { Card } from "../atoms";
import { AsyncSelect } from "../molecules";
import { BaseSelect } from "../molecules/BaseSelect";
import { DataTable } from "../organisms/DataTable/DataTable";
import { getValidationColumns } from "../organisms/DataTable/tableColumns";
import type { ValidationRow } from "../organisms/DataTable/tableData";
import { BioDOrganViewModal } from "./BioDOrganViewModal";
import { BioDWeightSheetViewModal } from "./BioDWeightSheetViewModal";
import { CalliperingSheetViewModal } from "./CalliperingSheetViewModal";
import { DataViewModal } from "./DataViewModal";

export default function DataValidation() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [studyTypeFilter, setStudyTypeFilter] = useState<string>(SELECT_ALL);
  const [dataTypeFilter, setDataTypeFilter] = useState<string>(SELECT_ALL);
  const [selectedExperiment, setSelectedExperiment] =
    useState<ValidationRow | null>(null);
  const dataViewModal = useModal();
  const calliperingViewModal = useModal();
  const weightSheetViewModal = useModal();
  const organViewModal = useModal();

  const { data, isLoading, error, setFilters, filters } = useValidationData();

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

  const handleFilterChange = (type: DataValidationFilter, value: string) => {
    const nextStatus =
      type === DataValidationFilter.Status ? value : statusFilter;
    const nextDataType =
      type === DataValidationFilter.DataType ? value : dataTypeFilter;
    const nextStudyType =
      type === DataValidationFilter.StudyType ? value : studyTypeFilter;

    if (type === DataValidationFilter.Status) setStatusFilter(value);
    if (type === DataValidationFilter.DataType) setDataTypeFilter(value);
    if (type === DataValidationFilter.StudyType) setStudyTypeFilter(value);

    setFilters({
      status: normalizeStatus(nextStatus),
      data_type: normalizeDataType(nextDataType),
      study_type: normalizeStudyType(nextStudyType),
    });
  };

  const tableData = useMemo(() => {
    if (!data?.items) return [];
    return transformExperimentDataToValidationRows(data.items);
  }, [data?.items]);

  const handleViewData = useCallback(
    (experiment: ValidationRow) => {
      setSelectedExperiment(experiment);
      const dataTypeLower = experiment.dataType.toLowerCase();

      // Check if it's a callipering type sheet
      const isCalliperingSheet = dataTypeLower.includes("callipering");

      // Check if it's a necropsy/organ sheet
      const isOrganSheet =
        dataTypeLower.includes("organ") && dataTypeLower.includes("sheet");
      // Check if it's a weight sheet
      const isWeightSheet =
        dataTypeLower.includes("weight") && dataTypeLower.includes("sheet");

      if (isCalliperingSheet) {
        calliperingViewModal.openModal();
        return;
      }

      if (isOrganSheet) {
        organViewModal.openModal();
        return;
      }

      if (isWeightSheet) {
        weightSheetViewModal.openModal();
        return;
      }

      dataViewModal.openModal();
    },
    [calliperingViewModal, dataViewModal, organViewModal, weightSheetViewModal]
  );

  const handleRandomize = useCallback(
    (row: ValidationRow) => {
      const experimentData = data?.items.find(
        (item) => item.id === Number(row.id)
      );
      if (!experimentData) {
        console.error("Experiment data not found for row:", row);
        return;
      }
      navigate({
        to: "/randomization-results",
        search: {
          experiment_id: experimentData?.experiment.id,
          mice_per_group: 5,
          randomization_type: RANDOMIZATION_PREVIEW_TYPES.VOLUME,
        },
      });
    },
    [data?.items, navigate]
  );

  const handleStudyTypeChange = (value: string | string[]) => {
    const stringValue = String(value);
    handleFilterChange("study_type", stringValue);
    // Reset data type when study type changes
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
    () => getValidationColumns(handleViewData, handleRandomize, tableData),
    [handleViewData, handleRandomize, tableData]
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
                const response = await studyTypeApi.getStudyTypes();
                return response.data;
              }}
              mapConfig={{
                labelKey: "study_type_name",
                valueKey: "id",
              }}
              queryKey={["study-types"]}
              allLabel="All Study Types"
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
                    study_type_id: parseInt(studyTypeFilter),
                  });
                  return response.data;
                }
                return [];
              }}
              mapConfig={{
                labelKey: "data_type_name",
                valueKey: "id",
              }}
              queryKey={["data-types", studyTypeFilter]}
              allLabel="All Data Types"
              disabled={!studyTypeFilter || studyTypeFilter === SELECT_ALL}
              searchable={false}
            />
          </div>
        </div>

        <Card className="p-0 shadow-none border-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading experiment data...
            </div>
          ) : tableData.length > 0 ? (
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
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No data available for validation.
            </div>
          )}
        </Card>
      </div>

      {selectedExperiment && (
        <>
          <DataViewModal
            isOpen={dataViewModal.isOpen}
            onClose={dataViewModal.closeModal}
            experiment={selectedExperiment}
          />
          {calliperingViewModal.isOpen && (
            <CalliperingSheetViewModal
              isOpen={calliperingViewModal.isOpen}
              onClose={calliperingViewModal.closeModal}
              experimentName={selectedExperiment.experimentName}
              experimentDataId={selectedExperiment.id}
              experimentStatus={selectedExperiment.status}
            />
          )}
          {weightSheetViewModal.isOpen && (
            <BioDWeightSheetViewModal
              isOpen={weightSheetViewModal.isOpen}
              onClose={weightSheetViewModal.closeModal}
              experimentName={selectedExperiment.experimentName}
              experimentDataId={selectedExperiment.id}
              experimentStatus={selectedExperiment.status}
            />
          )}
          {organViewModal.isOpen && (
            <BioDOrganViewModal
              isOpen={organViewModal.isOpen}
              onClose={organViewModal.closeModal}
              experimentName={selectedExperiment.experimentName}
              experimentDataId={selectedExperiment.id}
              experimentStatus={selectedExperiment.status}
            />
          )}
        </>
      )}
    </>
  );
}
