import { lazy, Suspense, useCallback, useState } from "react";
import { toast } from "sonner";

import { ModalSkeleton } from "@/components/skeletons/ModalSkeleton";
import { DATA_TYPE } from "@/lib/constants";

import { useModal } from "./useModal";

const ViewBloodChemistryDataModal = lazy(
  () => import("@/components/data-upload/ViewBloodChemistryDataModal")
);
const ViewHematologyDataModal = lazy(() =>
  import("@/components/data-upload/ViewHematologyDataModal").then((module) => ({
    default: module.ViewHematologyDataModal,
  }))
);
const AGCSheetViewModal = lazy(() =>
  import("@/components/data-validation/AGCSheetViewModal").then((module) => ({
    default: module.AGCSheetViewModal,
  }))
);
const BioDOrganViewModal = lazy(() =>
  import("@/components/data-validation/BioDOrganViewModal").then((module) => ({
    default: module.BioDOrganViewModal,
  }))
);
const BioDWeightSheetViewModal = lazy(() =>
  import("@/components/data-validation/BioDWeightSheetViewModal").then(
    (module) => ({ default: module.BioDWeightSheetViewModal })
  )
);
const CalliperingSheetViewModal = lazy(() =>
  import("@/components/data-validation/CalliperingSheetViewModal").then(
    (module) => ({ default: module.CalliperingSheetViewModal })
  )
);
const NecropsyAndHotlabPDFViewModal = lazy(() =>
  import("@/components/data-validation/NecropsyAndHotlabPDFViewModal").then(
    (module) => ({ default: module.NecropsyAndHotlabPDFViewModal })
  )
);
const CMCDataViewModal = lazy(
  () => import("@/components/data-validation/CMCDataViewModal")
);
const DelfiaAndSBASheetViewModal = lazy(() =>
  import("@/components/data-validation/DelfiaAndSBASheetViewModal").then(
    (module) => ({
      default: module.DelfiaAndSBASheetViewModal,
    })
  )
);

const ElisaDataViewModal = lazy(
  () => import("@/components/data-validation/ElisaDataViewModal")
);

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
  const cmcViewModal = useModal();
  const saturationBindingAssayViewModal = useModal();
  const elisaViewModal = useModal();
  const delfiaViewModal = useModal();

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

      const isClrfData = dataTypeName === DATA_TYPE.CLRF;
      const isConjugationData = dataTypeName === DATA_TYPE.CONJUGATION;
      const isDirectBindingAssayData =
        dataTypeName === DATA_TYPE.DIRECT_BINDING_ASSAY;
      const isGelImageData = dataTypeName === DATA_TYPE.GEL_IMAGE;
      const isIrfData = dataTypeName === DATA_TYPE.IRF;
      const isReceptorQuantification =
        dataTypeName === DATA_TYPE.RECEPTOR_QUANTIFICATION;
      const isSaturationBindingAssay =
        dataTypeName === DATA_TYPE.SATURATION_BINDING_ASSAY;
      const isElisaData = dataTypeName === DATA_TYPE.ELISA;
      const isDelfiaData = dataTypeName === DATA_TYPE.DELFIA;

      if (isCalliperingSheet) {
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

      if (
        isClrfData ||
        isConjugationData ||
        isDirectBindingAssayData ||
        isGelImageData ||
        isIrfData ||
        isReceptorQuantification
      ) {
        cmcViewModal.openModal();
        return;
      }

      if (isSaturationBindingAssay) {
        saturationBindingAssayViewModal.openModal();
        return;
      }

      if (isElisaData) {
        elisaViewModal.openModal();
        return;
      }

      if (isDelfiaData) {
        delfiaViewModal.openModal();
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
      cmcViewModal,
      saturationBindingAssayViewModal,
      elisaViewModal,
      delfiaViewModal,
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
          <Suspense fallback={<ModalSkeleton />}>
            <CalliperingSheetViewModal
              isOpen={calliperingViewModal.isOpen}
              onClose={calliperingViewModal.closeModal}
              experimentName={experimentName}
              experimentDataId={experimentDataId}
              experimentStatus={experimentStatus}
              hideActions={hideActions}
              experimentDataType={experimentDataType}
              experimentStudyType={experimentStudyType}
              experimentId={experimentId || 0}
            />
          </Suspense>
        )}
        {weightSheetViewModal.isOpen && (
          <Suspense fallback={<ModalSkeleton />}>
            <BioDWeightSheetViewModal
              isOpen={weightSheetViewModal.isOpen}
              onClose={weightSheetViewModal.closeModal}
              experimentName={experimentName}
              experimentDataId={experimentDataId}
              experimentStatus={experimentStatus}
              hideActions={hideActions}
              experimentStudyType={experimentStudyType}
            />
          </Suspense>
        )}
        {organViewModal.isOpen && (
          <Suspense fallback={<ModalSkeleton />}>
            <BioDOrganViewModal
              isOpen={organViewModal.isOpen}
              onClose={organViewModal.closeModal}
              experimentName={experimentName}
              experimentDataId={experimentDataId}
              experimentStatus={experimentStatus}
              hideActions={hideActions}
            />
          </Suspense>
        )}
        {necropsyViewModal.isOpen && (
          <Suspense fallback={<ModalSkeleton />}>
            <NecropsyAndHotlabPDFViewModal
              isOpen={necropsyViewModal.isOpen}
              onClose={necropsyViewModal.closeModal}
              experimentName={experimentName}
              experimentDataId={experimentDataId}
              experimentStatus={experimentStatus}
              hideActions={hideActions}
              dataType="necropsy"
            />
          </Suspense>
        )}
        {hotlabViewModal.isOpen && (
          <Suspense fallback={<ModalSkeleton />}>
            <NecropsyAndHotlabPDFViewModal
              isOpen={hotlabViewModal.isOpen}
              onClose={hotlabViewModal.closeModal}
              experimentName={experimentName}
              experimentDataId={experimentDataId}
              experimentStatus={experimentStatus}
              hideActions={hideActions}
              dataType="hotlab"
            />
          </Suspense>
        )}
        {agcViewModal.isOpen && (
          <Suspense fallback={<ModalSkeleton />}>
            <AGCSheetViewModal
              isOpen={agcViewModal.isOpen}
              onClose={agcViewModal.closeModal}
            />
          </Suspense>
        )}
        {experimentId && hematologyViewModal.isOpen && (
          <Suspense fallback={<ModalSkeleton />}>
            <ViewHematologyDataModal
              open={hematologyViewModal.isOpen}
              onOpenChange={hematologyViewModal.closeModal}
              experimentId={experimentId}
              experimentDataId={experimentDataId}
              experimentStatus={experimentStatus}
              hideActions={hideActions}
            />
          </Suspense>
        )}
        {experimentId && bloodChemistryViewModal.isOpen && (
          <Suspense fallback={<ModalSkeleton />}>
            <ViewBloodChemistryDataModal
              open={bloodChemistryViewModal.isOpen}
              onOpenChange={bloodChemistryViewModal.closeModal}
              experimentId={experimentId}
              experimentDataId={experimentDataId}
              experimentStatus={experimentStatus}
              hideActions={hideActions}
            />
          </Suspense>
        )}
        {experimentId && cmcViewModal.isOpen && (
          <Suspense fallback={<ModalSkeleton />}>
            <CMCDataViewModal
              isOpen={cmcViewModal.isOpen}
              onClose={cmcViewModal.closeModal}
              experimentDataId={experimentDataId}
              experimentStatus={experimentStatus}
              experimentName={experimentName}
              experimentDataType={experimentDataType}
              hideActions={hideActions}
            />
          </Suspense>
        )}
        {experimentId && saturationBindingAssayViewModal.isOpen && (
          <Suspense fallback={<ModalSkeleton />}>
            <DelfiaAndSBASheetViewModal
              isOpen={saturationBindingAssayViewModal.isOpen}
              onClose={saturationBindingAssayViewModal.closeModal}
              experimentDataId={experimentDataId}
              experimentStatus={experimentStatus}
              experimentName={experimentName}
              experimentDataType={experimentDataType}
              hideActions={hideActions}
            />
          </Suspense>
        )}
        {experimentId && delfiaViewModal.isOpen && (
          <Suspense fallback={<ModalSkeleton />}>
            <DelfiaAndSBASheetViewModal
              isOpen={delfiaViewModal.isOpen}
              onClose={delfiaViewModal.closeModal}
              experimentDataId={experimentDataId}
              experimentStatus={experimentStatus}
              experimentName={experimentName}
              experimentDataType={experimentDataType}
              hideActions={hideActions}
            />
          </Suspense>
        )}
        {experimentId && elisaViewModal.isOpen && (
          <Suspense fallback={<ModalSkeleton />}>
            <ElisaDataViewModal
              isOpen={elisaViewModal.isOpen}
              onClose={elisaViewModal.closeModal}
              experimentDataId={experimentDataId}
              experimentStatus={experimentStatus}
              experimentName={experimentName}
              experimentDataType={experimentDataType}
              hideActions={hideActions}
            />
          </Suspense>
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
