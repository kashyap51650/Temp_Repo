import { CircleX, FolderOpen } from "lucide-react";

import { Input } from "@/components/atoms";
import { Badge } from "@/components/atoms/Badge/Badge";
import { Button } from "@/components/atoms/Button/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/Select";
import type { ExperimentRow } from "@/components/organisms/DataTable/tableData";

interface ExperimentListProps {
  experiments: ExperimentRow[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  onExperimentClick?: (exp: ExperimentRow) => void;
  onCloseExperiment?: (exp: ExperimentRow) => void;
}

export function ExperimentList({
  experiments,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onExperimentClick,
  onCloseExperiment,
}: ExperimentListProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "default";
      case "Pending":
        return "secondary";
      case "Rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const filteredExperiments = experiments.filter((exp) => {
    const matchesSearch = exp.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || exp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-2">
        <div className="flex flex-row items-center gap-4">
          <Input
            type="text"
            placeholder="Search experiments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-md"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Status">All Status</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2  px-4 py-2 text-sm font-medium text-muted-foreground border-b">
        <span>Experiment Name</span>
        <span className="flex justify-between w-96 ml-auto">Status</span>
        <span></span>
      </div>
      <div className="space-y-2">
        {filteredExperiments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No experiments found for this project
          </div>
        ) : (
          filteredExperiments.map((experiment) => (
            <div
              key={experiment.id}
              className="grid grid-cols-2 gap-4 items-center border-b hover:bg-muted/30 transition-colors  p-2 border rounded-lg mt-4"
            >
              <Button
                variant={"ghost"}
                className=" gap-3 flex-1 hover:bg-transparent text-left items-start justify-start h-auto"
                onClick={() => onExperimentClick?.(experiment)}
              >
                <FolderOpen className="size-6 text-muted-foreground shrink-0" />
                <div>
                  <h3 className="font-medium">{experiment.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {experiment.status}
                  </p>
                </div>
              </Button>
              <div className="flex justify-between w-96 ml-auto">
                <Badge variant={getStatusBadgeVariant(experiment.status)}>
                  {experiment.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCloseExperiment?.(experiment)}
                >
                  <CircleX className="size-4 text-destructive" />
                  Close Experiment
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
