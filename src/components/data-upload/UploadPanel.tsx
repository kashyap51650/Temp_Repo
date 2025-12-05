import { Download } from "lucide-react";
import { useState } from "react";

import { useExperimentDataImport } from "../../hooks";
import { Button } from "../atoms";
import { ExperimentLinkDialog } from "./ExperimentLinkDialog";
import { ExperimentSection } from "./ExperimentSection";
import { FileUploadArea } from "./FileUploadArea";
import { ProjectSection } from "./ProjectSection";
import { SpecializationSection } from "./SpecializationSection";
import { UploadedFilesList } from "./UploadedFilesList";

export default function UploadPanel(props: any) {
  const {
    formData,
    setFormData,
    isCreatingNewProject,
    errors,
    existingProjects,
    existingExperiments,
    specialisationOptions,
    studyTypeOptions,
    handleSubmit,
    onShowCreateProjectModal,
    onShowCreateExperimentModal,
    onProjectChange,
    projectsLoading,
    studyTypesLoading,
    studyTypesError,
    loadStudyTypes,
    clearStudyTypes,
    strainOptions,
    apiDataTypes,
    dataTypesLoading,
    dataTypesError,
    loadDataTypes,
    clearDataTypes,
    downloadSampleFile,
    sampleFileLoading,
  } = props;

  const isProjectSelected = !!formData.project;
  const isSpecialisationSelected = !!formData.specialisation;
  const isHotlabSelected = formData.specialisation?.toLowerCase() === "hotlab";
  const isPreclinicSelected =
    formData.specialisation?.toLowerCase() === "preclinical";
  const isStudyTypeSelected = !!formData.studyType;

  const isExperimentSelected =
    !!formData.experiment || formData.studyType === "Efficacy";
  const isDataTypeSelected = !!formData.dataType;

  const [showImportDialog, setShowImportDialog] = useState<boolean>(false);

  const { uploadFile, isUploading } = useExperimentDataImport({
    onSuccess: () => {
      setFormData((prev: any) => ({
        ...prev,
        uploadedFile: null,
      }));
    },
  });

  const handleSampleFileDownload = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const studyTypeId = props.apiStudyTypes?.find(
      (st: any) =>
        st.study_type_name === formData.studyType ||
        (st.study_type_name === "Bio Distribution" &&
          formData.studyType === "Biodistribution")
    )?.id;

    const dataTypeId = apiDataTypes?.find(
      (dt: any) => dt.data_type_name === formData.dataType
    )?.id;

    if (studyTypeId && dataTypeId) {
      await downloadSampleFile({
        study_type_id: studyTypeId,
        data_type_id: dataTypeId,
      });
    }
  };

  const handleDataUpload = async () => {
    if (!formData.uploadedFile) {
      console.error("No file selected for upload");
      return;
    }

    let experimentId: number | null = null;
    if (formData.experiment?.id) {
      experimentId = parseInt(formData.experiment.id);
    }

    const dataTypeId =
      apiDataTypes?.find((dt: any) => dt.data_type_name === formData.dataType)
        ?.id || null;

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
        projectId={formData.project ? parseInt(formData.project.id) : undefined}
        specialization={formData.specialisation}
        studyTypeId={
          props.apiStudyTypes?.find(
            (st: any) =>
              st.study_type_name === formData.studyType ||
              (st.study_type_name === "Bio Distribution" &&
                formData.studyType === "Biodistribution")
          )?.id
        }
        apiDataTypes={apiDataTypes}
        dataTypesLoading={dataTypesLoading}
        dataTypesError={dataTypesError}
        loadDataTypes={loadDataTypes}
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
          onClick={handleSampleFileDownload}
          disabled={!canShowDownloadButton || sampleFileLoading}
          type="button"
        >
          <Download className="mr-2 h-4 w-4" />
          {sampleFileLoading ? "Downloading..." : "Download Sample File"}
        </Button>

        <Button
          size="lg"
          onClick={handleDataUpload}
          disabled={!canUploadData || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Data"}
        </Button>
      </div>

      <ExperimentLinkDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        existingExperiments={existingExperiments}
        projectId={formData.project?.id || null}
        onSubmit={(
          linkToExisting: boolean,
          experimentId?: string,
          newExperimentName?: string
        ) => {
          if (linkToExisting && experimentId) {
            const selectedExperiment = existingExperiments.find(
              (e: any) => e.id === experimentId
            );
            setFormData((prev: any) => ({
              ...prev,
              experiment: selectedExperiment,
            }));
          } else if (!linkToExisting && newExperimentName?.trim()) {
            setFormData((prev: any) => ({
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
