import { useState } from "react";
import { toast } from "sonner";

import { Dialog } from "@/components/atoms/Dialog/Dialog";
import type { BioDWeightData } from "@/components/organisms/DataTable/tableData";
import { useBulkUpdateBodyWeights } from "@/hooks";
import type { BodyWeightMeasurementUpdate } from "@/hooks/useBulkUpdateBodyWeights";

import { Button } from "../atoms";
import { BioDWeightSheet } from "./BioDWeightSheet";

interface BioDWeightSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BioDWeightData) => void;
  experimentName: string;
  experimentDataId?: string;
  data?: BioDWeightData;
}

export function BioDWeightSheetModal({
  isOpen,
  onClose,
  onSave,
  experimentName,
  experimentDataId,
  data,
}: Readonly<BioDWeightSheetModalProps>) {
  const [currentData, setCurrentData] = useState<BioDWeightData | null>(null);
  const [originalData, setOriginalData] = useState<BioDWeightData | null>(null);
  const bulkUpdateMutation = useBulkUpdateBodyWeights();

  const handleDataChange = (weightData: BioDWeightData) => {
    setCurrentData(weightData);

    if (!originalData && weightData.mice.length > 0) {
      setOriginalData(structuredClone(weightData));
    }
  };

  const handleSave = async () => {
    if (!currentData || !originalData) {
      toast.error("Invalid data", {
        description: "Unable to save changes due to missing data",
      });
      return;
    }

    if (!currentData.mice.some((mouse) => mouse.measurementId)) {
      toast.error("Invalid measurement data", {
        description: "No valid measurements found to update",
      });
      return;
    }

    const changedMeasurements: BodyWeightMeasurementUpdate[] = [];

    currentData.mice.forEach((currentMouse, index) => {
      const originalMouse = originalData.mice[index];
      if (originalMouse && currentMouse.measurementId) {
        const weightChanged =
          currentMouse.bodyWeight !== originalMouse.bodyWeight;

        if (weightChanged) {
          if (currentMouse.bodyWeight <= 0 || currentMouse.bodyWeight > 1000) {
            toast.error("Invalid weight value", {
              description: `Weight for mouse ${currentMouse.id} must be between 0 and 1000 grams`,
            });
            return;
          }

          changedMeasurements.push({
            id: currentMouse.measurementId,
            body_weight_grams: currentMouse.bodyWeight,
          });
        }
      }
    });

    if (changedMeasurements.length === 0) {
      toast.info("No changes detected", {
        description: "No weight measurements were modified",
      });
      onClose();
      return;
    }

    bulkUpdateMutation.mutate(
      { measurements: changedMeasurements },
      {
        onSuccess: () => {
          onSave(currentData);
          onClose();
        },
      }
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
      title={`BioD Weight Sheet - ${experimentName}`}
      description="Edit weight sheet data for the experiment"
      trigger={null}
      className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
    >
      <BioDWeightSheet
        data={data}
        onSave={handleDataChange}
        experimentDataId={experimentDataId}
      />
      <div className="mt-auto flex justify-end gap-3">
        <Button variant="outline" size={"lg"} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={"default"}
          size={"lg"}
          onClick={handleSave}
          disabled={bulkUpdateMutation.isPending}
        >
          {bulkUpdateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Dialog>
  );
}
