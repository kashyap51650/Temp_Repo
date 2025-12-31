import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/Button/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/Select";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { DynamicMasterDataFormModal } from "@/components/DynamicMasterDataFormModal";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import {
  createDynamicMasterDataColumns,
  type TableDataItem,
} from "@/components/organisms/DataTable/dynamicColumns";
import { type MasterDataItem, useMasterData } from "@/hooks/useMasterData";
import {
  type MasterDataSource,
  useMasterDataSources,
} from "@/hooks/useMasterDataSources";

export const Route = createFileRoute("/master-data")({
  component: MasterDataComponent,
});

function transformDataForTable(data: MasterDataItem[]): TableDataItem[] {
  return data.map((item) => ({ ...item, id: item.id.toString() }));
}

function MasterDataComponent() {
  const [selectedSource, setSelectedSource] = useState<MasterDataSource | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MasterDataItem | null>(null);

  const {
    data: masterDataSources = [],
    isLoading: sourcesLoading,
    error: sourcesError,
  } = useMasterDataSources();

  const {
    data,
    loading,
    addItem,
    updateItem,
    deleteItem,
    filters,
    setFilters,
  } = useMasterData(selectedSource?.slug || null);

  const handleSourceChange = (value: string) => {
    const source = (masterDataSources as MasterDataSource[]).find(
      (s: MasterDataSource) => s.slug === value
    );
    setSelectedSource(source || null);
    setFilters({ page: 1, size: 10 });
  };

  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      page,
    });
  };

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const handleEdit = (item: TableDataItem) => {
    const originalItem: MasterDataItem = {
      ...item,
      id: Number(item.id),
      created_by: item.created_by,
      updated_by: item.updated_by,
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
    setSelectedItem(originalItem);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item: TableDataItem) => {
    // Convert back to MasterDataItem - spread all properties and override id
    const originalItem: MasterDataItem = {
      ...item,
      id: Number(item.id),
      created_by: item.created_by,
      updated_by: item.updated_by,
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
    setSelectedItem(originalItem);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAdd = async (data: Record<string, any>) => {
    try {
      await addItem(data);
      setIsAddModalOpen(false);
      toast.success("Data added successfully.");
    } catch (error) {
      toast.error(String(error));
      throw error;
    }
  };

  const handleSaveEdit = async (data: Record<string, any>) => {
    if (selectedItem) {
      try {
        await updateItem(selectedItem.id, data);
        setIsEditModalOpen(false);
        setSelectedItem(null);
        toast.success("Data updated successfully.");
      } catch (error) {
        toast.error("Failed to update data. Please try again.");
        throw error;
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedItem) {
      try {
        await deleteItem(selectedItem.id);
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
        toast.success("Record deleted successfully.");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete record. Please try again.");
      }
    }
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  if (sourcesLoading) {
    return (
      <div className="px-6 py-6 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">
          Master Data Management
        </h1>
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-muted-foreground">
            Loading master data sources...
          </div>
        </div>
      </div>
    );
  }

  if (sourcesError) {
    return (
      <div className="px-6 py-6 space-y-6">
        <h1 className="text-2xl font-bold text-foreground">
          Master Data Management
        </h1>
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
          <p className="text-sm text-destructive">
            Failed to load master data sources: {sourcesError.message}
          </p>
        </div>
      </div>
    );
  }

  const tableData = transformDataForTable(data?.data || []);

  return (
    <div className="px-6 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">
        Master Data Management
      </h1>

      <div className="bg-card">
        <div className="flex flex-col items-center justify-center space-y-3">
          <h2 className="text-lg font-semibold">Select Master Data</h2>
          <div className="w-full max-w-md">
            <Select
              value={selectedSource?.slug || ""}
              onValueChange={handleSourceChange}
            >
              <SelectTrigger className="w-full" size="lg">
                <SelectValue placeholder="Select master data type..." />
              </SelectTrigger>
              <SelectContent>
                {(masterDataSources as MasterDataSource[]).map(
                  (source: MasterDataSource) => (
                    <SelectItem key={source.slug} value={source.slug}>
                      {source.title}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          {selectedSource && (
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {selectedSource.description}
            </p>
          )}
        </div>
      </div>

      {/* Data Management Section */}
      {selectedSource && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {selectedSource.title} Management
            </h2>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 size-4" />
              Add New
            </Button>
          </div>

          <div className="bg-card">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : data?.data?.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">
                  No records found.
                </div>
              </div>
            ) : (
              <DataTable
                columns={createDynamicMasterDataColumns(
                  tableData,
                  handleEdit,
                  handleDelete
                )}
                data={tableData}
                paginationState={{
                  mode: "server",
                  currentPage: data?.page ?? 1,
                  totalPages: data?.pages ?? 1,
                  hasNextPage: data?.page < data?.pages,
                  hasPrevPage: data?.page > 1,
                  onPageChange: handlePageChange,
                }}
              />
            )}
          </div>
        </div>
      )}

      {selectedSource && (isAddModalOpen || isEditModalOpen) && (
        <DynamicMasterDataFormModal
          isOpen={isAddModalOpen || isEditModalOpen}
          onClose={handleCloseModals}
          onSave={isAddModalOpen ? handleSaveAdd : handleSaveEdit}
          masterDataSource={selectedSource}
          initialData={selectedItem}
          mode={isAddModalOpen ? "add" : "edit"}
          sampleData={data?.data}
        />
      )}

      {selectedSource && isDeleteModalOpen && selectedItem && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onConfirm={handleConfirmDelete}
          item={{ id: selectedItem.id.toString() } as any}
          itemLabel={selectedSource.title}
        />
      )}
    </div>
  );
}
