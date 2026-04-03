import type { FC } from "react";

import { Button, Dialog } from "@/components/atoms";
import { RandomizationView } from "@/components/randomization/RandomizationView";
import { useModal } from "@/hooks";

interface ViewRandomizationButtonProps {
  experimentId: number;
  projectId?: number;
}

export const ViewRandomizationButton: FC<ViewRandomizationButtonProps> = ({
  experimentId,
  projectId,
}) => {
  const viewRandomizationModal = useModal();
  return (
    <>
      <Button onClick={() => viewRandomizationModal.openModal()}>
        View Randomization
      </Button>
      <Dialog
        open={viewRandomizationModal.isOpen}
        onOpenChange={viewRandomizationModal.closeModal}
        title="Randomization Details"
        description="View the randomization details for this experiment."
        showClose={true}
        className="max-w-7xl min-h-[40vh]"
        trigger={null}
      >
        <RandomizationView experimentId={experimentId} projectId={projectId} />
      </Dialog>
    </>
  );
};
