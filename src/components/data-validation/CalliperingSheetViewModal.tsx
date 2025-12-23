import { Check, Edit, X as XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import type { CalliperingData } from "@/components/organisms/DataTable/tableData";
import { useApproveExperimentData, useRejectExperimentData } from "@/hooks";

import { CalliperingSheetModal } from "./CalliperingSheetEditModal";
import { CalliperingSheetView } from "./CalliperingSheetView";
import { RejectExperimentModal } from "./RejectExperimentModal";

interface CalliperingSheetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
  data?: CalliperingData;
  experimentDataId?: string;
  experimentStatus?: string;
}

export function CalliperingSheetViewModal({
  isOpen,
  onClose,
  experimentName,
  data,
  experimentDataId,
  experimentStatus,
}: Readonly<CalliperingSheetViewModalProps>) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const approveMutation = useApproveExperimentData();
  const rejectMutation = useRejectExperimentData();

  const handleEdit = () => {
    setShowEditModal(true);
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
          setShowRejectModal(false);
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
    setShowEditModal(false);
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
                Callipering Sheet - {experimentName}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                View callipering data for the experiment
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit className="size-4" />
                Edit
              </Button>

              {isPending && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleApprove}
                    className="flex items-center gap-2 text-green-700 hover:bg-green-50 hover:text-green-800"
                    disabled={approveMutation.isPending}
                  >
                    <Check className="size-4" />
                    Approve
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRejectModal(true)}
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                    disabled={rejectMutation.isPending}
                  >
                    <XIcon className="size-4" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        }
        trigger={null}
        className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
      >
        <CalliperingSheetView data={data} experimentDataId={experimentDataId} />
      </Dialog>

      {showEditModal && (
        <CalliperingSheetModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
          experimentName={experimentName}
          experimentDataId={experimentDataId}
        />
      )}

      <RejectExperimentModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
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
    </>
  );
}
