import { useState } from "react";

import type { Experiment } from "@/data/experiments";
import {
  cellLineOptions,
  experiments as experimentData,
  isotopeOptions,
  specialisationOptions,
  strainOptions,
  studyTypeOptions,
} from "@/data/experiments";
import {
  useDataTypes,
  useProjects,
  useSampleFileDownload,
  useStudyTypes,
} from "@/hooks";

import { Card } from "../atoms";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../molecules/Tabs/Tabs";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { CreateExperimentModal } from "./CreateExperimentModal";
import { CreateProjectModal } from "./CreateProjectModal";
import UploadedList from "./UploadedList";
import UploadPanel from "./UploadPanel";

interface DataUploadFormData {
  project: { id: string; name: string } | null; // Use the format expected by ProjectSelect
  newProjectName: string;
  specialisation: string;
  studyType: string;
  efficacy: string;
  experiment: Experiment | null;
  newExperimentName: string;
  selectedCellLines: string[];
  selectedIsotope: string;
  dataType: string;
  uploadedFile: File | null;
}

export default function DataUploadCommon() {
  const {
    projects: apiProjects,
    loading: projectsLoading,
    searchProjects,
    createProject: apiCreateProject,
  } = useProjects();

  const {
    studyTypes: apiStudyTypes,
    loading: studyTypesLoading,
    error: studyTypesError,
    loadStudyTypes,
    clearStudyTypes,
  } = useStudyTypes();

  const {
    dataTypes: apiDataTypes,
    loading: dataTypesLoading,
    error: dataTypesError,
    loadDataTypes,
    clearDataTypes,
  } = useDataTypes();

  const { downloadSampleFile, loading: sampleFileLoading } =
    useSampleFileDownload();

  const existingProjects = apiProjects.map((project) => ({
    id: project.id.toString(),
    name: project.project_name,
  }));

  const dynamicStudyTypeOptions =
    apiStudyTypes.length > 0
      ? apiStudyTypes.map((studyType) => {
          let normalizedName = studyType.study_type_name;
          if (normalizedName === "Bio Distribution") {
            normalizedName = "Biodistribution";
          }

          return {
            value: normalizedName,
            label: studyType.study_type_name, // Keep original label for display
            code: studyType.study_type_code,
          };
        })
      : studyTypeOptions;

  const [formData, setFormData] = useState<DataUploadFormData>({
    project: null,
    newProjectName: "",
    specialisation: "",
    studyType: "",
    efficacy: "",
    experiment: null,
    newExperimentName: "",
    selectedCellLines: [],
    selectedIsotope: "",
    dataType: "",
    uploadedFile: null,
  });

  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);
  const [isCreatingNewExperiment, setIsCreatingNewExperiment] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showCreateExperimentModal, setShowCreateExperimentModal] =
    useState(false);
  const [showProjectChangeConfirm, setShowProjectChangeConfirm] =
    useState(false);
  const [pendingProjectChange, setPendingProjectChange] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [experiments, setExperiments] = useState<Experiment[]>(experimentData);

  const existingExperiments: Experiment[] = experiments;

  const hasFormData = () => {
    return !!(
      formData.specialisation ||
      formData.studyType ||
      formData.efficacy ||
      formData.experiment ||
      formData.dataType ||
      formData.uploadedFile
    );
  };

  const handleProjectChange = (
    newProject: { id: string; name: string } | null
  ) => {
    if (
      formData.project &&
      newProject &&
      formData.project.id !== newProject.id &&
      hasFormData()
    ) {
      setPendingProjectChange(newProject);
      setShowProjectChangeConfirm(true);
    } else {
      setFormData((prev) => ({
        ...prev,
        project: newProject,
      }));
    }
  };

  const confirmProjectChange = () => {
    if (pendingProjectChange) {
      setFormData((prev) => ({
        ...prev,
        project: pendingProjectChange,

        experiment: null,
        newExperimentName: "",
        selectedCellLines: [],
        selectedIsotope: "",
        uploadedFile: null,
        specialisation: prev.specialisation,
        studyType: prev.studyType,
        efficacy: prev.efficacy,
        dataType: prev.dataType,
      }));

      refreshAPIsAfterProjectChange();
    }
    setShowProjectChangeConfirm(false);
    setPendingProjectChange(null);
  };

  const refreshAPIsAfterProjectChange = () => {
    if (
      formData.specialisation &&
      formData.specialisation.toLowerCase() === "preclinical"
    ) {
      loadStudyTypes();
    }

    if (formData.studyType && formData.specialisation && pendingProjectChange) {
      const event = new CustomEvent("projectChanged", {
        detail: {
          newProjectId: parseInt(pendingProjectChange.id),
          specialization: formData.specialisation,
          studyType: formData.studyType,
        },
      });
      window.dispatchEvent(event);
    }
  };

  const cancelProjectChange = () => {
    setShowProjectChangeConfirm(false);
    setPendingProjectChange(null);
  };

  const handleCreateProject = async (
    projectName: string,
    description: string
  ) => {
    try {
      const newProject = await apiCreateProject(projectName, description);
      if (newProject) {
        const convertedProject = {
          id: newProject.id.toString(),
          name: newProject.project_name,
        };

        setFormData((prev) => ({
          ...prev,
          project: convertedProject,
          newProjectName: "",
        }));

        setErrors((prev) => ({ ...prev, project: "" }));
      }
    } catch (error) {
      console.error("Failed to create project:", error);
      setErrors((prev) => ({ ...prev, project: "Failed to create project" }));
    }
  };

  const handleCreateExperiment = async (experimentData: {
    name: string;
    isotope: string;
    cellLines: string[];
  }) => {
    if (!formData.project) return;

    const newId = (experiments.length + 1).toString();
    const newExperiment: Experiment = {
      id: newId,
      name: experimentData.name,
      cellLines: experimentData.cellLines,
      isotope: experimentData.isotope,
      projectId: formData.project.id,
      studyType: formData.studyType || "Biodistribution",
    };

    setExperiments((prev) => [...prev, newExperiment]);

    setFormData((prev) => ({
      ...prev,
      experiment: newExperiment,
      newExperimentName: "",
      selectedCellLines: experimentData.cellLines,
      selectedIsotope: experimentData.isotope,
    }));

    setErrors((prev) => ({ ...prev, experiment: "" }));
  };

  const handleSubmit = () => {
    if (!formData.project && !formData.newProjectName) {
      setErrors((p) => ({ ...p, project: "Project required" }));
      return;
    }
  };

  return (
    <>
      <Card className="p-6 w-full mx-auto shadow-none">
        <Tabs defaultValue="upload-data" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="upload-data">Upload Data</TabsTrigger>
            <TabsTrigger value="uploaded-data">Uploaded Data</TabsTrigger>
          </TabsList>

          <TabsContent value="upload-data" className="space-y-6 mt-6">
            <UploadPanel
              formData={formData}
              setFormData={setFormData}
              isCreatingNewProject={isCreatingNewProject}
              setIsCreatingNewProject={setIsCreatingNewProject}
              isCreatingNewExperiment={isCreatingNewExperiment}
              setIsCreatingNewExperiment={setIsCreatingNewExperiment}
              errors={errors}
              existingProjects={existingProjects}
              existingExperiments={existingExperiments}
              specialisationOptions={specialisationOptions}
              cellLineOptions={cellLineOptions}
              isotopeOptions={isotopeOptions}
              strainOptions={strainOptions}
              studyTypeOptions={dynamicStudyTypeOptions}
              handleSubmit={handleSubmit}
              onShowCreateProjectModal={() => setShowCreateProjectModal(true)}
              onShowCreateExperimentModal={() =>
                setShowCreateExperimentModal(true)
              }
              onProjectChange={handleProjectChange}
              projectsLoading={projectsLoading}
              searchProjects={searchProjects}
              studyTypesLoading={studyTypesLoading}
              studyTypesError={studyTypesError}
              loadStudyTypes={loadStudyTypes}
              clearStudyTypes={clearStudyTypes}
              apiStudyTypes={apiStudyTypes}
              apiDataTypes={apiDataTypes}
              dataTypesLoading={dataTypesLoading}
              dataTypesError={dataTypesError}
              loadDataTypes={loadDataTypes}
              clearDataTypes={clearDataTypes}
              downloadSampleFile={downloadSampleFile}
              sampleFileLoading={sampleFileLoading}
            />
          </TabsContent>

          <TabsContent value="uploaded-data" className="space-y-6">
            <UploadedList />
          </TabsContent>
        </Tabs>
      </Card>

      <CreateProjectModal
        isOpen={showCreateProjectModal}
        onClose={() => setShowCreateProjectModal(false)}
        onCreateProject={handleCreateProject}
      />

      <CreateExperimentModal
        isOpen={showCreateExperimentModal}
        onClose={() => setShowCreateExperimentModal(false)}
        onCreateExperiment={handleCreateExperiment}
        isotopeOptions={isotopeOptions}
        cellLineOptions={cellLineOptions}
        studyType={formData.studyType}
        projectId={formData.project ? parseInt(formData.project.id) : undefined}
        specialization={formData.specialisation}
        studyTypeId={
          apiStudyTypes.find(
            (st) =>
              st.study_type_name === formData.studyType ||
              (st.study_type_name === "Bio Distribution" &&
                formData.studyType === "Biodistribution")
          )?.id
        }
      />

      <ConfirmationDialog
        isOpen={showProjectChangeConfirm}
        onConfirm={confirmProjectChange}
        onCancel={cancelProjectChange}
        title="Change Project?"
        message="Changing the project will reset your previous selections. You can keep general settings like specialisation and study type, but experiment-specific data will be cleared. Do you want to continue?"
        confirmText="Change Project"
        cancelText="Cancel"
        variant="warning"
      />
    </>
  );
}
