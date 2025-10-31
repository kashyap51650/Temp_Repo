import { useEffect, useState } from "react";

import { Button, Dialog, Input } from "../atoms";
import type { BioDOrganData } from "../organisms/DataTable/tableData";
import { bioDOrganData } from "../organisms/DataTable/tableData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../organisms/Table/Table";

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
      <div className="flex-1 overflow-auto py-6">
        <div className="min-w-4xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky top-0 left-0 z-10 px-2">
                  Parameter
                </TableHead>
                {editableData.mouse.map((mouseId) => (
                  <TableHead key={mouseId} className="text-left min-w-28">
                    {mouseId}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {editableData.rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="sticky left-0 z-10 px-2 text-sm font-medium">
                    {row.label}
                  </TableCell>
                  {editableData.mouse.map((mouseId) => (
                    <TableCell key={mouseId} className="px-2 py-2">
                      <Input
                        className="w-full"
                        value={row.data[mouseId] || ""}
                        onChange={(e) =>
                          handleCellChange(row.id, mouseId, e.target.value)
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
