import { toast } from "sonner";

import { Dialog } from "@/components/atoms/Dialog/Dialog";
import type { BioDWeightData } from "@/components/organisms/DataTable/tableData";
import {
  useApproveExperimentData,
  useExperimentDataByIdForWeightSheet,
  useModal,
  useRejectExperimentData,
} from "@/hooks";
import type { StudyType } from "@/lib/constants";
import { getSheetDataTypePrefix } from "@/lib/utils";

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
  experimentStudyType: string;
}

export function BioDWeightSheetViewModal({
  isOpen,
  onClose,
  experimentName,
  experimentDataId,
  experimentStatus,
  hideActions = false,
  experimentStudyType,
}: Readonly<BioDWeightSheetViewModalProps>) {
  const editModal = useModal();
  const rejectModal = useModal();

  const approveMutation = useApproveExperimentData();
  const rejectMutation = useRejectExperimentData();

  const {
    data: apiData,
    isLoading,
    error,
  } = useExperimentDataByIdForWeightSheet(experimentDataId || "");

  const handleEdit = () => {
    editModal.openModal();
  };

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
            <div>
              <h2 className="text-xl font-semibold">
                {getSheetDataTypePrefix(experimentStudyType as StudyType)}{" "}
                Weight Sheet - {experimentName}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                View weight sheet data for the experiment
              </p>
            </div>
            {!hideActions && isPending && (
              <SheetActions
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
        <BioDWeightSheetView
          experimentDataId={experimentDataId}
          apiData={apiData}
          isLoading={isLoading}
          error={error}
          experimentStudyType={experimentStudyType}
        />
      </Dialog>

      {editModal.isOpen && (
        <BioDWeightSheetModal
          isOpen={editModal.isOpen}
          onClose={editModal.closeModal}
          onSave={editModal.closeModal}
          experimentName={experimentName}
          experimentDataId={experimentDataId}
          experimentStudyType={experimentStudyType}
        />
      )}

      <RejectExperimentModal
        isOpen={rejectModal.isOpen}
        onClose={rejectModal.closeModal}
        onReject={handleReject}
        isRejectLoading={rejectMutation.isPending}
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
