import { useBioDOrganEditModal } from "@/hooks/useBioDOrganEditModal";
import type {
  BioDOrganData,
  ExperimentDataForBioDOrganSheetUploadData,
} from "@/types/organ-sheet";

import { Button, Dialog } from "../atoms";
import { BioDOrganTable } from "../organisms/DataTable/BioDOrganTable";

interface BioDOrganEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: BioDOrganData) => void;
  experimentData: BioDOrganData;
  rawUploadedData: ExperimentDataForBioDOrganSheetUploadData;
  experimentId: number;
  onSaveSuccess?: () => void;
}

export function BioDOrganEditModal({
  isOpen,
  onClose,
  onSave,
  experimentData,
  rawUploadedData,
  experimentId,
  onSaveSuccess,
}: Readonly<BioDOrganEditModalProps>) {
  const {
    editableData,
    changedCells,
    changedGroupDrugs,
    isUpdating,
    handleCellChange,
    handleDrugChange,
    handleSave,
  } = useBioDOrganEditModal({
    experimentData,
    rawUploadedData,
    experimentId,
    isOpen,
    onClose,
    onSaveSuccess: () => {
      onSave?.(editableData);
      onSaveSuccess?.();
    },
  });

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
      preventOutsideClose={isUpdating}
    >
      <div className="flex-1 overflow-auto py-2">
        <BioDOrganTable
          data={editableData}
          editable={true}
          onCellChange={(rowId, mouseId, value, groupCode) =>
            handleCellChange(rowId, mouseId, value, groupCode)
          }
          onDrugChange={handleDrugChange}
          fixedTopRowsEditable={true}
        />
      </div>
      <div className="flex justify-end gap-3 border-t pt-4">
        <Button
          variant="outline"
          size={"lg"}
          onClick={onClose}
          disabled={isUpdating}
        >
          Cancel
        </Button>
        <Button
          size={"lg"}
          onClick={handleSave}
          disabled={
            isUpdating ||
            (changedCells.size === 0 && changedGroupDrugs.size === 0)
          }
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Dialog>
  );
}
