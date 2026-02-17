import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { bloodChemistryApi } from "@/api";
import {
  useApproveExperimentData,
  useModal,
  useRejectExperimentData,
} from "@/hooks";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/lib/permissions";

import { Dialog } from "../atoms";
import { RejectExperimentModal } from "../data-validation/RejectExperimentModal";
import { SheetActions } from "../data-validation/SheetActions";
import ViewBloodChemistryData from "../molecules/ViewBloodChemistryData";

interface ViewBloodChemistryDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experimentId: number;
  experimentDataId: string;
  experimentStatus?: string;
  hideActions?: boolean;
}

/**
 * ViewBloodChemistryDataModal Component
 *
 * Handles viewing blood chemistry data fetched from API.
 * Manages loading and error states. View-only mode.
 */
export default function ViewBloodChemistryDataModal({
  open,
  onOpenChange,
  experimentId,
  experimentDataId,
  hideActions = false,
  experimentStatus,
}: Readonly<ViewBloodChemistryDataModalProps>) {
  const rejectModal = useModal();

  const approveMutation = useApproveExperimentData();
  const rejectMutation = useRejectExperimentData();

  const { hasPermission } = usePermissions();

  const canApproveReject = hasPermission(
    PERMISSIONS.DATA_VALIDATE.APPROVE_REJECT_DATA
  );

  const {
    data: fetchedData,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["blood-chemistry-report", experimentDataId],
    enabled: !!open && !!experimentDataId,
    queryFn: async () =>
      bloodChemistryApi.getBloodChemistryReportData(Number(experimentDataId)),
    retry: false,
  });

  const resolvedData = fetchedData?.data;

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleApprove = () => {
    if (!experimentDataId) return;
    approveMutation.mutate(experimentDataId, {
      onSuccess: (data) => {
        toast.success("Experiment data approved successfully", {
          description: `Status updated to ${data.status}`,
        });
        handleClose();
      },
      onError: (error) => {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to approve experiment data";
        toast.error("Failed to approve experiment data", {
          description: message,
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
          handleClose();
        },
        onError: (error) => {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to reject experiment data";
          toast.error("Failed to reject experiment data", {
            description: message,
          });
        },
      }
    );
  };

  const renderDialogContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Loading blood chemistry report data...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500 mb-4">
            {error instanceof Error
              ? error.message
              : "An error occurred while fetching the blood chemistry report."}
          </p>
        </div>
      );
    }

    // No data state
    if (!resolvedData || resolvedData.total_reports === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg font-semibold text-foreground mb-2">
            No Blood Chemistry Data Found
          </p>
          <p className="text-sm text-muted-foreground">
            There is no blood chemistry report data available for this
            experiment.
          </p>
        </div>
      );
    }

    return (
      <ViewBloodChemistryData
        experimentId={experimentId}
        data={resolvedData.blood_chemistry_reports}
        mode="view"
      />
    );
  };

  const isPending = experimentStatus === "pending";

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={handleClose}
        title={
          <div className="flex items-center justify-between w-full pr-8">
            <div>
              <h2 className="text-xl font-semibold">
                View Blood Chemistry Data
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Review blood chemistry report data.
              </p>
            </div>
            {!hideActions && isPending && (
              <SheetActions
                showEdit={false}
                showApproveReject={canApproveReject}
                onApprove={handleApprove}
                onReject={() => rejectModal.openModal()}
                isApproveLoading={approveMutation.isPending}
                isRejectLoading={rejectMutation.isPending}
                isDataFetching={isLoading || isError}
              />
            )}
          </div>
        }
        trigger={null}
        className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
      >
        {renderDialogContent()}
      </Dialog>
      <RejectExperimentModal
        isOpen={rejectModal.isOpen}
        onClose={rejectModal.closeModal}
        onReject={handleReject}
        item={{
          id: experimentDataId || "",
          name: "Blood Chemistry Data",
          status: "Pending",
          canView: true,
          canEdit: false,
          canApprove: true,
          canReject: true,
        }}
      />
    </>
  );
}
