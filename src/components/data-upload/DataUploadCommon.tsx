import { useMemo, useState } from "react";

import { useAppDispatch } from "@/app/store/hooks";
import { projectChanged } from "@/app/store/slices/experimentSlice";
import type { Experiment } from "@/data/experiments";
import {
  cellLineOptions,
  experiments as experimentData,
  isotopeOptions,
  specialisationOptions,
  strainOptions,
  studyTypeOptions,
} from "@/data/experiments";
import { useDataTypes, useProjects, useStudyTypes } from "@/hooks";
import type { ExperimentDropdownItem, Project } from "@/lib/api";

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
  project: Project | null;
  specialisation: string;
  studyType: string;
  experiment: ExperimentDropdownItem | null;
  dataType: string;
  uploadedFile: File | null;
  newExperimentName?: string;
  uploadAGCFile?: File | null;
}

export default function DataUploadCommon() {
  const {
    projects: apiProjects,
    loading: projectsLoading,
    createProject: apiCreateProject,
  } = useProjects();

  const [formData, setFormData] = useState<DataUploadFormData>({
    project: null,
    specialisation: "",
    studyType: "",
    experiment: null,
    dataType: "",
    uploadedFile: null,
    uploadAGCFile: null,
  });

  const isStudyTypesEnabled = useMemo(() => {
    return formData.specialisation?.toLowerCase() === "preclinical";
  }, [formData.specialisation]);

  const {
    studyTypes: apiStudyTypes,
    loading: studyTypesLoading,
    error: studyTypesError,
    loadStudyTypes,
    clearStudyTypes,
  } = useStudyTypes({
    enabled: isStudyTypesEnabled,
  });

  const [isCreatingNewProject] = useState(false);
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

  const dispatch = useAppDispatch();

  const hasFormData = () => {
    return !!(
      formData.specialisation ||
      formData.studyType ||
      formData.experiment ||
      formData.dataType ||
      formData.uploadedFile
    );
  };

  const handleProjectChange = (project: Project | null) => {
    const convertedProject = project
      ? {
          id: project.id.toString(),
          name: project.project_name,
        }
      : null;

    if (
      formData.project &&
      convertedProject &&
      formData.project.id.toString() !== convertedProject.id &&
      hasFormData()
    ) {
      setPendingProjectChange(convertedProject);
      setShowProjectChangeConfirm(true);
    } else {
      setFormData((prev) => ({
        ...prev,
        project,
      }));
    }
  };

  const confirmProjectChange = () => {
    if (pendingProjectChange) {
      const actualProject = apiProjects.find(
        (p) => p.id.toString() === pendingProjectChange.id
      );

      setFormData((prev) => ({
        ...prev,
        project: actualProject || null,
        experiment: null,
        newExperimentName: "",
        specialisation: prev.specialisation,
        studyType: prev.studyType,
        dataType: prev.dataType,
        uploadedFile: null,
      }));

      refreshAPIsAfterProjectChange();
    }
    setShowProjectChangeConfirm(false);
    setPendingProjectChange(null);
  };

  const refreshAPIsAfterProjectChange = () => {
    if (formData.studyType && formData.specialisation && pendingProjectChange) {
      dispatch(
        projectChanged({
          newProjectId: parseInt(pendingProjectChange.id),
          specialization: formData.specialisation,
          studyType: formData.studyType,
        })
      );
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
        setFormData((prev) => ({
          ...prev,
          project: newProject,
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

    if (formData.project.id && formData.specialisation && formData.studyType) {
      return;
    }

    const newId = experiments.length + 1;
    const newExperiment: Experiment = {
      id: newId.toString(),
      name: experimentData.name,
      cellLines: experimentData.cellLines,
      isotope: experimentData.isotope,
      projectId: formData.project.id.toString(),
      studyType: formData.studyType || "Biodistribution",
    };

    setExperiments((prev) => [...prev, newExperiment]);

    const formattedExperiment = {
      id: newId,
      experiment_name: experimentData.name,
    };

    setFormData((prev) => ({
      ...prev,
      experiment: formattedExperiment,
    }));

    setErrors((prev) => ({ ...prev, experiment: "" }));
  };

  const handleSubmit = () => {
    if (!formData.project) {
      setErrors((p) => ({ ...p, project: "Project required" }));
      return;
    }
  };

  const existingProjectsForSelect = useMemo(() => {
    return apiProjects.map((project) => ({
      id: project.id.toString(),
      name: project.project_name,
    }));
  }, [apiProjects]);

  const currentStudyTypeId = useMemo(() => {
    return apiStudyTypes.find(
      (st) =>
        st.study_type_name === formData.studyType ||
        (st.study_type_name === "Bio Distribution" &&
          formData.studyType === "Biodistribution")
    )?.id;
  }, [apiStudyTypes, formData.studyType]);

  const isDataTypesEnabled = useMemo(() => {
    return !!currentStudyTypeId && !!formData.studyType;
  }, [currentStudyTypeId, formData.studyType]);

  const {
    dataTypes: apiDataTypes,
    loading: dataTypesLoading,
    error: dataTypesError,
    clearDataTypes,
  } = useDataTypes({
    studyTypeId: currentStudyTypeId,
    enabled: isDataTypesEnabled,
  });

  const dynamicStudyTypeOptions = useMemo(() => {
    return apiStudyTypes.length > 0
      ? apiStudyTypes.map((studyType) => {
          let normalizedName = studyType.study_type_name;
          if (normalizedName === "Bio Distribution") {
            normalizedName = "Biodistribution";
          }

          return {
            value: normalizedName,
            label: studyType.study_type_name,
            code: studyType.study_type_code,
          };
        })
      : studyTypeOptions;
  }, [apiStudyTypes]);

  const formProps = {
    formData,
    setFormData,
    errors,
    handleSubmit,
    isCreatingNewProject,
  };

  const apiDataProps = {
    projects: existingProjectsForSelect,
    studyTypes: dynamicStudyTypeOptions,
    dataTypes: apiDataTypes,
    specialisationOptions,
    strainOptions,
    apiStudyTypes,
  };

  const loadingProps = {
    projectsLoading,
    studyTypesLoading,
    dataTypesLoading,
  };

  const errorProps = {
    studyTypesError,
    dataTypesError,
  };

  const actionProps = {
    onProjectChange: handleProjectChange,
    onShowCreateProjectModal: () => setShowCreateProjectModal(true),
    onShowCreateExperimentModal: () => setShowCreateExperimentModal(true),
    loadStudyTypes,
    clearStudyTypes,
    clearDataTypes,
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
              formProps={formProps}
              apiDataProps={apiDataProps}
              loadingProps={loadingProps}
              errorProps={errorProps}
              actionProps={actionProps}
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
        projectId={formData.project?.id}
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
