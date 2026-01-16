import { useUpdateExperimentStatus } from "@/hooks";
import type { Experiment } from "@/types/experiment";

import { Button, Dialog } from "../atoms";

interface CloseExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  experiment: Experiment;
}

export function CloseExperimentModal({
  isOpen,
  onClose,
  onConfirm,
  experiment,
}: Readonly<CloseExperimentModalProps>) {
  const title = "Close Experiment";
  const message = `Are you sure you want to close ${experiment.experiment_name}? This action cannot be undone.`;

  const { mutate, isPending } = useUpdateExperimentStatus();

  const onHandleCloseExperiment = () => {
    mutate(
      {
        experimentId: experiment.id,
        status: "closed",
      },
      {
        onSuccess: () => {
          onConfirm();
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
      title={title}
      showClose={true}
      className="max-w-lg"
      trigger={null}
      preventOutsideClose={isPending}
    >
      <div className="space-y-6">
        <p className="text-muted-foreground">{message}</p>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="lg"
            onClick={onHandleCloseExperiment}
            disabled={isPending}
          >
            {isPending ? "Closing..." : "Close"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
