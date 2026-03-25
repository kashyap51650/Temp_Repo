import { toast } from "sonner";

import { CloseConfirmationModal } from "@/components/project-folders/CloseConfirmationModal";
import { CloseExperimentModal } from "@/components/project-folders/CloseExperimentModal";
import { ProjectFoldersHeader } from "@/components/project-folders/ProjectFoldersHeader";
import { ProjectsView } from "@/components/project-folders/ProjectsView";
import { sheetOptionsMap } from "@/components/project-folders/SheetOptionsMap";
import { usePermissions } from "@/hooks/usePermissions";
import { useProjectFoldersLogic } from "@/hooks/useProjectFolders";
import { PERMISSIONS } from "@/lib/permissions";
import type { ProjectItem } from "@/types/project";

import { ExperimentList } from "./ExperimentList";
import { StudySheetsView } from "./StudySheetsView";
import { StudyTypeSelection } from "./StudyTypeSelection";

export function ProjectFoldersContent() {
  const {
    view,
    currentProject,
    selectedExperiment,
    selectedStudyType,
    selectedProject,
    experimentToClose,
    isCloseModalOpen,
    isCloseExperimentOpen,
    handleProjectClick,
    handleExperimentClick,
    handleStudyTypeClick,
    handleCloseProject,
    confirmCloseProject,
    cancelCloseProject,
    handleCloseExperiment,
    confirmCloseExperiment,
    cancelCloseExperiment,
    goBackToProjects,
    goBackToExperiments,
    goBackToStudyTypes,
  } = useProjectFoldersLogic();

  const { hasPermission } = usePermissions();
  const canViewExperiments = hasPermission(PERMISSIONS.EXPERIMENT.VIEW);

  const handleProjectClickWithPermission = (project: ProjectItem) => {
    if (!canViewExperiments) {
      toast.error("Permission denied", {
        description: "You don't have permission to view experiments",
      });
      return;
    }
    handleProjectClick(project);
  };

  // Study Sheets View
  if (
    view === "study-sheets" &&
    selectedExperiment &&
    selectedStudyType &&
    currentProject
  ) {
    const sheetData = sheetOptionsMap[selectedStudyType.id];
    return (
      <div className="px-6 pb-6 pt-4">
        <ProjectFoldersHeader
          breadcrumbs={[
            {
              label: "Projects",
              clickable: true,
            },
            {
              label: currentProject?.project_name || "",
              clickable: true,
            },
            {
              label:
                sheetData?.title || selectedStudyType.study_type_name || "",
              clickable: true,
            },
            {
              label: selectedExperiment?.experiment_name || "",
              clickable: false,
            },
          ].filter((item) => item.label)}
          onClickHandlers={[
            goBackToProjects,
            goBackToStudyTypes,
            goBackToExperiments,
          ]}
        />
        <StudySheetsView
          selectedStudyType={selectedStudyType}
          goBackToStudyTypes={goBackToStudyTypes}
          sourceExperimentId={selectedExperiment.id}
          projectId={currentProject.id}
          specialization={selectedExperiment.specialization}
        />
      </div>
    );
  }

  // Study Types View
  if (view === "study-types" && currentProject) {
    return (
      <div className="px-6 pb-6 pt-4">
        <ProjectFoldersHeader
          breadcrumbs={[
            {
              label: "Projects",
              clickable: true,
            },
            {
              label: currentProject?.project_name || "",
              clickable: false,
            },
          ].filter((item) => item.label)}
          onClickHandlers={[goBackToProjects]}
        />
        <StudyTypeSelection onSelect={handleStudyTypeClick} />
      </div>
    );
  }

  // Experiments View
  if (view === "experiments" && selectedStudyType && currentProject) {
    return (
      <div className="px-6 pb-6 pt-4">
        <ProjectFoldersHeader
          breadcrumbs={[
            { label: "Projects", clickable: true },
            { label: currentProject?.project_name || "", clickable: true },
            {
              label: selectedStudyType.study_type_name || "",
              clickable: false,
            },
          ].filter((item) => item.label)}
          onClickHandlers={[goBackToProjects, goBackToStudyTypes]}
        />
        <ExperimentList
          onExperimentClick={handleExperimentClick}
          onCloseExperiment={handleCloseExperiment}
          studyTypeId={selectedStudyType.id}
        />
        {experimentToClose && isCloseExperimentOpen && (
          <CloseExperimentModal
            isOpen={isCloseExperimentOpen}
            onClose={cancelCloseExperiment}
            onConfirm={confirmCloseExperiment}
            experiment={experimentToClose}
          />
        )}
      </div>
    );
  }

  // Default Projects View
  return (
    <div className="px-6 pb-6 pt-4">
      <ProjectFoldersHeader
        breadcrumbs={[{ label: "Projects", clickable: false }]}
      />
      <ProjectsView
        onProjectClick={handleProjectClickWithPermission}
        onCloseProject={handleCloseProject}
      />
      {selectedProject && isCloseModalOpen && (
        <CloseConfirmationModal
          project={selectedProject}
          isOpen={isCloseModalOpen}
          onClose={cancelCloseProject}
          onConfirm={confirmCloseProject}
        />
      )}
    </div>
  );
}
