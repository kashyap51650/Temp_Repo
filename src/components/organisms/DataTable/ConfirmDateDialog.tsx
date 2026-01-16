import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { toast } from "@/components/atoms/Sonner/toast";
import { experimentDataApi, handleApiError } from "@/lib/api";

interface ConfirmDateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingDate: Date | null;
  onConfirm: () => void;
  onCancel: () => void;
  experimentDataId?: string;
}

export function ConfirmDateDialog({
  open,
  onOpenChange,
  pendingDate,
  onConfirm,
  onCancel,
  experimentDataId,
}: Readonly<ConfirmDateDialogProps>) {
  const queryClient = useQueryClient();

  const updateTreatmentDateMutation = useMutation({
    mutationFn: async ({
      experimentDataId,
      treatmentDate,
    }: {
      experimentDataId: string;
      treatmentDate: string;
    }) => {
      return experimentDataApi.updateTreatmentDate(
        experimentDataId,
        treatmentDate
      );
    },
    onSuccess: (data) => {
      toast.success("Treatment date updated successfully", {
        description: data.message || "The treatment date has been updated.",
      });

      queryClient.invalidateQueries({ queryKey: ["validationData"] });

      onConfirm();

      onOpenChange(false);
    },
    onError: (error) => {
      const errorMessage = handleApiError(
        error,
        "Failed to update treatment date"
      );
      toast.error("Failed to update treatment date", {
        description: errorMessage,
      });
    },
  });

  const handleConfirm = () => {
    if (!experimentDataId) {
      toast.error("Error", {
        description: "Experiment data ID is missing.",
      });
      return;
    }

    if (!pendingDate) {
      toast.error("Error", {
        description: "No date selected.",
      });
      return;
    }

    const year = pendingDate.getFullYear();
    const month = String(pendingDate.getMonth() + 1).padStart(2, "0");
    const day = String(pendingDate.getDate()).padStart(2, "0");
    const treatmentDate = `${year}-${month}-${day}`;

    updateTreatmentDateMutation.mutate({
      experimentDataId,
      treatmentDate,
    });
  };

  function formatDate(date: Date) {
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Update Treatment Date?"
      description={
        pendingDate
          ? `Are you sure you want to update the treatment date to ${formatDate(pendingDate)}?`
          : "Are you sure you want to update the treatment date?"
      }
      trigger={null}
    >
      <div className="space-y-4 py-2 mt-4">
        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={updateTreatmentDateMutation.isPending}
          >
            No
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={updateTreatmentDateMutation.isPending}
          >
            {updateTreatmentDateMutation.isPending ? "Updating..." : "Yes"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
