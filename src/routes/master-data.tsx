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
import { MasterDataFormModal } from "@/components/MasterDataFormModal";
import { DataTable } from "@/components/organisms/DataTable/DataTable";
import { getMasterDataColumns } from "@/components/organisms/DataTable/tableColumns";
import {
  MASTER_DATA_CONFIGS,
  MASTER_DATA_OPTIONS,
  type MasterDataItem,
  type MasterDataType,
} from "@/components/organisms/DataTable/tableData";
import { useMasterData } from "@/hooks/useMasterData";

export const Route = createFileRoute("/master-data")({
  component: MasterDataComponent,
});

function MasterDataComponent() {
  const [selectedType, setSelectedType] = useState<MasterDataType | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MasterDataItem | null>(null);

  const { data, loading, error, addItem, updateItem, deleteItem, refreshData } =
    useMasterData(selectedType);

  const currentConfig = selectedType ? MASTER_DATA_CONFIGS[selectedType] : null;

  const handleTypeChange = (value: string) => {
    setSelectedType(value as MasterDataType);
  };

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const handleEdit = (item: MasterDataItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item: MasterDataItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAdd = async (data: Partial<MasterDataItem>) => {
    try {
      await addItem(data);
      setIsAddModalOpen(false);
      toast.success("Data added successfully.");
      refreshData();
    } catch {
      toast.error("Failed to add data. Please try again.");
    }
  };

  const handleSaveEdit = async (data: Partial<MasterDataItem>) => {
    if (selectedItem) {
      try {
        await updateItem(selectedItem.id, data);
        setIsEditModalOpen(false);
        setSelectedItem(null);
        toast.success("Data updated successfully.");
        refreshData();
      } catch {
        toast.error("Failed to update data. Please try again.");
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedItem) {
      try {
        await deleteItem(selectedItem.id);
        setIsDeleteModalOpen(false);
        setSelectedItem(null);
        toast.success("Record deleted (soft delete) successfully.");
        refreshData();
      } catch {
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

  return (
    <div className="px-6 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">
        Master Data Management
      </h1>

      <div className="bg-card ">
        <div className="flex flex-col items-center justify-center space-y-3">
          <h2 className="text-lg font-semibold">Select Master Data</h2>
          <div className="w-full max-w-md">
            <Select value={selectedType || ""} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full" size="lg">
                <SelectValue placeholder="Select master data type..." />
              </SelectTrigger>
              <SelectContent>
                {MASTER_DATA_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      {selectedType && currentConfig && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {currentConfig.label} Management
            </h2>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 size-4" />
              Add New
            </Button>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="bg-card">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            ) : data.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-sm text-muted-foreground">
                  No records found.
                </div>
              </div>
            ) : (
              <DataTable
                columns={getMasterDataColumns(
                  selectedType!,
                  handleEdit,
                  handleDelete
                )}
                data={data}
              />
            )}
          </div>
        </div>
      )}

      {currentConfig && (isAddModalOpen || isEditModalOpen) && (
        <MasterDataFormModal
          isOpen={isAddModalOpen || isEditModalOpen}
          onClose={handleCloseModals}
          onSave={isAddModalOpen ? handleSaveAdd : handleSaveEdit}
          config={currentConfig}
          initialData={selectedItem}
          mode={isAddModalOpen ? "add" : "edit"}
        />
      )}

      {currentConfig && isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onConfirm={handleConfirmDelete}
          item={selectedItem}
          itemLabel={currentConfig.label}
        />
      )}
    </div>
  );
}
