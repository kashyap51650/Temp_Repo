import { toast } from "sonner";

import { Dialog } from "@/components/atoms/Dialog/Dialog";
import type { BioDWeightData } from "@/components/organisms/DataTable/tableData";
import {
  useApproveExperimentData,
  useModal,
  useRejectExperimentData,
} from "@/hooks";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";

import { BioDWeightSheetModal } from "./BioDWeightSheetModal";
import { BioDWeightSheetView } from "./BioDWeightSheetView";
import { RejectExperimentModal } from "./RejectExperimentModal";
import { SheetActions } from "./SheetActions";

interface BioDWeightSheetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
  experimentDataId?: string;
  data?: BioDWeightData;
  experimentStatus?: string;
  hideActions?: boolean;
}

export function BioDWeightSheetViewModal({
  isOpen,
  onClose,
  experimentName,
  experimentDataId,
  data,
  experimentStatus,
  hideActions = false,
}: Readonly<BioDWeightSheetViewModalProps>) {
  const { hasPermission } = usePermissions();
  const editModal = useModal();
  const rejectModal = useModal();

  const approveMutation = useApproveExperimentData();
  const rejectMutation = useRejectExperimentData();

  const canEdit = hasPermission(PERMISSIONS.DATA_VALIDATE.EDIT_DATA);
  const canApproveReject = hasPermission(
    PERMISSIONS.DATA_VALIDATE.APPROVE_REJECT_DATA
  );

  const handleEdit = () => {
    editModal.openModal();
  };

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
            <div>
              <h2 className="text-xl font-semibold">
                BioD Weight Sheet - {experimentName}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                View weight sheet data for the experiment
              </p>
            </div>
            {!hideActions && isPending && (
              <SheetActions
                showEdit={canEdit}
                showApproveReject={canApproveReject}
                onEdit={handleEdit}
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
        <BioDWeightSheetView data={data} experimentDataId={experimentDataId} />
      </Dialog>

      {editModal.isOpen && (
        <BioDWeightSheetModal
          isOpen={editModal.isOpen}
          onClose={editModal.closeModal}
          onSave={editModal.closeModal}
          experimentName={experimentName}
          experimentDataId={experimentDataId}
        />
      )}

      <RejectExperimentModal
        isOpen={rejectModal.isOpen}
        onClose={rejectModal.closeModal}
        onReject={handleReject}
        item={{
          id: experimentDataId || "",
          name: "BioD Weight Sheet",
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
