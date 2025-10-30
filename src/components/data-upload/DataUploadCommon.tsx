import { useState } from "react";

import type { Experiment } from "@/data/experiments";
import {
  cellLineOptions,
  experiments as experimentData,
  getDataTypeOptions,
  isotopeOptions,
  specialisationOptions,
  studyTypeOptions,
} from "@/data/experiments";

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

interface Project {
  id: string;
  name: string;
}

interface DataUploadFormData {
  project: Project | null;
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
  const [pendingProjectChange, setPendingProjectChange] =
    useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([
    { id: "1", name: "Project Alpha" },
    { id: "2", name: "Project Beta" },
  ]);

  const [experiments, setExperiments] = useState<Experiment[]>(experimentData);

  const existingProjects: Project[] = projects;
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

  const handleProjectChange = (newProject: Project | null) => {
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

        specialisation: prev.specialisation,
        studyType: prev.studyType,
        efficacy: prev.efficacy,
        dataType: prev.dataType,
        uploadedFile: null,
      }));
    }
    setShowProjectChangeConfirm(false);
    setPendingProjectChange(null);
  };

  const cancelProjectChange = () => {
    setShowProjectChangeConfirm(false);
    setPendingProjectChange(null);
  };

  const handleCreateProject = async (projectName: string) => {
    const newId = (projects.length + 1).toString();
    const newProject: Project = {
      id: newId,
      name: projectName,
    };

    setProjects((prev) => [...prev, newProject]);

    setFormData((prev) => ({
      ...prev,
      project: newProject,
      newProjectName: "",
    }));

    setErrors((prev) => ({ ...prev, project: "" }));
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
    console.log("submit", formData);
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
              studyTypeOptions={studyTypeOptions}
              getDataTypeOptions={getDataTypeOptions}
              handleSubmit={handleSubmit}
              onShowCreateProjectModal={() => setShowCreateProjectModal(true)}
              onShowCreateExperimentModal={() =>
                setShowCreateExperimentModal(true)
              }
              onProjectChange={handleProjectChange}
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
      />

      {/* the title and other things are given in this modal so that we can reuse this warning popup */}
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
