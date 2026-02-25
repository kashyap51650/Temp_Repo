import { toast } from "sonner";

import {
  useApproveExperimentData,
  useExperimentDataByIdForDelfia,
  useExperimentDataByIdForSaturationBinding,
  useModal,
  useRejectExperimentData,
} from "@/hooks";
import { DATA_TYPE } from "@/lib";

import { Dialog } from "../atoms";
import { DelfiaAndSBASheetView } from "./DelfiaAndSBASheetView";
import { RejectExperimentModal } from "./RejectExperimentModal";
import { SheetActions } from "./SheetActions";

interface DelfiaAndSBASheetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
  experimentDataId?: string;
  experimentStatus?: string;
  hideActions?: boolean;
  experimentDataType: string;
}

export function DelfiaAndSBASheetViewModal({
  isOpen,
  onClose,
  experimentName,
  experimentDataId,
  experimentStatus,
  hideActions,
  experimentDataType,
}: Readonly<DelfiaAndSBASheetViewModalProps>) {
  const rejectModal = useModal();

  const approveMutation = useApproveExperimentData();
  const rejectMutation = useRejectExperimentData();

  const {
    data: sbaData,
    isLoading: isSBADataLoading,
    error: sbaError,
  } = useExperimentDataByIdForSaturationBinding({
    experimentDataId: experimentDataId || "",
    enabled: experimentDataType === DATA_TYPE.SATURATION_BINDING_ASSAY,
  });
  const {
    data: delfiaData,
    isLoading: isDelfiaDataLoading,
    error: delfiaError,
  } = useExperimentDataByIdForDelfia({
    experimentDataId: experimentDataId || "",
    enabled: experimentDataType === DATA_TYPE.DELFIA,
  });
  const apiData = sbaData || delfiaData;
  const isLoading = isSBADataLoading || isDelfiaDataLoading;
  const error = sbaError || delfiaError;

  const handleApprove = () => {
    if (!experimentDataId) return;
    approveMutation.mutate(experimentDataId, {
      onSuccess: (data) => {
        toast.success("Experiment data approved successfully", {
          description: `Status updated to ${data.data?.status}`,
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
            description: `Status updated to ${data.data?.status}`,
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
        <DelfiaAndSBASheetView
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
        isRejectLoading={rejectMutation.isPending}
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
