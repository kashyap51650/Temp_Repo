import { Check, Edit, Eye, X as XIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "../atoms/Button/Button";
import { Dialog } from "../atoms/Dialog/Dialog";
import {
  type DataViewItem,
  getDataViewItems,
  type ValidationRow,
} from "../organisms/DataTable/tableData";
import { biodWeightSheetData } from "../organisms/DataTable/tableData";
import { BioDOrganEditModal } from "./BioDOrganEditModal";
import { BioDOrganViewModal } from "./BioDOrganViewModal";
import { BioDWeightSheetModal } from "./BioDWeightSheetModal";
import { BioDWeightSheetViewModal } from "./BioDWeightSheetViewModal";
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
  const [dataItems, setDataItems] = useState<DataViewItem[]>(() =>
    getDataViewItems(experiment.experimentName)
  );
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWeightSheetModal, setShowWeightSheetModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataViewItem | null>(null);
  const [bioDWeightSheetMode, setBioDWeightSheetMode] = useState<
    "view" | "edit" | null
  >(null);

  const handleAction = (
    item: DataViewItem,
    action: "view" | "edit" | "approve" | "reject"
  ) => {
    setSelectedItem(item);

    if (item.name === "BioD Weight Sheet") {
      setShowWeightSheetModal(true);
      setBioDWeightSheetMode(action === "edit" ? "edit" : "view");
      return;
    }

    switch (action) {
      case "view":
        setShowViewModal(true);
        break;
      case "edit":
        setShowEditModal(true);
        break;
      case "approve":
        setDataItems((prev) =>
          prev.map((prevItem) =>
            prevItem.id === item.id
              ? { ...prevItem, status: "Validated" as const }
              : prevItem
          )
        );
        setShowSuccessAlert(true);
        break;
      case "reject":
        setShowRejectModal(true);
        break;
    }
  };

  const handleReject = () => {
    if (selectedItem) {
      setDataItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? { ...item, status: "Error" as const }
            : item
        )
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
            data={biodWeightSheetData}
          />
        ) : (
          <BioDWeightSheetViewModal
            isOpen={showWeightSheetModal}
            onClose={() => {
              setShowWeightSheetModal(false);
              setBioDWeightSheetMode(null);
            }}
            experimentName={experiment.experimentName}
            data={biodWeightSheetData}
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
