import { toast } from "sonner";

import {
  useApproveExperimentData,
  useExperimentDataByIdForCMC,
  useModal,
  useRejectExperimentData,
} from "@/hooks";

import { Dialog } from "../atoms";
import { FileViewer } from "./FileViewer";
import { RejectExperimentModal } from "./RejectExperimentModal";
import { SheetActions } from "./SheetActions";

interface CMCDataViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
  experimentDataId?: string;
  experimentStatus?: string;
  hideActions?: boolean;
  experimentDataType: string;
}

export default function CMCDataViewModal({
  isOpen,
  onClose,
  experimentName,
  experimentDataId,
  experimentStatus,
  hideActions,
  experimentDataType,
}: Readonly<CMCDataViewModalProps>) {
  const rejectModal = useModal();

  const approveMutation = useApproveExperimentData();
  const rejectMutation = useRejectExperimentData();

  const { data, isLoading } = useExperimentDataByIdForCMC(
    experimentDataId || ""
  );

  const cmcFile = data?.data?.cmc_file;

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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-lg text-muted-foreground">
            Loading {experimentDataType} data...
          </div>
        </div>
      );
    }

    if (cmcFile) {
      return (
        <FileViewer
          fileUrl={cmcFile.file_url}
          filename={cmcFile.filename}
          fileType={cmcFile.file_type}
          title={`${experimentDataType} - ${experimentName}`}
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">No CMC data available</p>
          <p className="text-sm mt-2">
            No file has been uploaded for this experiment
          </p>
        </div>
      </div>
    );
  };

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
        {/* File Viewer Content */}
        <div className="flex-1 overflow-hidden">{renderContent()}</div>
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
