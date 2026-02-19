import { useSearch } from "@tanstack/react-router";
import { CircleX, FolderOpen } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/atoms";
import { Badge } from "@/components/atoms/Badge/Badge";
import { Button } from "@/components/atoms/Button/Button";
import useDebounce from "@/hooks/useDebounce";
import { useExperimentsList } from "@/hooks/useExperimentsList";
import {
  DEFAULT_DEBOUNCE_DELAY,
  DEFAULT_PAGE_SIZE,
  EXPERIMENT_STATUS,
  type ExperimentStatus,
  SELECT_ALL,
} from "@/lib/constants";
import { PERMISSIONS } from "@/lib/permissions";
import type { Experiment } from "@/types/experiment";

import { BaseSelect } from "../molecules/BaseSelect";
import { PaginationControls } from "../organisms/DataTable/PaginationControls";
import { ProtectedComponent } from "../organisms/ProtectedRoute";

interface ExperimentListProps {
  onExperimentClick?: (exp: Experiment) => void;
  onCloseExperiment?: (exp: Experiment) => void;
}

export function ExperimentList({
  onExperimentClick,
  onCloseExperiment,
}: Readonly<ExperimentListProps>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ExperimentStatus | "all">(
    SELECT_ALL
  );
  const debounceValue = useDebounce(searchQuery, DEFAULT_DEBOUNCE_DELAY);

  const search = useSearch({
    from: "/project-folders",
  });

  const {
    data: experimentsData,
    isLoading,
    isFetching,
    error,
  } = useExperimentsList({
    project_id: search?.projectId,
    search: debounceValue || undefined,
    page: currentPage,
    size: DEFAULT_PAGE_SIZE,
    status: statusFilter === SELECT_ALL ? undefined : statusFilter,
  });

  const experiments = experimentsData?.data?.items || [];
  const totalItems = experimentsData?.data?.pagination?.total ?? 0;
  const totalPages = Math.ceil(totalItems / DEFAULT_PAGE_SIZE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Experiment status options
  const experimentOptions = [
    { value: SELECT_ALL, label: "All Status" },
    { value: EXPERIMENT_STATUS.PLANNED, label: "Planned" },
    {
      value: EXPERIMENT_STATUS.ONGOING,
      label: "Ongoing",
    },
    { value: EXPERIMENT_STATUS.COMPLETED, label: "Completed" },
    { value: EXPERIMENT_STATUS.TERMINATED, label: "Terminated" },
    { value: EXPERIMENT_STATUS.CLOSED, label: "Closed" },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case EXPERIMENT_STATUS.PLANNED:
        return "info";
      case EXPERIMENT_STATUS.COMPLETED:
        return "success";
      case EXPERIMENT_STATUS.TERMINATED:
        return "destructive";
      case EXPERIMENT_STATUS.CLOSED:
        return "outline";
      case EXPERIMENT_STATUS.ONGOING:
        return "secondary";
      default:
        return "secondary";
    }
  };

  const loading = isLoading && isFetching;

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <div className="flex flex-row items-center gap-4">
          <Input
            type="text"
            placeholder="Search experiments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-md"
          />
          <div>
            <BaseSelect
              options={experimentOptions}
              onChange={(value) =>
                setStatusFilter(value as ExperimentStatus | "all")
              }
              value={statusFilter}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {loading && (
          <div className="text-center py-8 text-muted-foreground">
            Loading experiments...
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-destructive">
            Error loading experiments: {error.message}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2  px-4 py-2 text-sm font-medium text-muted-foreground border-b">
              <span>Experiment Name</span>
              <span className="flex justify-between w-96 ml-auto">Status</span>
              <span></span>
            </div>
            <div className="space-y-3">
              {experiments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchQuery
                    ? `No experiments found matching "${searchQuery}"`
                    : "No experiments available"}
                </div>
              ) : (
                experiments.map((experiment) => (
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
                        <h3 className="font-medium">
                          {experiment.experiment_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {experiment.status}
                        </p>
                      </div>
                    </Button>
                    <div className="flex justify-between w-96 ml-auto">
                      <Badge variant={getStatusBadgeVariant(experiment.status)}>
                        {experimentOptions.find(
                          (opt) => opt.value === experiment.status
                        )?.label || experiment.status}
                      </Badge>
                      <ProtectedComponent
                        permissions={PERMISSIONS.EXPERIMENT.CLOSE}
                        redirectTo={false}
                      >
                        {experiment.status !== EXPERIMENT_STATUS.CLOSED && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onCloseExperiment?.(experiment)}
                          >
                            <CircleX className="size-4 text-destructive" />
                            Close Experiment
                          </Button>
                        )}
                      </ProtectedComponent>
                    </div>
                  </div>
                ))
              )}
            </div>
            {experiments.length > 0 && (
              <PaginationControls
                pagination={{
                  page: currentPage,
                  totalPages,
                  canNext: currentPage < totalPages,
                  canPrev: currentPage > 1,
                  onFirst: () => setCurrentPage(1),
                  onPrev: () => setCurrentPage(currentPage - 1),
                  onNext: () => setCurrentPage(currentPage + 1),
                  onLast: () => setCurrentPage(totalPages),
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
