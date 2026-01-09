import { useUpdateProjectStatus } from "@/hooks";
import type { ProjectItem } from "@/types/project";

import { Button, Dialog } from "../atoms";

interface CloseConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  project: ProjectItem;
}

export function CloseConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  project,
}: CloseConfirmationModalProps) {
  const message = `Are you sure you want to close ${project.project_name}? This action cannot be undone.`;

  const { mutate, isPending } = useUpdateProjectStatus();

  const onHandleCloseProject = () => {
    mutate(
      {
        projectId: project?.id,
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
      title="Close Project"
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
            onClick={onHandleCloseProject}
            disabled={isPending}
          >
            {isPending ? "Closing..." : "Close"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
