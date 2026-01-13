import { ChartBar } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import type { CalliperingData } from "@/components/organisms/DataTable/tableData";
import {
  useApproveExperimentData,
  useModal,
  useRejectExperimentData,
} from "@/hooks";

import { CalliperingSheetModal } from "./CalliperingSheetEditModal";
import { CalliperingSheetView } from "./CalliperingSheetView";
import GraphViewModal from "./GraphViewModal";
import { RejectExperimentModal } from "./RejectExperimentModal";
import { SheetActions } from "./SheetActions";

interface CalliperingSheetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
  data?: CalliperingData;
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
  data,
  experimentDataId,
  experimentStatus,
  hideActions = false,
  experimentDataType,
  experimentStudyType,
}: Readonly<CalliperingSheetViewModalProps>) {
  const editModal = useModal();
  const rejectModal = useModal();

  const approveMutation = useApproveExperimentData();
  const rejectMutation = useRejectExperimentData();
  const viewGraphModal = useModal();

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

  const handleSaveEdit = (editedData: CalliperingData) => {
    console.log("Saved data:", editedData);
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
              >
                <ChartBar className="size-4" />
                View Graph
              </Button>
            </div>
            {!hideActions && isPending && (
              <SheetActions
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
        <CalliperingSheetView
          data={data}
          experimentDataId={experimentDataId}
          experimentDataType={experimentDataType}
          experimentStudyType={experimentStudyType}
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
    </>
  );
}
