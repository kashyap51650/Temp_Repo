import { toast } from "sonner";

import { Dialog } from "@/components/atoms";
import {
  useApproveExperimentData,
  useModal,
  useRejectExperimentData,
} from "@/hooks";
import { DATA_TYPE } from "@/lib/constants";

import { NecropsyAndHotlabPDFView } from "./NecropsyAndHotlabPDFView";
import { RejectExperimentModal } from "./RejectExperimentModal";
import { SheetActions } from "./SheetActions";

interface NecropsyAndHotlabPDFViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
  experimentDataId?: string;
  experimentStatus?: string;
  hideActions?: boolean;
  dataType: "necropsy" | "hotlab";
  title?: string;
  description?: string;
}

export function NecropsyAndHotlabPDFViewModal({
  isOpen,
  onClose,
  experimentName,
  experimentDataId,
  experimentStatus,
  hideActions,
  dataType,
  title,
  description,
}: Readonly<NecropsyAndHotlabPDFViewModalProps>) {
  const rejectModal = useModal();

  const approveMutation = useApproveExperimentData();
  const rejectMutation = useRejectExperimentData();

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

  // Default titles and descriptions based on data type
  const defaultTitle =
    dataType === DATA_TYPE.NECROPSY_SHEET.toLowerCase()
      ? `Necropsy - ${experimentName}`
      : `Hotlab Data - ${experimentName}`;

  const defaultDescription =
    dataType === DATA_TYPE.NECROPSY_SHEET.toLowerCase()
      ? "View necropsy data for the experiment"
      : "View hotlab data for the experiment";

  const displayName =
    dataType === DATA_TYPE.NECROPSY_SHEET.toLowerCase()
      ? "Necropsy"
      : "Hotlab Data";

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
                  {title || defaultTitle}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {description || defaultDescription}
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
        <NecropsyAndHotlabPDFView
          experimentName={experimentName}
          experimentDataId={experimentDataId}
          dataType={dataType}
        />
      </Dialog>
      <RejectExperimentModal
        isOpen={rejectModal.isOpen}
        onClose={rejectModal.closeModal}
        onReject={handleReject}
        item={{
          id: experimentDataId || "",
          name: displayName,
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
