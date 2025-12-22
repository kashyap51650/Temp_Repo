import { useEffect, useState } from "react";

import { Button, Dialog } from "../atoms";
import { BioDOrganTable } from "../organisms/DataTable/BioDOrganTable";
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

  const getMouseCodesForGroup = (groupCode: string) =>
    editableData.mouse.filter((m) => m.startsWith(groupCode));

  // Enhanced handleCellChange to support group-wide updates for merged cells
  const handleCellChange = (
    rowId: string,
    mouseId: string,
    value: string,
    groupCode?: string
  ) => {
    setEditableData((prev) => ({
      ...prev,
      rows: prev.rows.map((row) => {
        if (row.id !== rowId) return row;
        if (groupCode) {
          const updatedData = { ...row.data };
          getMouseCodesForGroup(groupCode).forEach((m) => {
            updatedData[m] = value;
          });
          const updatedGroupedData = row.groupedData
            ? { ...row.groupedData }
            : undefined;
          if (updatedGroupedData && updatedGroupedData[groupCode]) {
            updatedGroupedData[groupCode] = {
              ...updatedGroupedData[groupCode],
              value: value,
            };
          }

          return {
            ...row,
            data: updatedData,
            groupedData: updatedGroupedData,
          };
        }

        return { ...row, data: { ...row.data, [mouseId]: value } };
      }),
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
      <div className="flex-1 overflow-auto py-2">
        <BioDOrganTable
          data={editableData}
          editable={true}
          onCellChange={(rowId, mouseId, value, groupCode) =>
            handleCellChange(rowId, mouseId, value, groupCode)
          }
          fixedTopRowsEditable={true}
        />
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
