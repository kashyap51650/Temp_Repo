import { useState } from "react";

import { Card } from "../atoms";
import { Label } from "../atoms/Label/Label";
import { DataTable } from "../organisms/DataTable/DataTable";
import { getUploadedDatasetColumns } from "../organisms/DataTable/tableColumns";
import { uploadedDatasetData } from "../organisms/DataTable/tableData";
import { CustomSelect } from "./CustomSelect";

export default function UploadedList() {
  const [statusFilter, setStatusFilter] = useState<string>("All Status");

  const statusOptions = [
    { label: "All Status", value: "All Status" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
  ];

  const filteredData = uploadedDatasetData.filter((item) => {
    if (statusFilter === "All Status") return true;
    return item.currentStatus === statusFilter;
  });

  const columns = getUploadedDatasetColumns();

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
          />
        </div>
      </div>

      <Card className="p-0 shadow-none border-0">
        <DataTable columns={columns} data={filteredData} />
      </Card>
    </div>
  );
}
