import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import type { ExperimentDropdownItem, Project, StudyType } from "@/api";
import { useAppDispatch } from "@/app/store/hooks";
import { projectChanged } from "@/app/store/slices/experimentSlice";
import type { Experiment } from "@/data/experiments";
import { experiments as experimentData } from "@/data/experiments";
import { useModal, useProjects } from "@/hooks";
import { generateQueryKey } from "@/lib";
import { STUDY_TYPE, STUDY_TYPE_CODE } from "@/lib/constants";

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
import { MouseGroupsOrderModal } from "./MouseGroupsOrderModal";
import UploadedList from "./UploadedList";
import UploadPanel from "./UploadPanel";

interface DataUploadFormData {
  project: Project | null;
  specialisation: string;
  studyType: string;
  experiment: ExperimentDropdownItem | null;
  dataType: string;
  dataTypeId: number | null;
  uploadedFile: File | null;
  newExperimentName?: string;
  uploadAGCFile?: File | null;
}

export default function DataUploadCommon() {
  const [createdExperimentId, setCreatedExperimentId] = useState<
    number | undefined
  >(undefined);

  const createExperimentModal = useModal();
  const mouseGroupModal = useModal();

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
    dataTypeId: null,
    uploadedFile: null,
    uploadAGCFile: null,
  });

  const [activeTab, setActiveTab] = useState<string>("upload-data");

  const queryClient = useQueryClient();

  const studyTypes =
    queryClient.getQueryData<StudyType[]>(
      generateQueryKey("study-types", formData.specialisation, "data_upload")
    ) ?? [];

  const [isCreatingNewProject] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showProjectChangeConfirm, setShowProjectChangeConfirm] =
    useState(false);
  const [pendingProjectChange, setPendingProjectChange] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [experiments, setExperiments] = useState<Experiment[]>(experimentData);

  const dispatch = useAppDispatch();

  const selectedStudyType = useMemo(
    () =>
      studyTypes?.find(
        (studyType) => studyType.study_type_name === formData.studyType
      )?.study_type_code || "",
    [studyTypes, formData.studyType]
  );

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
          newProjectId: Number.parseInt(pendingProjectChange.id),
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
    } catch {
      setErrors((prev) => ({ ...prev, project: "Failed to create project" }));
    }
  };

  const handleCreateExperiment = async (experimentData: {
    id?: number;
    name: string;
    isotope: string;
    cellLines: string[];
  }) => {
    if (!formData.project) return;

    setCreatedExperimentId(experimentData?.id);
    if (
      selectedStudyType === STUDY_TYPE_CODE.MODEL_STUDY &&
      experimentData?.id
    ) {
      mouseGroupModal.openModal();
    }
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
      studyType: formData.studyType ?? STUDY_TYPE.BIO_DISTRIBUTION,
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

  const existingProjectsForSelect = useMemo(() => {
    return apiProjects.map((project) => ({
      id: project.id.toString(),
      name: project.project_name,
    }));
  }, [apiProjects]);

  const formProps = {
    formData,
    setFormData,
    errors,
    isCreatingNewProject,
  };

  const apiDataProps = {
    projects: existingProjectsForSelect,
  };

  const loadingProps = {
    projectsLoading,
  };

  const actionProps = {
    onProjectChange: handleProjectChange,
    onShowCreateProjectModal: () => setShowCreateProjectModal(true),
    onShowCreateExperimentModal: () => createExperimentModal.openModal(),
  };

  return (
    <>
      <Card className="p-6 w-full mx-auto shadow-none">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="upload-data">Upload Data</TabsTrigger>

            <TabsTrigger value="uploaded-data">Uploaded Data</TabsTrigger>
          </TabsList>

          <TabsContent value="upload-data" className="space-y-6 mt-6">
            <UploadPanel
              formProps={formProps}
              apiDataProps={apiDataProps}
              loadingProps={loadingProps}
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

      {studyTypes && createExperimentModal.isOpen && (
        <CreateExperimentModal
          isOpen={createExperimentModal.isOpen}
          onClose={() => createExperimentModal.closeModal()}
          onCreateExperiment={handleCreateExperiment}
          studyType={selectedStudyType}
          projectId={formData.project?.id}
          specialization={formData.specialisation}
          studyTypeId={
            studyTypes?.find((st) => st.study_type_name === formData.studyType)
              ?.id
          }
        />
      )}

      <MouseGroupsOrderModal
        experimentId={createdExperimentId}
        open={mouseGroupModal.isOpen}
        onClose={() => mouseGroupModal.closeModal()}
        onSuccess={() => {
          mouseGroupModal.closeModal();
        }}
        onGroupingSaved={() => {
          setActiveTab("upload-data");
        }}
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
