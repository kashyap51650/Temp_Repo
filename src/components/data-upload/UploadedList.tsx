import { useState } from "react";

import { useExperimentDataModals } from "../../hooks/useExperimentDataModals";
import { useUploadedExperimentData } from "../../hooks/useUploadedExperimentData";
import { Card } from "../atoms";
import { Label } from "../atoms/Label/Label";
import { DataTable } from "../organisms/DataTable/DataTable";
import { getUploadedDatasetColumns } from "../organisms/DataTable/tableColumns";
import { DataTableSkeleton } from "../skeletons/DataTableSkeleton";
import { CustomSelect } from "./CustomSelect";

export default function UploadedList() {
  const [status, setStatus] = useState<string>("All Status");
  const { data, loading, error, pagination, setFilters } =
    useUploadedExperimentData();

  const { handleViewData, renderModals } = useExperimentDataModals({
    hideActions: true,
  });

  const statusOptions = [
    { label: "All Status", value: "All Status" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
  ];

  const columns = getUploadedDatasetColumns(handleViewData);

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
          <div className="w-48">
            <Label className="mb-2">Filter by Status</Label>
            <CustomSelect
              options={statusOptions}
              placeholder="All Status"
              value={status}
              onValueChange={(value: string | string[]) => {
                const selectedValue =
                  typeof value === "string" ? value : value[0];
                setStatus(selectedValue);
                setFilters({
                  status: selectedValue === "All Status" ? "" : selectedValue,
                });
              }}
              className="w-full"
              disabled={loading}
            />
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
                  setFilters({ page: page });
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
