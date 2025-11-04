import { useState } from "react";

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
    getDataTypeOptions,
    handleSubmit,
    onShowCreateProjectModal,
    onShowCreateExperimentModal,
    onProjectChange,
  } = props;

  const isProjectSelected = !!formData.project;
  const isSpecialisationSelected = !!formData.specialisation;
  const isHotlabSelected = formData.specialisation?.toLowerCase() === "hotlab";
  const isPreclinicSelected =
    formData.specialisation?.toLowerCase() === "preclinic";
  const isStudyTypeSelected = !!formData.studyType;

  console.log("Current specialisation:", formData.specialisation);
  console.log("isPreclinicSelected:", isPreclinicSelected);
  console.log("isHotlabSelected:", isHotlabSelected);
  const isExperimentSelected =
    !!formData.experiment || formData.studyType === "Efficacy";
  const isDataTypeSelected = !!formData.dataType;

  const [showImportDialog, setShowImportDialog] = useState<boolean>(false);

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
        />

        <SpecializationSection
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          specialisationOptions={specialisationOptions}
          studyTypeOptions={studyTypeOptions}
          isProjectSelected={isProjectSelected}
          isPreclinicSelected={isPreclinicSelected}
          isSpecialisationSelected={isSpecialisationSelected}
        />
      </div>

      <ExperimentSection
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        existingExperiments={existingExperiments}
        getDataTypeOptions={getDataTypeOptions}
        onShowCreateExperimentModal={onShowCreateExperimentModal}
        isPreclinicSelected={isPreclinicSelected}
        isStudyTypeSelected={isStudyTypeSelected}
        isExperimentSelected={isExperimentSelected}
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

      <div className="flex justify-end pt-4">
        {formData.uploadedFiles && formData.uploadedFiles.length > 0 ? (
          <Button size="lg" onClick={() => setShowImportDialog(true)}>
            Import Files
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={
              !formData.project ||
              !formData.specialisation ||
              (isHotlabSelected
                ? !(formData.uploadedFiles && formData.uploadedFiles.length > 0)
                : isPreclinicSelected
                  ? !formData.studyType || !formData.dataType
                  : !(
                      formData.uploadedFiles &&
                      formData.uploadedFiles.length > 0
                    ))
            }
          >
            Upload Data
          </Button>
        )}
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
