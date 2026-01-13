import { useMemo } from "react";
import { toast } from "sonner";

import {
  useApproveExperimentData,
  useExperimentDataByIdForOrganSheet,
  useModal,
  useRejectExperimentData,
} from "@/hooks";
import { generateBioDOrganData } from "@/utils/bioDOrganUtils";

import { Dialog } from "../atoms/Dialog/Dialog";
import { BioDOrganTable } from "../organisms/DataTable/BioDOrganTable";
import { BioDOrganEditModal } from "./BioDOrganEditModal";
import { RejectExperimentModal } from "./RejectExperimentModal";
import { SheetActions } from "./SheetActions";

interface BioDOrganViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
  experimentDataId?: string;
  experimentStatus?: string;
  hideActions?: boolean;
}

export function BioDOrganViewModal({
  isOpen,
  onClose,
  experimentName,
  experimentDataId,
  experimentStatus,
  hideActions = false,
}: Readonly<BioDOrganViewModalProps>) {
  const editModal = useModal();
  const rejectModal = useModal();

  const approveMutation = useApproveExperimentData();
  const rejectMutation = useRejectExperimentData();

  const { data, isLoading, isFetching } = useExperimentDataByIdForOrganSheet(
    experimentDataId || ""
  );

  const bioDOrganData = useMemo(() => {
    if (!data) return null;
    return generateBioDOrganData(data.uploaded_data!);
  }, [data]);

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

  const isApiProcessing =
    isLoading ||
    isFetching ||
    approveMutation.isPending ||
    rejectMutation.isPending;

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
                BioD Organ Data - {experimentName}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                View organ data for the experiment
              </p>
            </div>
            {!hideActions && isPending && (
              <SheetActions
                onEdit={handleEdit}
                onApprove={handleApprove}
                onReject={() => rejectModal.openModal()}
                isApproveLoading={isApiProcessing}
                isRejectLoading={isApiProcessing}
              />
            )}
          </div>
        }
        showClose={true}
        className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
        trigger={null}
        preventOutsideClose={isApiProcessing}
      >
        <div className="flex-1 overflow-auto mt-4">
          {(isLoading || isFetching) && (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>
          )}
          {!isLoading && !isFetching && bioDOrganData && (
            <BioDOrganTable data={bioDOrganData} />
          )}

          {!isLoading && !isFetching && !bioDOrganData && (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">
                No data available.
              </p>
            </div>
          )}
        </div>
      </Dialog>

      {bioDOrganData && data?.uploaded_data && (
        <BioDOrganEditModal
          isOpen={editModal.isOpen}
          onClose={editModal.closeModal}
          onSave={editModal.closeModal}
          experimentData={bioDOrganData}
          rawUploadedData={data.uploaded_data}
          experimentId={Number(experimentDataId)}
        />
      )}

      <RejectExperimentModal
        isOpen={rejectModal.isOpen}
        onClose={rejectModal.closeModal}
        onReject={handleReject}
        item={{
          id: experimentDataId || "",
          name: "BioD Organ",
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
