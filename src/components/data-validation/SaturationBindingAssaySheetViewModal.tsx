import { toast } from "sonner";

import {
  useApproveExperimentData,
  useExperimentDataByIdForSaturationBinding,
  useModal,
  useRejectExperimentData,
} from "@/hooks";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";

import { Dialog } from "../atoms";
import { RejectExperimentModal } from "./RejectExperimentModal";
import { SaturationBindingAssaySheetView } from "./SaturationBindingAssaySheetView";
import { SheetActions } from "./SheetActions";

interface SaturationBindingAssaySheetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
  experimentDataId?: string;
  experimentStatus?: string;
  hideActions?: boolean;
  experimentDataType: string;
}

export function SaturationBindingAssaySheetViewModal({
  isOpen,
  onClose,
  experimentName,
  experimentDataId,
  experimentStatus,
  hideActions,
  experimentDataType,
}: Readonly<SaturationBindingAssaySheetViewModalProps>) {
  const { hasPermission } = usePermissions();
  const rejectModal = useModal();

  const approveMutation = useApproveExperimentData();
  const rejectMutation = useRejectExperimentData();
  const canApproveReject = hasPermission(
    PERMISSIONS.DATA_VALIDATE.APPROVE_REJECT_DATA
  );

  const {
    data: apiData,
    isLoading,
    error,
  } = useExperimentDataByIdForSaturationBinding(experimentDataId || "");

  const handleApprove = () => {
    if (!experimentDataId) return;
    approveMutation.mutate(experimentDataId, {
      onSuccess: (data) => {
        toast.success("Experiment data approved successfully", {
          description: `Status updated to ${data.status}`,
        });
        onClose();
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
                  {experimentDataType} - {experimentName}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  View {experimentDataType} data for the experiment
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
        <SaturationBindingAssaySheetView
          experimentDataId={experimentDataId}
          apiData={apiData}
          isLoading={isLoading}
          error={error}
        />
      </Dialog>
      <RejectExperimentModal
        isOpen={rejectModal.isOpen}
        onClose={rejectModal.closeModal}
        onReject={handleReject}
        item={{
          id: experimentDataId || "",
          name: experimentDataType,
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
