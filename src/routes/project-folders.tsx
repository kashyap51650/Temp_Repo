import { createFileRoute, Outlet } from "@tanstack/react-router";
import { FolderOpen, XCircle } from "lucide-react";
import { useState } from "react";

import { Button, Input } from "@/components/atoms";
import {
  experimentData,
  type ExperimentRow,
  projectData,
  type ProjectRow,
  type StudyType,
  studyTypes,
} from "@/components/organisms/DataTable/tableData";
import { CloseConfirmationModal } from "@/components/project-folders/CloseConfirmationModal";
import { CloseExperimentModal } from "@/components/project-folders/CloseExperimentModal";
import { ExperimentList } from "@/components/project-folders/ExperimentList";
import { ProjectFoldersHeader } from "@/components/project-folders/ProjectFoldersHeader";
import { sheetOptionsMap } from "@/components/project-folders/SheetOptionsMap";
import { StudySheetsView } from "@/components/project-folders/StudySheetsView";
import { StudyTypeSelection } from "@/components/project-folders/StudyTypeSelection";

export const Route = createFileRoute("/project-folders")({
  component: ProjectFoldersComponent,
});

function ProjectFoldersComponent() {
  const [projects, setProjects] = useState<ProjectRow[]>(projectData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectRow | null>(
    null
  );

  // Experiment state
  const [currentProject, setCurrentProject] = useState<ProjectRow | null>(null);
  const [view, setView] = useState<
    "projects" | "experiments" | "study-types" | "study-sheets"
  >("projects");
  const [selectedExperiment, setSelectedExperiment] =
    useState<ExperimentRow | null>(null);
  const [selectedStudyType, setSelectedStudyType] = useState<StudyType | null>(
    null
  );
  const [experimentSearchQuery, setExperimentSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Debug logging
  console.log("🏠 ProjectFoldersComponent loaded:", {
    projectsCount: projects.length,
    projects: projects,
    view: view,
    currentProject: currentProject,
  });
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isCloseExperimentOpen, setIsCloseExperimentOpen] = useState(false);
  const [experimentToClose, setExperimentToClose] =
    useState<ExperimentRow | null>(null);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCloseProject = (project: ProjectRow) => {
    setSelectedProject(project);
    setIsCloseModalOpen(true);
  };

  const confirmCloseProject = () => {
    if (selectedProject) {
      setProjects(projects.filter((p) => p.id !== selectedProject.id));
      setIsCloseModalOpen(false);
      setSelectedProject(null);
    }
  };

  // Handlers for experiment navigation
  const handleProjectClick = (project: ProjectRow) => {
    setCurrentProject(project);
    setView("experiments");
  };

  const handleExperimentClick = (experiment: ExperimentRow) => {
    setSelectedExperiment(experiment);
    setView("study-types");
  };

  const handleStudyTypeClick = (studyType: StudyType) => {
    setSelectedStudyType(studyType);
    setView("study-sheets");
  };

  const goBackToProjects = () => {
    setView("projects");
    setCurrentProject(null);
    setSelectedExperiment(null);
    setSelectedStudyType(null);
  };

  const goBackToExperiments = () => {
    setView("experiments");
    setSelectedExperiment(null);
    setSelectedStudyType(null);
  };

  const goBackToStudyTypes = () => {
    setView("study-types");
    setSelectedStudyType(null);
  };

  const currentExperiments = currentProject
    ? experimentData.filter((exp) => exp.projectId === currentProject.id)
    : [];

  if (
    view === "study-sheets" &&
    selectedExperiment &&
    selectedStudyType &&
    currentProject
  ) {
    // Sheet options mapping imported from separate file
    const studyTypeId = selectedStudyType.id;
    const sheetData = sheetOptionsMap[studyTypeId];
    return (
      <div className="px-6 py-6">
        <ProjectFoldersHeader
          breadcrumbs={[
            { label: "Projects", clickable: true },
            { label: currentProject?.name || "", clickable: true },
            { label: selectedExperiment?.name || "", clickable: true },
            {
              label: sheetData?.title || selectedStudyType.name,
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
          sheetData={sheetData}
          selectedStudyType={selectedStudyType}
          goBackToStudyTypes={goBackToStudyTypes}
        />
      </div>
    );
  }

  // Study Types View
  if (view === "study-types" && selectedExperiment && currentProject) {
    return (
      <div className="px-6 py-6">
        {/* Header */}
        <ProjectFoldersHeader
          breadcrumbs={[
            { label: "Projects", clickable: true },
            { label: currentProject?.name || "", clickable: true },
            { label: selectedExperiment?.name || "", clickable: false },
          ].filter((item) => item.label)}
          onClickHandlers={[goBackToProjects, goBackToExperiments]}
        />
        <StudyTypeSelection
          studyTypes={studyTypes}
          onSelect={handleStudyTypeClick}
        />
      </div>
    );
  }

  // Experiments View - Only show experiments, project list is hidden
  if (view === "experiments" && currentProject) {
    return (
      <div className="px-6 py-6">
        <ProjectFoldersHeader
          breadcrumbs={[
            { label: "Projects", clickable: true },
            { label: currentProject?.name || "", clickable: false },
          ].filter((item) => item.label)}
          onClickHandlers={[goBackToProjects]}
        />

        <ExperimentList
          experiments={currentExperiments}
          searchQuery={experimentSearchQuery}
          setSearchQuery={setExperimentSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onExperimentClick={handleExperimentClick}
          onCloseExperiment={(exp) => {
            setExperimentToClose(exp);
            setIsCloseExperimentOpen(true);
          }}
        />
        <CloseExperimentModal
          isOpen={isCloseExperimentOpen}
          onClose={() => {
            setIsCloseExperimentOpen(false);
            setExperimentToClose(null);
          }}
          onConfirm={() => {
            setIsCloseExperimentOpen(false);
            setExperimentToClose(null);
          }}
          experimentName={experimentToClose?.name || ""}
        />
      </div>
    );
  }

  // Default Projects View
  return (
    <div className="px-6 py-6">
      <ProjectFoldersHeader
        breadcrumbs={[{ label: "Projects", clickable: false }]}
      />

      <div className="space-y-4">
        <div className="relative max-w-md">
          <Input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="lg"
          />
        </div>

        {/* Project List */}
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/30 transition-colors"
            >
              <Button
                onClick={() => handleProjectClick(project)}
                variant={"ghost"}
                className=" gap-3 flex-1 hover:bg-transparent text-left items-start justify-start h-auto"
              >
                <FolderOpen className="size-6 text-muted-foreground shrink-0" />
                <div>
                  <h3 className="font-medium">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {project.status}
                  </p>
                </div>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCloseProject(project)}
              >
                <XCircle className="size-4 mr-1 text-destructive" />
                Close Project
              </Button>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No projects found matching {`"${searchQuery}"`}
          </div>
        )}
      </div>

      <CloseConfirmationModal
        isOpen={isCloseModalOpen}
        onClose={() => {
          setIsCloseModalOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={confirmCloseProject}
        type="project"
        itemName={selectedProject?.name || ""}
      />
      <Outlet />
    </div>
  );
}
