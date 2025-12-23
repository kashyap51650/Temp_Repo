import { type CellContext, type ColumnDef } from "@tanstack/react-table";
import { Check, Edit, X as XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/Button/Button";
import { useApproveExperimentData, useRejectExperimentData } from "@/hooks";

import { Dialog } from "../atoms/Dialog/Dialog";
import { DataTable } from "../organisms";
import { bioDOrganData } from "../organisms/DataTable/tableData";
import { BioDOrganEditModal } from "./BioDOrganEditModal";
import { RejectExperimentModal } from "./RejectExperimentModal";

interface BioDOrganViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentName: string;
  experimentDataId?: string;
  experimentStatus?: string;
}
type BioDOrganTableRow = {
  id: string;
  label: string;
  data: Record<string, string | number>;
};

export function BioDOrganViewModal({
  isOpen,
  onClose,
  experimentName,
  experimentDataId,
  experimentStatus,
}: Readonly<BioDOrganViewModalProps>) {
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

  const handleSaveEdit = () => {
    setShowEditModal(false);
  };

  const isPending = experimentStatus === "pending";

  const columns: ColumnDef<BioDOrganTableRow>[] = [
    {
      accessorKey: "label",
      header: "Parameter",
      cell: (ctx: CellContext<BioDOrganTableRow, unknown>) => (
        <span className="font-medium text-sm">{ctx.row.original.label}</span>
      ),
    },
    ...bioDOrganData.mouse.map((mouseId) => ({
      id: mouseId,
      header: mouseId,
      accessorFn: (row: BioDOrganTableRow) => row.data[mouseId],
      cell: (ctx: CellContext<BioDOrganTableRow, unknown>) => (
        <span className="text-sm">
          {(ctx.getValue() as string | number) || ""}
        </span>
      ),
    })),
  ];

  const tableRows = bioDOrganData.rows.map((row) => ({
    id: row.id,
    label: row.label,
    data: row.data,
    ...row.data,
  }));

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
        showClose={true}
        className="w-full max-w-[var(--width-xxl)] h-[var(--height-modal)] flex flex-col"
        trigger={null}
      >
        <div className="flex-1 overflow-auto mt-4">
          <DataTable columns={columns} data={tableRows} />
        </div>
      </Dialog>

      {showEditModal && (
        <BioDOrganEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
          experimentName={experimentName}
        />
      )}

      <RejectExperimentModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
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
