import { toast } from "sonner";

import {
  useApproveExperimentData,
  useModal,
  useRejectExperimentData,
} from "@/hooks";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";

import { Dialog } from "../atoms";
import NecropsyView from "./NecropsyView";
import { RejectExperimentModal } from "./RejectExperimentModal";
import { SheetActions } from "./SheetActions";

interface NecropsyViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
  experimentDataId?: string;
  experimentStatus?: string;
  hideActions?: boolean;
}

export default function NecropsyViewModal({
  isOpen,
  onClose,
  experimentName,
  experimentDataId,
  experimentStatus,
  hideActions,
}: Readonly<NecropsyViewModalProps>) {
  const { hasPermission } = usePermissions();
  const rejectModal = useModal();

  const approveMutation = useApproveExperimentData();
  const rejectMutation = useRejectExperimentData();
  const canApproveReject = hasPermission(
    PERMISSIONS.DATA_VALIDATE.APPROVE_REJECT_DATA
  );

  const handleApprove = () => {
    if (!experimentDataId) return;
    approveMutation.mutate(experimentDataId, {
      onSuccess: (data) => {
        toast.success("Experiment data approved successfully", {
          description: `Status updated to ${data.status}`,
        });
        onClose();
      },
      onError: (error) => {
        toast.error("Failed to approve experiment data", {
          description: error.message,
        });
      },
    });
  };

  const handleReject = (rejectionReason: string) => {
    if (!experimentDataId) return;
    rejectMutation.mutate(
      {
        experimentDataId,
        rejectionReason,
      },
      {
        onSuccess: (data) => {
          toast.success("Experiment data rejected successfully", {
            description: `Status updated to ${data.status}`,
          });
          rejectModal.closeModal();
          onClose();
        },
        onError: (error) => {
          toast.error("Failed to reject experiment data", {
            description: error.message,
          });
        },
      }
    );
  };

  const isPending = experimentStatus === "pending";

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open: boolean) => {
          if (!open) onClose();
        }}
        title={
          <div className="flex items-center justify-between w-full pr-8">
            <div className="flex gap-4 mb-2 items-center">
              <div>
                <h2 className="text-xl font-semibold">
                  Necropsy - {experimentName}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  View necropsy data for the experiment
                </p>
              </div>
            </div>
            {!hideActions && isPending && (
              <SheetActions
                showEdit={false}
                showApproveReject={canApproveReject}
                onApprove={handleApprove}
                onReject={() => rejectModal.openModal()}
                isApproveLoading={approveMutation.isPending}
                isRejectLoading={rejectMutation.isPending}
              />
            )}
          </div>
        }
        trigger={null}
        className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
      >
        <NecropsyView
          experimentName={experimentName}
          experimentDataId={experimentDataId}
        />
      </Dialog>
      <RejectExperimentModal
        isOpen={rejectModal.isOpen}
        onClose={rejectModal.closeModal}
        onReject={handleReject}
        item={{
          id: experimentDataId || "",
          name: "Necropsy",
          status: "Pending",
          canView: true,
          canEdit: true,
          canApprove: true,
          canReject: true,
        }}
      />
    </>
  );
}
