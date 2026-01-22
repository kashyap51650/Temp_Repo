import { ChartBar } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import {
  useApproveExperimentData,
  useExperimentDataByIdForCalliperingSheet,
  useModal,
  useRejectExperimentData,
} from "@/hooks";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";

import CaliperHistoryGroupModal from "./CaliperHistoryGroupedModal";
import CaliperHistoryModal from "./CaliperHistoryModal";
import { CalliperingSheetModal } from "./CalliperingSheetEditModal";
import { CalliperingSheetView } from "./CalliperingSheetView";
import GraphViewModal from "./GraphViewModal";
import { RejectExperimentModal } from "./RejectExperimentModal";
import { SheetActions } from "./SheetActions";

interface CalliperingSheetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
  experimentDataId?: string;
  experimentStatus?: string;
  hideActions?: boolean;
  experimentDataType?: string;
  experimentStudyType?: string;
}

export function CalliperingSheetViewModal({
  isOpen,
  onClose,
  experimentName,
  experimentDataId,
  experimentStatus,
  hideActions = false,
  experimentDataType,
  experimentStudyType,
}: Readonly<CalliperingSheetViewModalProps>) {
  const { hasPermission } = usePermissions();
  const editModal = useModal();
  const rejectModal = useModal();

  const approveMutation = useApproveExperimentData();
  const rejectMutation = useRejectExperimentData();
  const viewGraphModal = useModal();
  const caliperHistoryModal = useModal();
  const caliperHistoryGroupModal = useModal();

  const {
    data: apiData,
    isLoading,
    error,
  } = useExperimentDataByIdForCalliperingSheet(experimentDataId || "");
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

  const handleSaveEdit = () => {
    editModal.closeModal();
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
                  Callipering Sheet - {experimentName}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  View callipering data for the experiment
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={viewGraphModal.openModal}
                disabled={isLoading}
              >
                <ChartBar className="size-4" />
                View Graph
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={caliperHistoryModal.openModal}
                disabled={isLoading}
              >
                Caliper History
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={caliperHistoryGroupModal.openModal}
                disabled={isLoading}
              >
                <ChartBar className="size-4" />
                Caliper History Group
              </Button>
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
                isDataFetching={isLoading}
              />
            )}
          </div>
        }
        trigger={null}
        className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
      >
        <CalliperingSheetView
          experimentDataId={experimentDataId}
          experimentDataType={experimentDataType}
          experimentStudyType={experimentStudyType}
          apiData={apiData}
          isLoading={isLoading}
          error={error}
        />
      </Dialog>

      {editModal.isOpen && (
        <CalliperingSheetModal
          isOpen={editModal.isOpen}
          onClose={editModal.closeModal}
          onSave={handleSaveEdit}
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
          name: "Callipering Sheet",
          status: "Pending",
          canView: true,
          canEdit: true,
          canApprove: true,
          canReject: true,
        }}
      />

      <GraphViewModal
        isOpen={viewGraphModal.isOpen}
        onClose={viewGraphModal.closeModal}
      />
      <CaliperHistoryModal
        isOpen={caliperHistoryModal.isOpen}
        onClose={caliperHistoryModal.closeModal}
      />
      <CaliperHistoryGroupModal
        isOpen={caliperHistoryGroupModal.isOpen}
        onClose={caliperHistoryGroupModal.closeModal}
      />
    </>
  );
}
