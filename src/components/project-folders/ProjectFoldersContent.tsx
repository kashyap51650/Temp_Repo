import { CloseConfirmationModal } from "@/components/project-folders/CloseConfirmationModal";
import { CloseExperimentModal } from "@/components/project-folders/CloseExperimentModal";
import { ProjectFoldersHeader } from "@/components/project-folders/ProjectFoldersHeader";
import { ProjectsView } from "@/components/project-folders/ProjectsView";
import { sheetOptionsMap } from "@/components/project-folders/SheetOptionsMap";
import { useProjectFoldersLogic } from "@/hooks/useProjectFolders";

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
              label: selectedExperiment?.experiment_name || "",
              clickable: true,
            },
            {
              label:
                sheetData?.title || selectedStudyType.study_type_name || "",
              clickable: false,
            },
          ].filter((item) => item.label)}
          onClickHandlers={[
            goBackToProjects,
            goBackToExperiments,
            goBackToStudyTypes,
          ]}
        />
        <StudySheetsView
          selectedStudyType={selectedStudyType}
          goBackToStudyTypes={goBackToStudyTypes}
        />
      </div>
    );
  }

  // Study Types View
  if (view === "study-types" && selectedExperiment && currentProject) {
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
              label: selectedExperiment?.experiment_name || "",
              clickable: false,
            },
          ].filter((item) => item.label)}
          onClickHandlers={[goBackToProjects, goBackToExperiments]}
        />
        <StudyTypeSelection onSelect={handleStudyTypeClick} />
      </div>
    );
  }

  // Experiments View
  if (view === "experiments") {
    return (
      <div className="px-6 pb-6 pt-4">
        <ProjectFoldersHeader
          breadcrumbs={[
            { label: "Projects", clickable: true },
            { label: currentProject?.project_name || "", clickable: false },
          ].filter((item) => item.label)}
          onClickHandlers={[goBackToProjects]}
        />
        <ExperimentList
          onExperimentClick={handleExperimentClick}
          onCloseExperiment={handleCloseExperiment}
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
        onProjectClick={handleProjectClick}
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
