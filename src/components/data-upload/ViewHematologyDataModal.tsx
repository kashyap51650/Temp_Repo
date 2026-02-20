import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { hematologyApi } from "@/api";
import {
  useApproveExperimentData,
  useModal,
  useRejectExperimentData,
} from "@/hooks";

import { Dialog } from "../atoms";
import { RejectExperimentModal } from "../data-validation/RejectExperimentModal";
import { SheetActions } from "../data-validation/SheetActions";
import { ViewHematologyData } from "../molecules/ViewHematologyData";

interface ViewHematologyDataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experimentId: number;
  experimentDataId: string;
  experimentStatus?: string;
  hideActions?: boolean;
}

/**
 * ViewHematologyDataModal Component
 *
 * Handles viewing hematology data fetched from API.
 * Manages loading and error states. View-only mode.
 */
export const ViewHematologyDataModal: React.FC<
  ViewHematologyDataModalProps
> = ({
  open,
  onOpenChange,
  experimentId,
  experimentDataId,
  hideActions = false,
  experimentStatus,
}) => {
  const rejectModal = useModal();

  const approveMutation = useApproveExperimentData();
  const rejectMutation = useRejectExperimentData();

  // Fetch hematology data from API
  const {
    data: fetchedData,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["hematology-report", experimentDataId],
    enabled: !!open && !!experimentDataId,
    queryFn: async () =>
      hematologyApi.getHematologyReportData(Number(experimentDataId)),
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
          description: `Status updated to ${data.data?.status}`,
        });
        handleClose();
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
          handleClose();
        },
      }
    );
  };

  // Render dialog content based on data status
  const renderDialogContent = () => {
    // Loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">
            Loading hematology report data...
          </p>
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500 mb-4">
            {error instanceof Error
              ? error.message
              : "An error occurred while fetching the hematology report."}
          </p>
        </div>
      );
    }

    // No data state
    if (!resolvedData || resolvedData.total_reports === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg font-semibold text-foreground mb-2">
            No Hematology Data Found
          </p>
          <p className="text-sm text-muted-foreground">
            There is no hematology report data available for this experiment.
          </p>
        </div>
      );
    }

    // Main content with data
    return (
      <ViewHematologyData
        experimentId={experimentId}
        data={resolvedData.hematology_reports}
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
              <h2 className="text-xl font-semibold">View Hematology Data</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Review hematology report data.
              </p>
            </div>
            {!hideActions && isPending && (
              <SheetActions
                showEdit={false}
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
          name: "Hematology Data",
          status: "Pending",
          canView: true,
          canEdit: false,
          canApprove: true,
          canReject: true,
        }}
      />
    </>
  );
};
