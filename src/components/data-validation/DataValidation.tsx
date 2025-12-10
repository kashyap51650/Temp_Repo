import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

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
import {
  validationData,
  type ValidationRow,
} from "../organisms/DataTable/tableData";
import { DataViewModal } from "./DataViewModal";

export default function DataValidation() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [dataTypeFilter, setDataTypeFilter] =
    useState<string>("All Data Types");
  const [selectedExperiment, setSelectedExperiment] =
    useState<ValidationRow | null>(null);
  const [showDataViewModal, setShowDataViewModal] = useState(false);

  const statusOptions = [
    { value: "All Status", label: "All Status" },
    { value: "Pending", label: "Pending" },
    { value: "Validated", label: "Validated" },
    { value: "Error", label: "Error" },
  ];

  const dataTypeOptions = [
    { value: "All Data Types", label: "All Data Types" },
    { value: "Biodistribution_ProtXXX", label: "Biodistribution_ProtXXX" },
    { value: "Dose Range Finding", label: "Dose Range Finding" },
    { value: "Toxicity", label: "Toxicity" },
    { value: "Model Study", label: "Model Study" },
  ];

  const filteredData = validationData.filter((item) => {
    const statusMatch =
      statusFilter === "All Status" || item.status === statusFilter;
    const dataTypeMatch =
      dataTypeFilter === "All Data Types" || item.studyType === dataTypeFilter;
    return statusMatch && dataTypeMatch;
  });

  const handleViewData = (experiment: ValidationRow) => {
    setSelectedExperiment(experiment);
    setShowDataViewModal(true);
  };

  const handleRandomize = () => {
    navigate({ to: "/randomization-results" });
  };
  const columns = getValidationColumns(handleViewData, handleRandomize);

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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
            <Select value={dataTypeFilter} onValueChange={setDataTypeFilter}>
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
          {filteredData.length > 0 ? (
            <DataTable columns={columns} data={filteredData} />
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              No data available for validation.
            </div>
          )}
        </Card>
      </div>

      {selectedExperiment && (
        <DataViewModal
          isOpen={showDataViewModal}
          onClose={() => setShowDataViewModal(false)}
          experiment={selectedExperiment}
        />
      )}
    </>
  );
}
