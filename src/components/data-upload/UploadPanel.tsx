import { Download } from "lucide-react";
import { useEffect, useState } from "react";

import { useAGCExperimentDataImport } from "@/hooks/useAGCExperimentDataImport";
import { usePdfExperimentDataImport } from "@/hooks/usePdfExperimentDataImport";
import type { BloodChemistryReport } from "@/types/bloodChemistry";
import type { HematologyReport } from "@/types/hematology";

import {
  useDownloadSheet,
  useExperimentDataImport,
  useModal,
} from "../../hooks";
import {
  type DataType,
  type ExperimentDropdownItem,
  type Project,
  type StudyType,
} from "../../lib/api";
import {
  DATA_TYPE,
  type ExperimentDataType,
  FILE_SIZE_LIMITS,
  FILE_TYPES,
  SPECIALIZATION,
  STUDY_TYPE,
} from "../../lib/constants";
import { Button } from "../atoms";
import { DownloadOrganSheetModal } from "./DownloadOrganSheetModal";
import { ExperimentSection } from "./ExperimentSection";
import { FileUploadArea } from "./FileUploadArea";
import { GenericFileUploadArea } from "./GenericFileUploadArea";
import { MouseGroupForAgcSelectionModal } from "./MouseGroupForAgcSelectionModal";
import PreviewBloodChemistryReportModal from "./PreviewBloodChemistryReportModal";
import { PreviewHematologyReportModal } from "./PreviewHematologyReportModal";
import { ProjectSection } from "./ProjectSection";
import { SpecializationSection } from "./SpecializationSection";
import { UploadedFilesList } from "./UploadedFilesList";

interface FormData {
  project: Project | null;
  specialisation: string;
  studyType: string;
  experiment: ExperimentDropdownItem | null;
  dataType: string;
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

interface SelectOption {
  value: string;
  label: string;
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
  studyTypes: SelectOption[];
  dataTypes: DataType[];
  specialisationOptions: SelectOption[];
  strainOptions: SelectOption[];
  apiStudyTypes: StudyType[];
}

interface LoadingProps {
  projectsLoading: boolean;
  studyTypesLoading: boolean;
  dataTypesLoading: boolean;
}

interface ErrorProps {
  studyTypesError: string | null;
  dataTypesError: string | null;
}

interface ActionProps {
  onProjectChange: (project: Project | null) => void;
  onShowCreateProjectModal: () => void;
  onShowCreateExperimentModal: () => void;
  loadStudyTypes: () => void;
  clearStudyTypes: () => void;
  clearDataTypes: () => void;
}

interface UploadPanelProps {
  formProps: FormProps;
  apiDataProps: ApiDataProps;
  loadingProps: LoadingProps;
  errorProps: ErrorProps;
  actionProps: ActionProps;
}

const findStudyTypeId = (
  apiStudyTypes: StudyType[],
  studyTypeName: string
): number | undefined => {
  return apiStudyTypes?.find(
    (st: StudyType) =>
      st.study_type_name === studyTypeName ||
      (st.study_type_name === STUDY_TYPE.BIO_DISTRIBUTION &&
        studyTypeName === STUDY_TYPE.BIODISTRIBUTION)
  )?.id;
};

export default function UploadPanel(props: Readonly<UploadPanelProps>) {
  const {
    formProps: { formData, setFormData, errors, isCreatingNewProject },
    apiDataProps: {
      projects: existingProjects,
      studyTypes: studyTypeOptions,
      dataTypes: apiDataTypes,
      specialisationOptions,
      strainOptions,
      apiStudyTypes,
    },
    loadingProps: { projectsLoading, studyTypesLoading, dataTypesLoading },
    errorProps: { studyTypesError, dataTypesError },
    actionProps: {
      onProjectChange,
      onShowCreateProjectModal,
      onShowCreateExperimentModal,
      loadStudyTypes,
      clearStudyTypes,
      clearDataTypes,
    },
  } = props;

  const isProjectSelected = !!formData.project;
  const isSpecialisationSelected = !!formData.specialisation;
  const isHotlabSelected =
    formData.specialisation?.toLowerCase() === SPECIALIZATION.HOTLAB;
  const isPreclinicSelected =
    formData.specialisation?.toLowerCase() === SPECIALIZATION.PRECLINICAL;
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
    formData.studyType === STUDY_TYPE.DOSE_RANGE_FINDING &&
    (formData.dataType === DATA_TYPE.NECROPSY_SHEET ||
      formData.dataType === DATA_TYPE.HEMATOLOGY ||
      formData.dataType === DATA_TYPE.BLOOD_CHEMISTRY);

  const [isOpenDownloadOrganSheetModal, setIsOpenDownloadOrganSheetModal] =
    useState(false);
  const [isOpenGroupSelectionModalForAGC, setIsOpenGroupSelectionModalForAGC] =
    useState(false);

  const [hematologyDataForPreview, setHematologyDataForPreview] = useState<
    HematologyReport | undefined
  >();

  const [bloodChemistryDataForPreview, setBloodChemistryDataForPreview] =
    useState<BloodChemistryReport | undefined>();

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

  const handlePreviewModalOpen = () => {
    if (formData.dataType === DATA_TYPE.HEMATOLOGY) {
      openHematologyReportModal();
    } else if (formData.dataType === DATA_TYPE.BLOOD_CHEMISTRY) {
      openBloodChemistryReportModal();
    }
  };

  useEffect(() => {
    setHematologyDataForPreview(undefined);
    setBloodChemistryDataForPreview(undefined);
  }, [formData.experiment?.id]);

  const handleAgcFileUploadSuccess = () => {
    setIsOpenGroupSelectionModalForAGC(false);
    setFormData((prev: FormData) => ({
      ...prev,
      uploadAGCFile: null,
    }));
  };

  // AGC Sheet Upload Handler
  const { handleUploadAGCSheet, isAGCSheetUploading } =
    useAGCExperimentDataImport({ onSuccess: handleAgcFileUploadSuccess });

  const handleUploadFileReset = () => {
    setFormData((prev: FormData) => ({
      ...prev,
      uploadedFile: null,
    }));
  };

  const { handleUploadPdf, isPdfUploading } = usePdfExperimentDataImport({
    onSuccess: (data) => {
      handleUploadFileReset();
      if (data && formData.dataType === DATA_TYPE.HEMATOLOGY) {
        setHematologyDataForPreview(data.data as HematologyReport);
      } else if (data && formData.dataType === DATA_TYPE.BLOOD_CHEMISTRY) {
        setBloodChemistryDataForPreview(data.data as BloodChemistryReport);
      }
    },
    experimentDataType: formData.dataType as ExperimentDataType,
  });

  const { uploadFile, isUploading } = useExperimentDataImport({
    onSuccess: () => {
      handleUploadFileReset();
    },
  });

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

  const handleDataUpload = async () => {
    if (!formData.uploadedFile) {
      console.error("No file selected for upload");
      return;
    }

    let experimentId: number | null = null;
    if (formData.experiment?.id) {
      experimentId = Number.parseInt(formData.experiment.id.toString());
    }

    const dataTypeId =
      apiDataTypes?.find(
        (dt: DataType) => dt.data_type_name === formData.dataType
      )?.id || null;

    await uploadFile({
      experiment_id: experimentId,
      data_type_id: dataTypeId,
      file: formData.uploadedFile,
    });
  };

  const canShowDownloadButton =
    isPreclinicSelected && isStudyTypeSelected && isDataTypeSelected;

  const hasRequiredFieldsForUpload = () => {
    if (isHotlabSelected) {
      return true;
    }

    if (isPreclinicSelected) {
      return !!(formData.studyType && formData.dataType);
    }

    return true;
  };

  const canUploadData =
    formData.project &&
    formData.specialisation &&
    formData.uploadedFile &&
    hasRequiredFieldsForUpload();

  const isAGCSelected =
    isNecropsyData || formData.dataType === DATA_TYPE.AGC_SHEET;

  const handleAgcFileUpload = async (selectedCodes: string[]) => {
    if (isAGCSelected && formData.uploadAGCFile && formData.experiment?.id) {
      handleUploadAGCSheet({
        experiment_id: formData.experiment?.id,
        group_ids: selectedCodes,
        file: formData.uploadAGCFile,
      });
    }
  };

  const handleUploadPdfClick = async () => {
    if (!formData.uploadedFile) {
      console.error("No file selected for upload");
      return;
    }

    const experimentId = formData.experiment?.id;

    if (!experimentId) {
      console.error("No experiment selected");
      return;
    }

    if (isPdfUpload) {
      handleUploadPdf({
        experiment_id: experimentId,
        file: formData.uploadedFile,
      });
    }
  };

  const renderDownloadButtonText = () => {
    if (isNecropsyData) {
      return "Download Organ Sheet";
    }

    if (isDownloading) {
      return "Downloading...";
    }
    return "Download Sample File";
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-0 text-foreground">
        Dataset Upload
      </h2>
      <p className="text-sm text-muted-foreground mt-1">
        Follow the hierarchy to upload your research data
      </p>

      <div
        className={`grid grid-cols-1 gap-4 ${isPreclinicSelected ? "md:grid-cols-3" : "md:grid-cols-2"}`}
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

        <SpecializationSection
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          specialisationOptions={specialisationOptions}
          studyTypeOptions={studyTypeOptions}
          strainOptions={strainOptions}
          isProjectSelected={isProjectSelected}
          isPreclinicSelected={isPreclinicSelected}
          isSpecialisationSelected={isSpecialisationSelected}
          studyTypesLoading={studyTypesLoading}
          studyTypesError={studyTypesError}
          loadStudyTypes={loadStudyTypes}
          clearStudyTypes={clearStudyTypes}
        />
      </div>

      <ExperimentSection
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        onShowCreateExperimentModal={onShowCreateExperimentModal}
        isPreclinicSelected={isPreclinicSelected}
        isStudyTypeSelected={isStudyTypeSelected}
        isExperimentSelected={isExperimentSelected}
        projectId={formData.project?.id}
        specialization={formData.specialisation}
        studyTypeId={findStudyTypeId(apiStudyTypes, formData.studyType)}
        apiDataTypes={apiDataTypes}
        dataTypesLoading={dataTypesLoading}
        dataTypesError={dataTypesError}
        clearDataTypes={clearDataTypes}
      />

      {formData.dataType !== DATA_TYPE.AGC_SHEET && !isPdfUpload && (
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
              onClick={handleDataUpload}
              disabled={!canUploadData || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Data"}
            </Button>
          </div>
        </>
      )}

      {isPdfUpload && (
        <>
          <GenericFileUploadArea
            formData={formData}
            setFormData={setFormData}
            isProjectSelected={isProjectSelected}
            isHotlabSelected={isHotlabSelected}
            isPreclinicSelected={isPreclinicSelected}
            isSpecialisationSelected={isSpecialisationSelected}
            isDataTypeSelected={isDataTypeSelected}
            fileType={FILE_TYPES.PDF}
            maxFileSize={FILE_SIZE_LIMITS.LARGE_FILE}
          />
          <div className="flex items-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={handleUploadPdfClick}
              disabled={
                !canUploadData || !isExperimentSelected || isPdfUploading
              }
              className="ml-auto"
            >
              {isPdfUploading ? "Uploading..." : "Upload Data"}
            </Button>

            {(formData.dataType === DATA_TYPE.HEMATOLOGY ||
              formData.dataType === DATA_TYPE.BLOOD_CHEMISTRY) && (
              <Button
                size="lg"
                onClick={handlePreviewModalOpen}
                disabled={
                  isPdfUploading ||
                  (!hematologyDataForPreview && !bloodChemistryDataForPreview)
                }
              >
                Preview
              </Button>
            )}
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
              disabled={isAGCSheetUploading || formData.uploadAGCFile === null}
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
          onProceed={handleAgcFileUpload}
          isUploading={isAGCSheetUploading}
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
          />
        )}
    </>
  );
}
