import { createFileRoute } from "@tanstack/react-router";
import { Plus, Share2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/atoms";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import { getVisualFilterColumns } from "@/components/organisms/DataTable/tableColumns";
import {
  visualFilterData,
  type VisualFilterRow,
} from "@/components/organisms/DataTable/tableData";
import {
  ProtectedComponent,
  ProtectedRoute,
} from "@/components/organisms/ProtectedRoute";
import { CreateFilterModal } from "@/components/templates/CreateFilterModal";
import { ShareFilterPopover } from "@/components/templates/ShareFilterPopover";
import { ViewFilterModal } from "@/components/templates/ViewFilterModal";
import { usePermissions } from "@/hooks/usePermissions";
import { logger } from "@/lib/logger";
import { PERMISSIONS } from "@/lib/permissions";

export const Route = createFileRoute("/templates")({
  component: () => (
    <ProtectedRoute permissions={PERMISSIONS.TEMPLATES.VIEW}>
      <TemplatesComponent />
    </ProtectedRoute>
  ),
});

function TemplatesComponent() {
  const { hasPermission } = usePermissions();
  const canShareFilter = hasPermission(PERMISSIONS.TEMPLATES.SHARE);

  const [filters, setFilters] = useState<VisualFilterRow[]>(visualFilterData);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<VisualFilterRow | null>(
    null
  );

  const handleViewFilter = (filter: VisualFilterRow) => {
    setSelectedFilter(filter);
    setIsViewModalOpen(true);
  };

  const handleCreateFilter = (filterData: {
    filterTitle: string;
    filterType: string;
    filterOptions: string[];
  }) => {
    const newFilter: VisualFilterRow = {
      id: `vf${filters.length + 1}`,
      filterName: filterData.filterTitle,
      createdDate: new Date().toISOString().split("T")[0],
      createdBy: "Current User",
      filterType: filterData.filterType as
        | "Text Box"
        | "Dropdown"
        | "Radio Button",
      filterOptions: filterData.filterOptions,
    };

    setFilters([...filters, newFilter]);
  };

  const handleShare = (shareData: {
    filterId: string;
    shareBy: "email" | "role";
    value: string;
    accessLevel: string;
  }) => {
    logger.debug("Sharing filter:", shareData);
  };

  const existingFilterNames = useMemo(
    () => filters.map((f) => f.filterName),
    [filters]
  );

  const renderShareAction = canShareFilter
    ? (filter: VisualFilterRow) => (
        <ShareFilterPopover
          filter={filter}
          onShare={handleShare}
          trigger={
            <Button variant="ghost" size="icon" aria-label="Share filter">
              <Share2 className="h-5 w-5" />
            </Button>
          }
        />
      )
    : undefined;

  const columns = getVisualFilterColumns(handleViewFilter, renderShareAction);

  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Templates</h1>
        <p className="text-muted-foreground">
          Manage visual data filters and templates
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Visual Data Filters</h2>
          <ProtectedComponent
            permissions={PERMISSIONS.TEMPLATES.CREATE}
            redirectTo={false}
          >
            <Button
              size="lg"
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2"
            >
              <Plus className="size-4" />
              Create Filter
            </Button>
          </ProtectedComponent>
        </div>

        {filters.length > 0 ? (
          <DataTable columns={columns} data={filters} />
        ) : (
          <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/50">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                No filters created yet.
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsCreateModalOpen(true)}
                className="gap-2"
              >
                <Plus className="size-4" />
                Create Your First Filter
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateFilterModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateFilter={handleCreateFilter}
        existingFilters={existingFilterNames}
      />

      <ViewFilterModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedFilter(null);
        }}
        filter={selectedFilter}
      />
    </div>
  );
}
