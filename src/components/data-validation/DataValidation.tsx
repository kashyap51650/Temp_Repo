import { useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";

import { RANDOMIZATION_PREVIEW_TYPES, statusOptions } from "@/lib/constants";

import { useModal, useValidationData } from "../../hooks";
import type { ExperimentDataItem } from "../../lib/api";
import { transformExperimentDataToValidationRows } from "../../lib/utils";
import { Card } from "../atoms";
import { Label } from "../atoms/Label/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/Select/Select";
import { DataTable } from "../organisms/DataTable/DataTable";
import { getValidationColumns } from "../organisms/DataTable/tableColumns";
import type { ValidationRow } from "../organisms/DataTable/tableData";
import { BioDOrganViewModal } from "./BioDOrganViewModal";
import { BioDWeightSheetViewModal } from "./BioDWeightSheetViewModal";
import { CalliperingSheetViewModal } from "./CalliperingSheetViewModal";
import { DataViewModal } from "./DataViewModal";

type FilterType = "status" | "data_type";

export default function DataValidation() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [dataTypeFilter, setDataTypeFilter] =
    useState<string>("All Data Types");
  const [selectedExperiment, setSelectedExperiment] =
    useState<ValidationRow | null>(null);
  const dataViewModal = useModal();
  const calliperingViewModal = useModal();
  const weightSheetViewModal = useModal();
  const organViewModal = useModal();

  const { data, isLoading, error, setFilters } = useValidationData();

  const normalizeStatus = (value: string) =>
    value === "All Status" ? undefined : value.toLowerCase();

  const normalizeDataType = (value: string) =>
    value === "All Data Types" ? undefined : value;

  const handleFilterChange = (type: FilterType, value: string) => {
    const nextStatus = type === "status" ? value : statusFilter;

    const nextDataType = type === "data_type" ? value : dataTypeFilter;

    if (type === "status") setStatusFilter(value);
    if (type === "data_type") setDataTypeFilter(value);

    setFilters({
      status: normalizeStatus(nextStatus),
      data_type: normalizeDataType(nextDataType),
    });
  };

  const dataTypeOptions = useMemo(() => {
    const baseOptions = [{ value: "All Data Types", label: "All Data Types" }];

    if (data?.items) {
      const uniqueDataTypes = Array.from(
        new Set(
          data.items.map(
            (item: ExperimentDataItem) => item.data_type.data_type_name
          )
        )
      ).map((dataType: string) => ({
        value: dataType,
        label: dataType,
      }));

      return [...baseOptions, ...uniqueDataTypes];
    }

    return baseOptions;
  }, [data?.items]);

  const tableData = useMemo(() => {
    if (!data?.items) return [];
    return transformExperimentDataToValidationRows(data.items);
  }, [data?.items]);

  const handleViewData = useCallback((experiment: ValidationRow) => {
    setSelectedExperiment(experiment);
    const dataTypeLower = experiment.dataType.toLowerCase();

    // Check if it's a callipering type sheet
    const isCalliperingSheet = dataTypeLower.includes("callipering");
    // Check if it's a weight sheet
    const isWeightSheet =
      dataTypeLower.includes("weight") && dataTypeLower.includes("sheet");
    // Check if it's a necropsy/organ sheet
    const isOrganSheet =
      dataTypeLower.includes("necropsy") || dataTypeLower.includes("organ");

    if (isCalliperingSheet) {
      calliperingViewModal.openModal();
    } else if (isWeightSheet) {
      weightSheetViewModal.openModal();
    } else if (isOrganSheet) {
      organViewModal.openModal();
    } else {
      dataViewModal.openModal();
    }
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
            <Label className="text-sm font-medium mb-2 inline-block">
              Filter by Status
            </Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-52">
            <Label className="text-sm font-medium mb-2 inline-block">
              Filter by Data Type
            </Label>
            <Select
              value={dataTypeFilter}
              onValueChange={(value) => handleFilterChange("data_type", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Data Types" />
              </SelectTrigger>
              <SelectContent>
                {dataTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="p-0 shadow-none border-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading experiment data...
            </div>
          ) : tableData.length > 0 ? (
            <DataTable columns={columns} data={tableData} />
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
          <CalliperingSheetViewModal
            isOpen={calliperingViewModal.isOpen}
            onClose={calliperingViewModal.closeModal}
            experimentName={selectedExperiment.experimentName}
            experimentDataId={selectedExperiment.id}
            experimentStatus={selectedExperiment.status}
          />
          <BioDWeightSheetViewModal
            isOpen={weightSheetViewModal.isOpen}
            onClose={weightSheetViewModal.closeModal}
            experimentName={selectedExperiment.experimentName}
            experimentDataId={selectedExperiment.id}
            experimentStatus={selectedExperiment.status}
          />
          <BioDOrganViewModal
            isOpen={organViewModal.isOpen}
            onClose={organViewModal.closeModal}
            experimentName={selectedExperiment.experimentName}
            experimentDataId={selectedExperiment.id}
            experimentStatus={selectedExperiment.status}
          />
        </>
      )}
    </>
  );
}
