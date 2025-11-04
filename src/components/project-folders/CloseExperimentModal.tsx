import { Button, Dialog } from "@/components/atoms";

interface CloseExperimentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  experimentName: string;
}

export function CloseExperimentModal({
  isOpen,
  onClose,
  onConfirm,
  experimentName,
}: CloseExperimentModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      trigger={<span />}
      title="Close Experiment"
      description={`Are you sure you want to close ${experimentName}? This action cannot be undone.`}
      showClose={true}
    >
      <div className="py-2 flex gap-2 justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Close Experiment
        </Button>
      </div>
    </Dialog>
  );
}
