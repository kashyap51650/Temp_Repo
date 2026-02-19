import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { ExperimentDropdownItem, Project } from "@/api";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearExperimentEvents } from "@/app/store/slices/experimentSlice";
import {
  DATA_TYPE,
  FILE_SIZE_LIMITS,
  FILE_TYPES,
  SPECIALIZATION,
  STUDY_TYPE,
  type StudyType as ExperimentStudyType,
} from "@/lib/constants";
import type { BloodChemistryReport } from "@/types/bloodChemistry";
import type { HematologyReport } from "@/types/hematology";
import type { HotlabPDFUploadResponse } from "@/types/hotlab";

import { useDownloadSheet, useModal, useUploadData } from "../../hooks";
import { Button } from "../atoms";
import { CustomToast } from "../molecules";
import { ViewRandomizationButton } from "../molecules/ViewRandomizationButton/ViewRandomizationButton";
import { DataTypeDropdown } from "./DataTypeDropdown";
import { DownloadOrganSheetModal } from "./DownloadOrganSheetModal";
import { ExperimentDropdown } from "./ExperimentDropdown";
import { FileUploadArea } from "./FileUploadArea";
import { GenericFileUploadArea } from "./GenericFileUploadArea";
import { LinkExperimentModal } from "./LinkExperimentModal";
import { MouseGroupForAgcSelectionModal } from "./MouseGroupForAgcSelectionModal";
import { NValueSelectionModal } from "./NValueSelectionModal";
import PreviewBloodChemistryReportModal from "./PreviewBloodChemistryReportModal";
import { PreviewHematologyReportModal } from "./PreviewHematologyReportModal";
import { ProjectSection } from "./ProjectSection";
import { SpecialisationDropdown } from "./SpecialisationDropdown";
import { StudyTypeDropdown } from "./StudyTypeDropdown";
import { UploadedFilesList } from "./UploadedFilesList";

export interface FormData {
  project: Project | null;
  specialisation: string;
  studyType: string;
  experiment: ExperimentDropdownItem | null;
  dataType: string;
  dataTypeId: number | null;
  studyTypeId?: number | null;
  uploadedFile: File | null;
  newExperimentName?: string;
  uploadAGCFile?: File | null;
}

interface ValidationErrors {
  project?: string;
  specialisation?: string;
  studyType?: string;
  experiment?: string;
  dataType?: string;
  uploadedFile?: string;
}

// Define grouped prop interfaces
interface FormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: ValidationErrors;
  isCreatingNewProject: boolean;
}

interface ApiDataProps {
  projects: Array<{ id: string; name: string }>;
}

interface LoadingProps {
  projectsLoading: boolean;
}

interface ActionProps {
  onProjectChange: (project: Project | null) => void;
  onShowCreateProjectModal: () => void;
  onShowCreateExperimentModal: () => void;
}

interface UploadPanelProps {
  formProps: FormProps;
  apiDataProps: ApiDataProps;
  loadingProps: LoadingProps;
  actionProps: ActionProps;
}

export default function UploadPanel(props: Readonly<UploadPanelProps>) {
  const {
    formProps: { formData, setFormData, errors, isCreatingNewProject },
    apiDataProps: { projects: existingProjects },
    loadingProps: { projectsLoading },
    actionProps: {
      onProjectChange,
      onShowCreateProjectModal,
      onShowCreateExperimentModal,
    },
  } = props;
  const isProjectSelected = !!formData.project;
  const isSpecialisationSelected = !!formData.specialisation;

  const isHotlabSelected =
    formData.specialisation?.toLowerCase() === SPECIALIZATION.HOTLAB;

  const isPreclinicSelected =
    formData.specialisation?.toLowerCase() === SPECIALIZATION.PRECLINICAL;
  const isCMCSelected =
    formData.specialisation?.toLowerCase() === SPECIALIZATION.CMC;
  const isChemistrySelected =
    formData.specialisation?.toLowerCase() === SPECIALIZATION.CHEMISTRY;
  const isClrfData = formData.dataType === DATA_TYPE.CLRF;
  const isDirectBindingAssayData =
    formData.dataType === DATA_TYPE.DIRECT_BINDING_ASSAY;
  const isIrfData = formData.dataType === DATA_TYPE.IRF;
  const isReceptorQuantificationData =
    formData.dataType === DATA_TYPE.RECEPTOR_QUANTIFICATION;
  const isConjugationData = formData.dataType === DATA_TYPE.CONJUGATION;
  const isGelImageData = formData.dataType === DATA_TYPE.GEL_IMAGE;
  const isSaturationBindingDataTypeSelected =
    formData.dataType === DATA_TYPE.SATURATION_BINDING_ASSAY;

  const isStudyTypeSelected = !!formData.studyType;

  const isExperimentSelected =
    !!formData.experiment || formData.studyType === STUDY_TYPE.EFFICACY;
  const isDataTypeSelected = !!formData.dataType;

  const isNecropsyData =
    (formData.studyType === STUDY_TYPE.BIO_DISTRIBUTION ||
      formData.studyType === STUDY_TYPE.MODEL_STUDY) &&
    formData.specialisation?.toLowerCase() ===
      SPECIALIZATION.PRECLINICAL.toLowerCase() &&
    formData.dataType === DATA_TYPE.ORGAN_WEIGHT_SHEET;

  const isPdfUpload =
    formData.specialisation.toLowerCase() === SPECIALIZATION.HOTLAB ||
    formData.dataType === DATA_TYPE.HOTLAB ||
    ((formData.studyType === STUDY_TYPE.DOSE_RANGE_FINDING ||
      formData.studyType === STUDY_TYPE.TOXICITY) &&
      (formData.dataType === DATA_TYPE.NECROPSY_SHEET ||
        formData.dataType === DATA_TYPE.HEMATOLOGY ||
        formData.dataType === DATA_TYPE.BLOOD_CHEMISTRY));

  const canShowStudyType =
    isPreclinicSelected || isCMCSelected || isChemistrySelected;
  const canShowExperimentDropdown =
    isPreclinicSelected || isCMCSelected || isChemistrySelected;
  const canShowDataType =
    isPreclinicSelected || isCMCSelected || isChemistrySelected;

  const isGenericFileUploadVisible =
    isPdfUpload || isCMCSelected || isChemistrySelected;
  const isAGCSelected =
    isNecropsyData || formData.dataType === DATA_TYPE.AGC_SHEET;

  function isGenericUploadDisabled() {
    if (!isProjectSelected) return true;

    if (isPreclinicSelected && !isDataTypeSelected) return true;

    if (isCMCSelected || isChemistrySelected) {
      if (!isExperimentSelected || !isDataTypeSelected) {
        return true;
      }
    }

    return false;
  }

  const [isOpenDownloadOrganSheetModal, setIsOpenDownloadOrganSheetModal] =
    useState(false);
  const [isOpenGroupSelectionModalForAGC, setIsOpenGroupSelectionModalForAGC] =
    useState(false);

  const [extractedExperimentList, setExtractedExperimentList] = useState<
    {
      experimentId: number;
      experimentName: string;
    }[]
  >([]);

  const [hematologyDataForPreview, setHematologyDataForPreview] = useState<
    HematologyReport | undefined
  >();

  const [bloodChemistryDataForPreview, setBloodChemistryDataForPreview] =
    useState<BloodChemistryReport | undefined>();

  const dispatch = useAppDispatch();

  const { lastCreatedExperiment, experimentEventCounter } = useAppSelector(
    (state) => state.experiment
  );

  const processedExperimentCounter = useRef<number>(0);
  const nValueSelectModal = useModal();

  useEffect(() => {
    if (
      lastCreatedExperiment &&
      experimentEventCounter > 0 &&
      processedExperimentCounter.current !== experimentEventCounter
    ) {
      processedExperimentCounter.current = experimentEventCounter;

      const { experimentId, experimentName } = lastCreatedExperiment;

      const formattedExperiment: ExperimentDropdownItem = {
        id: experimentId,
        experiment_name: experimentName,
        randomization_status: lastCreatedExperiment.randomizationStatus,
      };

      setFormData((prev: FormData) => ({
        ...prev,
        experiment: formattedExperiment,
      }));

      dispatch(clearExperimentEvents());
    }
  }, [experimentEventCounter, lastCreatedExperiment, setFormData, dispatch]);

  const {
    isOpen: isOpenHematologyReportModal,
    closeModal: closeHematologyReportModal,
    openModal: openHematologyReportModal,
  } = useModal();

  const {
    isOpen: isOpenBloodChemistryReportModal,
    closeModal: closeBloodChemistryReportModal,
    openModal: openBloodChemistryReportModal,
  } = useModal();

  const {
    isOpen: isOpenLinkExperimentModal,
    closeModal: closeLinkExperimentModal,
    openModal: openLinkExperimentModal,
  } = useModal();

  useEffect(() => {
    setHematologyDataForPreview(undefined);
    setBloodChemistryDataForPreview(undefined);
  }, [formData.experiment?.id]);

  const handleUploadFileReset = () => {
    setFormData((prev: FormData) => ({
      ...prev,
      uploadedFile: null,
      ...(isAGCSelected && { uploadAGCFile: null }),
    }));
  };

  const handleSuccess = (data: unknown) => {
    if (data) {
      if (isAGCSelected) {
        setIsOpenGroupSelectionModalForAGC(false);
        handleUploadFileReset();
        return;
      }
      if (isSaturationBindingDataTypeSelected) {
        nValueSelectModal.closeModal();
        handleUploadFileReset();
        return;
      }

      if (isHotlabSelected) {
        const hotlabData = data as HotlabPDFUploadResponse;
        if (hotlabData.data?.experiments) {
          const experimentsFromResponse = hotlabData.data.experiments.map(
            (exp) => ({
              experimentId: exp.experiment.id,
              experimentName: exp.experiment.experiment_name,
            })
          );
          setExtractedExperimentList(experimentsFromResponse);
        }
        openLinkExperimentModal();
        return;
      }

      handleUploadFileReset();

      if (formData.dataType === DATA_TYPE.HEMATOLOGY) {
        setHematologyDataForPreview(data as HematologyReport);
        openHematologyReportModal();
      } else if (formData.dataType === DATA_TYPE.BLOOD_CHEMISTRY) {
        setBloodChemistryDataForPreview(data as BloodChemistryReport);
        openBloodChemistryReportModal();
      }
    }
  };

  const handleError = (error: Error) => {
    if (isAGCSelected) {
      const errors = error?.message
        ?.split("\n")
        .filter((val) => val.trim() !== "");

      toast.custom(
        (_id) => (
          <CustomToast
            title="Error importing AGC Experiment data"
            variant="error"
            onDismiss={() => toast.dismiss(_id)}
            errors={errors}
            position="top-right"
          />
        ),
        {
          duration: Infinity,
        }
      );
      return;
    }
    toast.error(error.message || "Error uploading file");
  };

  const { handleUpload, handleAgcUpload, isUploading } = useUploadData({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleGenericFileUpload = () => {
    if (isSaturationBindingDataTypeSelected) {
      nValueSelectModal.openModal();
      return;
    }
    handleUpload({ formData, isPdfUpload: true });
  };

  // Download Sheet Hook
  const { downloadSheet, isDownloading } = useDownloadSheet();

  const downloadButtonClickHandler = () => {
    // Handle download for Organ Sheet
    if (isNecropsyData) {
      setIsOpenDownloadOrganSheetModal(true);
      return;
    }

    // Handle download for other sheets
    if (
      formData.experiment?.id &&
      (formData.dataType === DATA_TYPE.WEIGHT_SHEET ||
        formData.dataType === DATA_TYPE.CALLIPERING_SHEET)
    ) {
      downloadSheet(formData.experiment.id, formData.dataType);
    }
  };

  const canShowDownloadButton =
    isPreclinicSelected && isStudyTypeSelected && isDataTypeSelected;

  const hasRequiredFieldsForUpload = () => {
    if (isHotlabSelected) {
      return true;
    }

    if (isPreclinicSelected || isCMCSelected || isChemistrySelected) {
      return !!(formData.studyType && formData.dataType);
    }

    return true;
  };

  const canUploadData =
    formData.project &&
    formData.specialisation &&
    formData.uploadedFile &&
    hasRequiredFieldsForUpload();

  const renderDownloadButtonText = () => {
    if (isNecropsyData) {
      return "Download Organ Sheet";
    }

    if (isDownloading) {
      return "Downloading...";
    }
    return "Download Sample File";
  };

  const getGenericFileUploadBottomText = () => {
    if (!isProjectSelected) {
      return "Please select a project to continue";
    }
    if (isProjectSelected && !isSpecialisationSelected) {
      return "Please complete specialisation selection to continue";
    }
    if (isPreclinicSelected && !isDataTypeSelected) {
      return "Please select data type to continue";
    }
    if (isCMCSelected || isChemistrySelected) {
      if (!isExperimentSelected) {
        return "Please select experiment to continue";
      }
      if (!isDataTypeSelected) {
        return "Please select data type to continue";
      }
    }
  };

  const getGenericFileUploadFileTypeConfig = () => {
    if (isPdfUpload) {
      return {
        fileType: FILE_TYPES.PDF,
        maxFileSize: FILE_SIZE_LIMITS.LARGE_FILE,
      };
    }

    if (isCMCSelected) {
      if (
        isClrfData ||
        isIrfData ||
        isReceptorQuantificationData ||
        isDirectBindingAssayData
      ) {
        return {
          fileType: [
            FILE_TYPES.PDF,
            FILE_TYPES.EXCEL,
            FILE_TYPES.DOCX,
            FILE_TYPES.PNG,
            FILE_TYPES.JPG,
            FILE_TYPES.JPEG,
          ],
          maxFileSize: FILE_SIZE_LIMITS.LARGE_FILE,
        };
      }

      if (isConjugationData) {
        return {
          fileType: FILE_TYPES.PDF,
          maxFileSize: FILE_SIZE_LIMITS.LARGE_FILE,
        };
      }

      if (isGelImageData) {
        return {
          fileType: [FILE_TYPES.PNG, FILE_TYPES.JPG, FILE_TYPES.JPEG],
          maxFileSize: FILE_SIZE_LIMITS.LARGE_FILE,
        };
      }
    }

    return {
      fileType: FILE_TYPES.EXCEL,
      maxFileSize: FILE_SIZE_LIMITS.EXCEL_FILE,
    };
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-0 text-foreground">
        Dataset Upload
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        Follow the hierarchy to upload your research data
      </p>

      {/* Project, Specialisation and Study Type Row */}
      <div
        className={`grid grid-cols-1 gap-4 ${canShowStudyType ? "md:grid-cols-3" : "md:grid-cols-2"}`}
      >
        <ProjectSection
          formData={formData}
          setFormData={setFormData}
          isCreatingNewProject={isCreatingNewProject}
          errors={errors}
          existingProjects={existingProjects}
          onShowCreateProjectModal={onShowCreateProjectModal}
          onProjectChange={onProjectChange}
          projectsLoading={projectsLoading}
        />

        <SpecialisationDropdown
          value={formData.specialisation}
          onValueChange={(value: string) => {
            setFormData((prev: FormData) => ({
              ...prev,
              specialisation: value,
              studyType: "", // Reset study type when specialisation changes
              dataType: "", // Reset data type when specialisation changes
              experiment: null, // Reset experiment when specialisation changes
              dataTypeId: null, // Reset data type ID when specialisation changes
              studyTypeId: null, // Reset study type ID when specialisation changes
            }));
          }}
          disabled={!isProjectSelected}
          error={errors.specialisation}
          showHelperText={!isProjectSelected}
        />

        {canShowStudyType && (
          <StudyTypeDropdown
            value={formData.studyType}
            onValueChange={(value: string, studyTypeId?: number) => {
              setFormData((prev: FormData) => ({
                ...prev,
                studyType: value,
                studyTypeId: studyTypeId || null,
                experiment: null, // Reset experiment when study type changes
                dataType: "", // Reset data type when study type changes
                dataTypeId: null, // Reset data type ID when study type changes
              }));
            }}
            disabled={!isSpecialisationSelected}
            error={errors.studyType}
            showHelperText={!isSpecialisationSelected}
            specialization={formData.specialisation}
            module="data_upload"
          />
        )}

        {canShowExperimentDropdown && (
          <ExperimentDropdown
            value={formData.experiment?.id.toString() || ""}
            onValueChange={(
              val: string,
              experiment?: ExperimentDropdownItem
            ) => {
              const experimentId = Number.parseInt(val, 10);
              // Preserve experiment details when experiment changes
              setFormData((prev: FormData) => ({
                ...prev,
                experiment:
                  experiment ||
                  ({
                    id: experimentId,
                    experiment_name: prev.experiment?.experiment_name,
                    randomization_status: prev.experiment?.randomization_status,
                  } as ExperimentDropdownItem),
              }));
            }}
            onCreateNew={onShowCreateExperimentModal}
            showHelperText={!isStudyTypeSelected}
            validationError={errors.experiment}
            projectId={formData.project?.id}
            specialization={formData.specialisation}
            studyTypeId={formData.studyTypeId ?? undefined}
            disabled={!isStudyTypeSelected}
          />
        )}

        {canShowDataType && (
          <DataTypeDropdown
            value={formData.dataType}
            onValueChange={(value: string, dataTypeId?: number) => {
              setFormData((prev: FormData) => ({
                ...prev,
                dataType: value,
                dataTypeId: dataTypeId || null,
                uploadedFile: null,
              }));
            }}
            disabled={!isExperimentSelected}
            error={errors.dataType}
            showHelperText={!isExperimentSelected}
            studyTypeId={formData.studyTypeId ?? undefined}
            module="data_upload"
          />
        )}

        {formData.experiment?.randomization_status === "completed" && (
          <div className="md:mt-6">
            <ViewRandomizationButton experimentId={formData.experiment?.id} />
          </div>
        )}
      </div>

      {/* This section is for upload excel sheets for data types */}
      {formData.dataType !== DATA_TYPE.AGC_SHEET &&
        !isGenericFileUploadVisible && (
          <>
            <FileUploadArea
              formData={formData}
              setFormData={setFormData}
              isProjectSelected={isProjectSelected}
              isHotlabSelected={isHotlabSelected}
              isPreclinicSelected={isPreclinicSelected}
              isSpecialisationSelected={isSpecialisationSelected}
              isDataTypeSelected={isDataTypeSelected}
            />
            <UploadedFilesList formData={formData} setFormData={setFormData} />

            <div className="flex justify-between items-center pt-4">
              <Button
                size="lg"
                variant="outline"
                onClick={downloadButtonClickHandler}
                disabled={!canShowDownloadButton || isDownloading}
                type="button"
              >
                <Download className="mr-2 h-4 w-4" />
                {renderDownloadButtonText()}
              </Button>
              <Button
                size="lg"
                onClick={() => handleUpload({ formData, isPdfUpload: false })}
                disabled={!canUploadData || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Data"}
              </Button>
            </div>
          </>
        )}

      {isGenericFileUploadVisible && (
        <>
          <GenericFileUploadArea
            formData={formData}
            setFormData={setFormData}
            isDisabled={isGenericUploadDisabled()}
            {...getGenericFileUploadFileTypeConfig()}
            bottomText={getGenericFileUploadBottomText()}
          />
          <div className="flex items-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={handleGenericFileUpload}
              disabled={
                !canUploadData ||
                (!isHotlabSelected && !isExperimentSelected) ||
                isUploading
              }
              className="ml-auto"
            >
              {isUploading ? "Uploading..." : "Upload Data"}
            </Button>
          </div>
        </>
      )}

      {/* AGC Sheet Upload Area */}

      {isAGCSelected && (
        <>
          <FileUploadArea
            formData={formData}
            setFormData={setFormData}
            isProjectSelected={isProjectSelected}
            isHotlabSelected={isHotlabSelected}
            isPreclinicSelected={isPreclinicSelected}
            isSpecialisationSelected={isSpecialisationSelected}
            isDataTypeSelected={isDataTypeSelected}
            isAgcUploadApplicable={isAGCSelected}
          />
          <div className="flex justify-end items-center pt-4">
            <Button
              size="lg"
              onClick={() => setIsOpenGroupSelectionModalForAGC(true)}
              disabled={isUploading || formData.uploadAGCFile === null}
            >
              Upload AGC Data
            </Button>
          </div>
        </>
      )}

      {isOpenDownloadOrganSheetModal && (
        <DownloadOrganSheetModal
          open={isOpenDownloadOrganSheetModal}
          onOpenChange={setIsOpenDownloadOrganSheetModal}
          experimentId={formData.experiment?.id}
        />
      )}

      {isAGCSelected && isOpenGroupSelectionModalForAGC && (
        <MouseGroupForAgcSelectionModal
          open={isOpenGroupSelectionModalForAGC}
          onOpenChange={setIsOpenGroupSelectionModalForAGC}
          experimentId={formData.experiment?.id}
          onProceed={(selectedGroupCodes) => {
            handleAgcUpload(formData, selectedGroupCodes);
          }}
          isUploading={isUploading}
        />
      )}

      {isOpenHematologyReportModal &&
        formData.experiment?.id &&
        hematologyDataForPreview && (
          <PreviewHematologyReportModal
            experimentId={formData.experiment?.id}
            open={isOpenHematologyReportModal}
            onOpenChange={closeHematologyReportModal}
            hematologyData={hematologyDataForPreview}
            onSaveSuccess={() => setHematologyDataForPreview(undefined)}
            experimentStudyType={formData.studyType as ExperimentStudyType}
          />
        )}

      {isOpenBloodChemistryReportModal &&
        formData.experiment?.id &&
        bloodChemistryDataForPreview && (
          <PreviewBloodChemistryReportModal
            experimentId={formData.experiment?.id}
            open={isOpenBloodChemistryReportModal}
            onOpenChange={closeBloodChemistryReportModal}
            bloodChemistryData={bloodChemistryDataForPreview}
            onSaveSuccess={() => setBloodChemistryDataForPreview(undefined)}
            experimentStudyType={formData.studyType as ExperimentStudyType}
          />
        )}

      {isOpenLinkExperimentModal && (
        <LinkExperimentModal
          open={isOpenLinkExperimentModal}
          onOpenChange={closeLinkExperimentModal}
          extractedExperimentList={extractedExperimentList}
          onSuccess={() => {
            setExtractedExperimentList([]);
            handleUploadFileReset();
            closeLinkExperimentModal();
          }}
          file={formData?.uploadedFile || undefined}
          projectId={formData.project?.id}
        />
      )}
      {nValueSelectModal.isOpen && (
        <NValueSelectionModal
          isOpen={nValueSelectModal.isOpen}
          onClose={nValueSelectModal.closeModal}
          onProceed={(nValue) =>
            handleUpload({ formData, isPdfUpload: true, no_of_replica: nValue })
          }
          isUploading={isUploading}
        />
      )}
    </>
  );
}
