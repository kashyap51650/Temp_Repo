import { type ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { Button, Dialog, Input } from "../atoms";
import { DataTable } from "../organisms/DataTable/DataTable";
import type { BioDOrganData } from "../organisms/DataTable/tableData";
import { bioDOrganData } from "../organisms/DataTable/tableData";

interface BioDOrganEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BioDOrganData) => void;
  experimentName: string;
}

export function BioDOrganEditModal({
  isOpen,
  onClose,
  onSave,
  experimentName,
}: BioDOrganEditModalProps) {
  const [editableData, setEditableData] =
    useState<BioDOrganData>(bioDOrganData);

  useEffect(() => {
    if (isOpen) {
      setEditableData(bioDOrganData);
    }
  }, [isOpen, experimentName]);

  const handleCellChange = (rowId: string, mouseId: string, value: string) => {
    setEditableData((prev) => ({
      ...prev,
      rows: prev.rows.map((row) =>
        row.id === rowId
          ? { ...row, data: { ...row.data, [mouseId]: value } }
          : row
      ),
    }));
  };

  const handleSave = () => {
    onSave(editableData);
    onClose();
  };

  // Build columns for DataTable
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "label",
      header: "Parameter",
      cell: ({ row }: { row: any }) => (
        <span className="font-medium text-sm">{row.original.label}</span>
      ),
    },
    ...editableData.mouse.map((mouseId) => ({
      accessorKey: mouseId,
      header: mouseId,
      cell: ({ row }: { row: any }) => (
        <Input
          className="w-full"
          value={row.original.data[mouseId] || ""}
          onChange={(e) =>
            handleCellChange(row.original.id, mouseId, e.target.value)
          }
        />
      ),
    })),
  ];

  // Transform rows for DataTable
  const tableRows = editableData.rows.map((row) => ({
    id: row.id,
    label: row.label,
    data: row.data,
    ...row.data,
  }));

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
      title="Edit BioDosimetry Organ Data"
      showClose={true}
      className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
      trigger={null}
    >
      <div className="flex-1 overflow-auto py-2">
        <div className="min-w-4xl mt-2">
          <DataTable columns={columns} data={tableRows} hideSelectionCount />
        </div>
      </div>
      <div className="flex justify-end gap-3 border-t pt-4">
        <Button variant="outline" size={"lg"} onClick={onClose}>
          Cancel
        </Button>
        <Button size={"lg"} onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </Dialog>
  );
}
