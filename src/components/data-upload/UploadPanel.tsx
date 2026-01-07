import { Download } from "lucide-react";
import { useState } from "react";

import { useAGCExperimentDataImport } from "@/hooks/useAGCExperimentDataImport";

import { useDownloadSheet, useExperimentDataImport } from "../../hooks";
import {
  type DataType,
  type ExperimentDropdownItem,
  type Project,
  type StudyType,
} from "../../lib/api";
import { SPECIALIZATION, STUDY_TYPE } from "../../lib/constants";
import { Button } from "../atoms";
import { DownloadOrganSheetModal } from "./DownloadOrganSheetModal";
import { ExperimentLinkDialog } from "./ExperimentLinkDialog";
import { ExperimentSection } from "./ExperimentSection";
import { FileUploadArea } from "./FileUploadArea";
import { MouseGroupForAgcSelectionModal } from "./MouseGroupForAgcSelectionModal";
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
  handleSubmit: () => void;
  isCreatingNewProject: boolean;
}

interface ApiDataProps {
  projects: Array<{ id: string; name: string }>;
  experiments: ExperimentDropdownItem[];
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
    formProps: {
      formData,
      setFormData,
      errors,
      handleSubmit,
      isCreatingNewProject,
    },
    apiDataProps: {
      projects: existingProjects,
      experiments: existingExperiments,
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
    (formData.studyType === "Biodistribution" ||
      formData.studyType === "Model Study") &&
    formData.specialisation === "Preclinical" &&
    formData.dataType === "Organ Weight Sheet";

  const [showImportDialog, setShowImportDialog] = useState<boolean>(false);

  const [isOpenDownloadOrganSheetModal, setIsOpenDownloadOrganSheetModal] =
    useState(false);
  const [isOpenGroupSelectionModalForAGC, setIsOpenGroupSelectionModalForAGC] =
    useState(false);

  const handleAgcFileUploadSuccess = () => {
    setIsOpenGroupSelectionModalForAGC(false);
    setFormData((prev: FormData) => ({
      ...prev,
      uploadAGCFile: null,
    }));
  };

  const { handleUploadAGCSheet, isAGCSheetUploading } =
    useAGCExperimentDataImport({ onSuccess: handleAgcFileUploadSuccess });

  const { uploadFile, isUploading } = useExperimentDataImport({
    onSuccess: () => {
      setFormData((prev: FormData) => ({
        ...prev,
        uploadedFile: null,
      }));
    },
  });

  const { downloadSheet, isDownloading } = useDownloadSheet();

  const downloadButtonClickHandler = () => {
    if (isNecropsyData) {
      setIsOpenDownloadOrganSheetModal(true);
      return;
    }

    if (
      formData.experiment?.id &&
      (formData.dataType === "Weight Sheet" ||
        formData.dataType === "Callipering Sheet")
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
      experimentId = parseInt(formData.experiment.id.toString());
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

  const canUploadData =
    formData.project &&
    formData.specialisation &&
    formData.uploadedFile &&
    (isHotlabSelected
      ? true
      : isPreclinicSelected
        ? formData.studyType && formData.dataType
        : true);

  const handleAgcFileUpload = async (selectedCodes: string[]) => {
    if (isNecropsyData && formData.uploadAGCFile && formData.experiment?.id) {
      handleUploadAGCSheet({
        experiment_id: formData.experiment?.id,
        group_ids: selectedCodes,
        file: formData.uploadAGCFile,
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
        existingExperiments={existingExperiments}
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

      {/* AGC Sheet Upload Area */}

      {isNecropsyData && (
        <>
          <FileUploadArea
            formData={formData}
            setFormData={setFormData}
            isProjectSelected={isProjectSelected}
            isHotlabSelected={isHotlabSelected}
            isPreclinicSelected={isPreclinicSelected}
            isSpecialisationSelected={isSpecialisationSelected}
            isDataTypeSelected={isDataTypeSelected}
            isAgcUploadApplicable={isNecropsyData}
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

      {isNecropsyData && isOpenGroupSelectionModalForAGC && (
        <MouseGroupForAgcSelectionModal
          open={isOpenGroupSelectionModalForAGC}
          onOpenChange={setIsOpenGroupSelectionModalForAGC}
          experimentId={formData.experiment?.id}
          onProceed={handleAgcFileUpload}
          isUploading={isAGCSheetUploading}
        />
      )}

      <ExperimentLinkDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        existingExperiments={existingExperiments}
        projectId={formData.project?.id.toString() || null}
        onSubmit={(
          linkToExisting: boolean,
          experimentId?: string,
          newExperimentName?: string
        ) => {
          if (linkToExisting && experimentId) {
            const selectedExperiment = existingExperiments.find(
              (e: ExperimentDropdownItem) => e.id.toString() === experimentId
            );
            setFormData((prev: FormData) => ({
              ...prev,
              experiment: selectedExperiment || null,
            }));
          } else if (!linkToExisting && newExperimentName?.trim()) {
            setFormData((prev: FormData) => ({
              ...prev,
              newExperimentName: newExperimentName.trim(),
            }));
          }
          setShowImportDialog(false);
          handleSubmit();
        }}
      />
    </>
  );
}
