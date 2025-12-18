import { Check, Edit, Eye, X as XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useApproveExperimentData, useRejectExperimentData } from "../../hooks";
import { Button } from "../atoms/Button/Button";
import { Dialog } from "../atoms/Dialog/Dialog";
import {
  type DataViewItem,
  getDataViewItems,
  type ValidationRow,
} from "../organisms/DataTable/tableData";
import { BioDOrganEditModal } from "./BioDOrganEditModal";
import { BioDOrganViewModal } from "./BioDOrganViewModal";
import { BioDWeightSheetModal } from "./BioDWeightSheetModal";
import { BioDWeightSheetViewModal } from "./BioDWeightSheetViewModal";
import { CalliperingSheetModal } from "./CalliperingSheetEditModal";
import { CalliperingSheetViewModal } from "./CalliperingSheetViewModal";
import { RejectExperimentModal } from "./RejectExperimentModal";
import { SuccessAlert } from "./SuccessAlert";

interface DataViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  experiment: ValidationRow;
}

export function DataViewModal({
  isOpen,
  onClose,
  experiment,
}: DataViewModalProps) {
  const [dataItems, setDataItems] = useState<DataViewItem[]>([]);

  useEffect(() => {
    const items = getDataViewItems(
      experiment.experimentName,
      experiment.studyType,
      experiment.dataType
    );
    setDataItems(items);
  }, [experiment.experimentName, experiment.studyType, experiment.dataType]);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWeightSheetModal, setShowWeightSheetModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataViewItem | null>(null);
  const [bioDWeightSheetMode, setBioDWeightSheetMode] = useState<
    "view" | "edit" | null
  >(null);
  const [calliperingSheetMode, setCalliperingSheetMode] = useState<
    "view" | "edit" | null
  >(null);
  const [showCalliperingSheetModal, setShowCalliperingSheetModal] =
    useState(false);

  const approveMutation = useApproveExperimentData();
  const rejectMutation = useRejectExperimentData();

  const handleAction = (
    item: DataViewItem,
    action: "view" | "edit" | "approve" | "reject"
  ) => {
    setSelectedItem(item);

    if (action === "view" || action === "edit") {
      if (item.name === "BioD Weight Sheet" || item.name === "Weight Sheet") {
        setShowWeightSheetModal(true);
        setBioDWeightSheetMode(action === "edit" ? "edit" : "view");
        return;
      }
      if (
        item.name === "Callipering Data" ||
        item.name === "Callipering Sheet" ||
        item.name === "Callipering"
      ) {
        setShowCalliperingSheetModal(true);
        setCalliperingSheetMode(action === "edit" ? "edit" : "view");
        return;
      }
    }

    switch (action) {
      case "view":
        setShowViewModal(true);
        break;
      case "edit":
        setShowEditModal(true);
        break;
      case "approve":
        approveMutation.mutate(experiment.id, {
          onSuccess: (data) => {
            toast.success("Experiment data approved successfully", {
              description: `Status updated to ${data.status}`,
            });
            onClose();
          },
        });
        break;
      case "reject":
        setShowRejectModal(true);
        break;
    }
  };

  const handleReject = (rejectionReason: string) => {
    if (selectedItem) {
      rejectMutation.mutate(
        {
          experimentDataId: experiment.id,
          rejectionReason,
        },
        {
          onSuccess: (data) => {
            toast.success("Experiment data rejected successfully", {
              description: `Status updated to ${data.status}`,
            });

            onClose();
          },
        }
      );
    }
  };

  const handleSaveEdit = (data: unknown) => {
    console.log("Saved data:", data);
  };

  return (
    <>
      <SuccessAlert
        isVisible={showSuccessAlert}
        message={`BioD Organ has been approved for experiment ${experiment.experimentName}`}
        onClose={() => setShowSuccessAlert(false)}
      />

      <Dialog
        open={isOpen}
        onOpenChange={(open: boolean) => {
          if (!open) onClose();
        }}
        title={
          <span className="text-xl font-semibold text-foreground">
            Data View - {experiment.experimentName}
          </span>
        }
        description={
          <span className="text-sm text-muted-foreground">
            Select the type of data you want to view or edit
          </span>
        }
        showClose={true}
        className="w-9/10  max-w-300"
        trigger={null}
      >
        <div className="space-y-4">
          {dataItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-card"
            >
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{item.name}</h3>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleAction(item, "view")}
                  disabled={!item.canView}
                  className="text-muted-foreground hover:text-foreground"
                  title="View"
                >
                  <Eye className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleAction(item, "edit")}
                  disabled={!item.canEdit}
                  className="text-muted-foreground hover:text-foreground"
                  title="Edit"
                >
                  <Edit className="size-4" />
                </Button>

                {experiment.status === "pending" && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAction(item, "approve")}
                      title="Approve"
                    >
                      <Check className="size-4 text-green-700" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAction(item, "reject")}
                      disabled={!item.canReject || item.status === "Error"}
                      className=" hover:text-red-700 hover:bg-red-50"
                      title="Reject"
                    >
                      <XIcon className="size-4 text-red-600" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}

          {dataItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No data available for this experiment.
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </Dialog>

      <BioDOrganViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        experimentName={experiment.experimentName}
      />

      <BioDOrganEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        experimentName={experiment.experimentName}
      />

      {selectedItem &&
        selectedItem.name === "BioD Weight Sheet" &&
        showWeightSheetModal &&
        (bioDWeightSheetMode === "edit" ? (
          <BioDWeightSheetModal
            isOpen={showWeightSheetModal}
            onClose={() => {
              setShowWeightSheetModal(false);
              setBioDWeightSheetMode(null);
            }}
            onSave={handleSaveEdit}
            experimentName={experiment.experimentName}
            experimentDataId={experiment.id}
          />
        ) : (
          <BioDWeightSheetViewModal
            isOpen={showWeightSheetModal}
            onClose={() => {
              setShowWeightSheetModal(false);
              setBioDWeightSheetMode(null);
            }}
            experimentName={experiment.experimentName}
            experimentDataId={experiment.id}
          />
        ))}

      {selectedItem &&
        (selectedItem.name === "Callipering Data" ||
          selectedItem.name === "Callipering Sheet" ||
          selectedItem.name === "Callipering") &&
        showCalliperingSheetModal &&
        (calliperingSheetMode === "edit" ? (
          <CalliperingSheetModal
            isOpen={showCalliperingSheetModal}
            onClose={() => {
              setShowCalliperingSheetModal(false);
              setCalliperingSheetMode(null);
            }}
            onSave={handleSaveEdit}
            experimentName={experiment.experimentName}
            experimentDataId={experiment.id}
          />
        ) : (
          <CalliperingSheetViewModal
            isOpen={showCalliperingSheetModal}
            onClose={() => {
              setShowCalliperingSheetModal(false);
              setCalliperingSheetMode(null);
            }}
            experimentName={experiment.experimentName}
            experimentDataId={experiment.id}
          />
        ))}

      <RejectExperimentModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onReject={handleReject}
        item={selectedItem}
      />
    </>
  );
}
