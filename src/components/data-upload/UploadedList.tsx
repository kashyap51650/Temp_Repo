import { useCallback, useMemo, useState } from "react";

import { type DataType, dataTypeApi } from "@/api";
import { SELECT_ALL } from "@/lib/constants";
import { generateQueryKey } from "@/lib/utils";

import { useExperimentDataModals } from "../../hooks/useExperimentDataModals";
import { useUploadedExperimentData } from "../../hooks/useUploadedExperimentData";
import { Card } from "../atoms";
import { Label } from "../atoms/Label/Label";
import { AsyncSelect } from "../molecules";
import { DataTable } from "../organisms/DataTable/DataTable";
import { getUploadedDatasetColumns } from "../organisms/DataTable/tableColumns";
import { DataTableSkeleton } from "../skeletons/DataTableSkeleton";
import { CustomSelect } from "./CustomSelect";

const STATUS_OPTIONS = [
  { label: "All Status", value: "All Status" },
  { label: "Pending", value: "Pending" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

export default function UploadedList() {
  const [status, setStatus] = useState<string>("All Status");
  const [dataType, setDataType] = useState<string>(SELECT_ALL);
  const { data, loading, error, pagination, setFilters } =
    useUploadedExperimentData();

  const { handleViewData, renderModals } = useExperimentDataModals({
    hideActions: true,
  });

  const columns = useMemo(
    () => getUploadedDatasetColumns(handleViewData),
    [handleViewData]
  );

  const handleStatusChange = useCallback(
    (value: string | string[]) => {
      const selectedValue = typeof value === "string" ? value : value[0];
      setStatus(selectedValue);
      setFilters({
        status: selectedValue === "All Status" ? "" : selectedValue,
        data_type: dataType === SELECT_ALL ? undefined : dataType,
      });
    },
    [setFilters, dataType]
  );

  const handleDataTypeChange = useCallback(
    (value: string | string[]) => {
      const selectedValue = typeof value === "string" ? value : value[0];
      setDataType(selectedValue);
      setFilters({
        status: status === "All Status" ? "" : status,
        data_type: selectedValue === SELECT_ALL ? undefined : selectedValue,
      });
    },
    [setFilters, status]
  );

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-0 text-foreground">
              Uploaded Data Listing
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              View all uploaded experiment data and their validation status
            </p>
          </div>
        </div>
        <Card className="p-6 text-center">
          <p className="text-destructive">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-0 text-foreground">
              Uploaded Data Listing
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              View all uploaded experiment data and their validation status
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-48">
              <Label className="mb-2">Filter by Status</Label>
              <CustomSelect
                options={STATUS_OPTIONS}
                placeholder="All Status"
                value={status}
                onValueChange={handleStatusChange}
                className="w-full"
                disabled={loading}
              />
            </div>
            <div className="w-48">
              <label
                htmlFor="data-type-select"
                className="text-sm font-medium text-foreground block mb-2"
              >
                Filter by Data Type
              </label>
              <AsyncSelect<DataType>
                id="data-type-select"
                value={dataType}
                onChange={handleDataTypeChange}
                query={async () => {
                  const response = await dataTypeApi.getDataTypes({
                    module: "data_upload",
                  });
                  return response.data;
                }}
                mapConfig={{
                  labelKey: "data_type_name",
                  valueKey: "id",
                }}
                queryKey={generateQueryKey("data-types", "data_upload")}
                allLabel="All Data Types"
                disabled={false}
                searchable={false}
              />
            </div>
          </div>
        </div>

        <Card className="p-0 shadow-none border-0">
          {loading ? (
            <DataTableSkeleton columns={columns.length} rows={10} />
          ) : (
            <DataTable
              columns={columns}
              data={data}
              paginationState={{
                mode: "server",
                currentPage: pagination?.page ?? 1,
                totalPages: pagination?.pages ?? 1,
                hasNextPage: pagination?.has_next ?? false,
                hasPrevPage: pagination?.has_prev ?? false,
                onPageChange: (page: number) => {
                  setFilters({
                    page: page,
                    status: status === "All Status" ? "" : status,
                    data_type: dataType === SELECT_ALL ? undefined : dataType,
                  });
                },
              }}
            />
          )}
        </Card>
      </div>

      {renderModals()}
    </>
  );
}
