import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";

import { RANDOMIZATION_PREVIEW_TYPES, statusOptions } from "@/lib/constants";

import { useModal, useValidationData } from "../../hooks";
import { transformExperimentDataToValidationRows } from "../../lib/utils";
import { Card } from "../atoms";
import { DataTypeSelect, StatusSelect, StudyTypeSelect } from "../molecules";
import { DataTable } from "../organisms/DataTable/DataTable";
import { getValidationColumns } from "../organisms/DataTable/tableColumns";
import type { ValidationRow } from "../organisms/DataTable/tableData";
import { BioDOrganViewModal } from "./BioDOrganViewModal";
import { BioDWeightSheetViewModal } from "./BioDWeightSheetViewModal";
import { CalliperingSheetViewModal } from "./CalliperingSheetViewModal";
import { DataViewModal } from "./DataViewModal";

type FilterType = "status" | "data_type" | "study_type";

export default function DataValidation() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [studyTypeFilter, setStudyTypeFilter] = useState<string>("all");
  const [dataTypeFilter, setDataTypeFilter] = useState<string>("all");
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
    value === "all" ? undefined : value;

  const normalizeStudyType = (value: string) =>
    value === "all" ? undefined : value;

  const handleFilterChange = (type: FilterType, value: string) => {
    const nextStatus = type === "status" ? value : statusFilter;
    const nextDataType = type === "data_type" ? value : dataTypeFilter;
    const nextStudyType = type === "study_type" ? value : studyTypeFilter;

    if (type === "status") setStatusFilter(value);
    if (type === "data_type") setDataTypeFilter(value);
    if (type === "study_type") setStudyTypeFilter(value);

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

  const handleViewData = useCallback((experiment: ValidationRow) => {
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
  }, []);

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
    [data?.items]
  );

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
            <StatusSelect
              value={statusFilter}
              onValueChange={(value) => handleFilterChange("status", value)}
              options={statusOptions}
              placeholder="All Status"
              className="w-full"
              label="Filter by Status"
            />
          </div>
          <div className="w-full md:w-48">
            <StudyTypeSelect
              value={studyTypeFilter}
              onValueChange={(value) => {
                handleFilterChange("study_type", value);
                // Reset data type when study type changes
                if (value !== studyTypeFilter) {
                  setDataTypeFilter("all");
                  setFilters({
                    status: normalizeStatus(statusFilter),
                    study_type: value === "all" ? undefined : value,
                    data_type: undefined,
                  });
                }
              }}
              placeholder="All Study Types"
              className="w-full"
              label="Filter by Study Type"
              showAllOption={true}
            />
          </div>

          <div className="w-full md:w-52">
            <DataTypeSelect
              value={dataTypeFilter}
              onValueChange={(value) => handleFilterChange("data_type", value)}
              studyTypeId={
                studyTypeFilter ? parseInt(studyTypeFilter) : undefined
              }
              placeholder="All Data Types"
              className="w-full"
              label="Filter by Data Type"
              showAllOption={true}
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
