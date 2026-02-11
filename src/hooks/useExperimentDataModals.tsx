import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import ViewBloodChemistryDataModal from "@/components/data-upload/ViewBloodChemistryDataModal";
import { ViewHematologyDataModal } from "@/components/data-upload/ViewHematologyDataModal";
import { AGCSheetViewModal } from "@/components/data-validation/AGCSheetViewModal";
import { BioDOrganViewModal } from "@/components/data-validation/BioDOrganViewModal";
import { BioDWeightSheetViewModal } from "@/components/data-validation/BioDWeightSheetViewModal";
import { CalliperingSheetViewModal } from "@/components/data-validation/CalliperingSheetViewModal";
import { PDFViewModal } from "@/components/data-validation/PDFViewModal";
import { DATA_TYPE } from "@/lib/constants";
import { PERMISSIONS } from "@/lib/permissions";

import { useModal } from "./useModal";
import { usePermissions } from "./usePermissions";

interface ExperimentDataItem {
  id: string | number;
  experimentName?: string;
  status?: string;
  dataType?: string;
  experiment?: {
    id: number;
    experiment_name: string;
  };
  data_type?: {
    data_type_name: string;
  };
  studyType?: string;
  study_type?: {
    study_type_name: string;
  };
}

interface UseExperimentDataModalsOptions {
  hideActions?: boolean;
}

export function useExperimentDataModals(
  options: UseExperimentDataModalsOptions = {}
) {
  const { hideActions = false } = options;
  const { hasAnyPermission } = usePermissions();

  const navigate = useNavigate();

  const canEditOrApprove =
    !hideActions &&
    hasAnyPermission([
      PERMISSIONS.DATA_VALIDATE.EDIT_DATA,
      PERMISSIONS.DATA_VALIDATE.APPROVE_REJECT_DATA,
    ]);

  const [selectedExperiment, setSelectedExperiment] =
    useState<ExperimentDataItem | null>(null);

  const calliperingViewModal = useModal();
  const weightSheetViewModal = useModal();
  const organViewModal = useModal();
  const agcViewModal = useModal();
  const hematologyViewModal = useModal();
  const bloodChemistryViewModal = useModal();
  const necropsyViewModal = useModal();
  const hotlabViewModal = useModal();

  const handleViewData = useCallback(
    (experiment: ExperimentDataItem) => {
      setSelectedExperiment(experiment);

      // Get data type name from different possible structures
      const dataTypeName =
        experiment.dataType || experiment.data_type?.data_type_name || "";

      const dataTypeLower = dataTypeName.toLowerCase();

      // Check if it's a callipering type sheet
      const isCalliperingSheet = dataTypeLower.includes("callipering");

      // Check if it's a necropsy/organ sheet
      const isOrganSheet =
        dataTypeLower.includes("organ") && dataTypeLower.includes("sheet");

      // Check if it's a weight sheet
      const isWeightSheet =
        dataTypeLower.includes("weight") && dataTypeLower.includes("sheet");

      const isAGCSheet = dataTypeLower.includes("agc");

      const isHematologySheet = dataTypeName === DATA_TYPE.HEMATOLOGY;
      const isBloodChemistrySheet = dataTypeName === DATA_TYPE.BLOOD_CHEMISTRY;
      const isHotlab = dataTypeName === DATA_TYPE.HOTLAB;
      const isNecropsy = dataTypeLower.includes("necropsy");

      if (isCalliperingSheet) {
        navigate({
          to: "/data-validate",
          search: {
            experimentId: experiment.experiment?.id,
          },
        });
        calliperingViewModal.openModal();
        return;
      }

      if (isOrganSheet) {
        organViewModal.openModal();
        return;
      }

      if (isWeightSheet) {
        weightSheetViewModal.openModal();
        return;
      }

      if (isAGCSheet) {
        agcViewModal.openModal();
        return;
      }

      if (isNecropsy) {
        necropsyViewModal.openModal();
        return;
      }
      if (isHematologySheet) {
        hematologyViewModal.openModal();
        return;
      }
      if (isBloodChemistrySheet) {
        bloodChemistryViewModal.openModal();
        return;
      }

      if (isHotlab) {
        hotlabViewModal.openModal();
        return;
      }

      // Fallback for unsupported or unknown data types
      toast.error(
        "Unsupported data type encountered in handleViewData:" + dataTypeName
      );
    },
    [
      calliperingViewModal,
      organViewModal,
      weightSheetViewModal,
      agcViewModal,
      hematologyViewModal,
      bloodChemistryViewModal,
      necropsyViewModal,
      hotlabViewModal,
      navigate,
    ]
  );

  const renderModals = () => {
    if (!selectedExperiment) return null;
    // Get experiment name from different possible structures
    const experimentName =
      selectedExperiment.experimentName ||
      selectedExperiment.experiment?.experiment_name ||
      "";

    // Convert ID to string
    const experimentDataId = String(selectedExperiment.id);

    // Validate experiment ID - warn developers if missing
    const experimentId = selectedExperiment.experiment?.id;

    if (!experimentId || experimentId === 0) {
      toast.error("something went wrong: experiment ID is missing or invalid.");
    }

    // Get status
    const experimentStatus = selectedExperiment.status || "";
    const experimentDataType =
      selectedExperiment.dataType ||
      selectedExperiment.data_type?.data_type_name ||
      "";
    const experimentStudyType =
      selectedExperiment.studyType ||
      selectedExperiment.study_type?.study_type_name ||
      "";

    return (
      <>
        {calliperingViewModal.isOpen && (
          <CalliperingSheetViewModal
            isOpen={calliperingViewModal.isOpen}
            onClose={calliperingViewModal.closeModal}
            experimentName={experimentName}
            experimentDataId={experimentDataId}
            experimentStatus={experimentStatus}
            hideActions={hideActions || !canEditOrApprove}
            experimentDataType={experimentDataType}
            experimentStudyType={experimentStudyType}
            experimentId={experimentId || 0}
          />
        )}
        {weightSheetViewModal.isOpen && (
          <BioDWeightSheetViewModal
            isOpen={weightSheetViewModal.isOpen}
            onClose={weightSheetViewModal.closeModal}
            experimentName={experimentName}
            experimentDataId={experimentDataId}
            experimentStatus={experimentStatus}
            hideActions={hideActions || !canEditOrApprove}
            experimentStudyType={experimentStudyType}
          />
        )}
        {organViewModal.isOpen && (
          <BioDOrganViewModal
            isOpen={organViewModal.isOpen}
            onClose={organViewModal.closeModal}
            experimentName={experimentName}
            experimentDataId={experimentDataId}
            experimentStatus={experimentStatus}
            hideActions={hideActions || !canEditOrApprove}
          />
        )}
        {necropsyViewModal.isOpen && (
          <PDFViewModal
            isOpen={necropsyViewModal.isOpen}
            onClose={necropsyViewModal.closeModal}
            experimentName={experimentName}
            experimentDataId={experimentDataId}
            experimentStatus={experimentStatus}
            hideActions={hideActions || !canEditOrApprove}
            dataType="necropsy"
          />
        )}
        {hotlabViewModal.isOpen && (
          <PDFViewModal
            isOpen={hotlabViewModal.isOpen}
            onClose={hotlabViewModal.closeModal}
            experimentName={experimentName}
            experimentDataId={experimentDataId}
            experimentStatus={experimentStatus}
            hideActions={hideActions || !canEditOrApprove}
            dataType="hotlab"
          />
        )}
        {agcViewModal.isOpen && (
          <AGCSheetViewModal
            isOpen={agcViewModal.isOpen}
            onClose={agcViewModal.closeModal}
          />
        )}
        {experimentId && hematologyViewModal.isOpen && (
          <ViewHematologyDataModal
            open={hematologyViewModal.isOpen}
            onOpenChange={hematologyViewModal.closeModal}
            experimentId={experimentId}
            experimentDataId={experimentDataId}
            experimentStatus={experimentStatus}
            hideActions={hideActions || !canEditOrApprove}
          />
        )}
        {experimentId && bloodChemistryViewModal.isOpen && (
          <ViewBloodChemistryDataModal
            open={bloodChemistryViewModal.isOpen}
            onOpenChange={bloodChemistryViewModal.closeModal}
            experimentId={experimentId}
            experimentDataId={experimentDataId}
            experimentStatus={experimentStatus}
            hideActions={hideActions || !canEditOrApprove}
          />
        )}
      </>
    );
  };

  return {
    handleViewData,
    renderModals,
    selectedExperiment,
  };
}
