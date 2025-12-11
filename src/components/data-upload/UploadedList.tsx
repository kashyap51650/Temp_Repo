import { useEffect, useState } from "react";

import { useUploadedExperimentData } from "../../hooks/useUploadedExperimentData";
import { Card } from "../atoms";
import { Label } from "../atoms/Label/Label";
import { Skeleton } from "../atoms/Skeleton/skeleton";
import { DataTable } from "../organisms/DataTable/DataTable";
import { getUploadedDatasetColumns } from "../organisms/DataTable/tableColumns";
import { CustomSelect } from "./CustomSelect";

export default function UploadedList() {
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [isInitialized, setIsInitialized] = useState(false);
  const { data, loading, error, loadData } = useUploadedExperimentData();

  const statusOptions = [
    { label: "All Status", value: "All Status" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
  ];

  useEffect(() => {
    if (isInitialized) {
      loadData({ status: statusFilter });
    }
  }, [statusFilter]);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const columns = getUploadedDatasetColumns();

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
            value={statusFilter}
            onValueChange={(value: string | string[]) => {
              const selectedValue =
                typeof value === "string" ? value : value[0];
              setStatusFilter(selectedValue);
            }}
            className="w-full"
            disabled={loading}
          />
        </div>
      </div>

      <Card className="p-0 shadow-none border-0">
        {loading ? (
          <div className="space-y-4 p-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex space-x-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
            ))}
          </div>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </Card>
    </div>
  );
}
