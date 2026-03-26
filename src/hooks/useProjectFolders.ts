import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import type { StudyType } from "@/api";
import type { Experiment } from "@/types/experiment";
import type { ProjectItem, View } from "@/types/project";

export function useProjectFoldersLogic() {
  // Search and filter states

  const navigate = useNavigate();
  const search = useSearch({
    from: "/project-folders",
  });

  // Navigation states
  const [view, setView] = useState<View>("projects");
  const [currentProject, setCurrentProject] = useState<ProjectItem | null>(
    null
  );

  const [selectedExperiment, setSelectedExperiment] =
    useState<Experiment | null>(null);
  const [selectedStudyType, setSelectedStudyType] = useState<StudyType | null>(
    null
  );

  // Modal states
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isCloseExperimentOpen, setIsCloseExperimentOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );
  const [experimentToClose, setExperimentToClose] = useState<Experiment | null>(
    null
  );

  // Clear all search params on initial mount (page refresh/reload)
  useEffect(() => {
    navigate({
      to: "/project-folders",
      search: {
        projectId: undefined,
        experimentId: undefined,
        studyTypeId: undefined,
      },
      replace: true,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (search.experimentId && search.studyTypeId) {
      setView("study-sheets");
    } else if (search.studyTypeId) {
      setView("experiments");
    } else if (search.projectId) {
      setView("study-types");
    } else {
      setView("projects");
    }
  }, [search.projectId, search.experimentId, search.studyTypeId]);

  // Navigation handlers
  const handleProjectClick = async (project: ProjectItem) => {
    setCurrentProject(project);
    navigate({
      to: "/project-folders",
      search: {
        projectId: project.id,
        experimentId: undefined,
        studyTypeId: undefined,
      },
    });
  };

  const handleExperimentClick = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    navigate({
      to: "/project-folders",
      search: {
        projectId: search.projectId,
        studyTypeId: search.studyTypeId,
        experimentId: experiment.id,
      },
    });
  };

  const handleStudyTypeClick = (studyType: StudyType) => {
    setSelectedStudyType(studyType);
    navigate({
      to: "/project-folders",
      search: {
        projectId: search.projectId,
        experimentId: undefined,
        studyTypeId: studyType.id,
      },
    });
  };

  const goBackToProjects = () => {
    navigate({
      to: "/project-folders",
      search: {
        projectId: undefined,
        experimentId: undefined,
        studyTypeId: undefined,
      },
    });
    setCurrentProject(null);
    setSelectedExperiment(null);
    setSelectedStudyType(null);
  };

  const goBackToExperiments = () => {
    navigate({
      to: "/project-folders",
      search: {
        projectId: search.projectId,
        experimentId: undefined,
        studyTypeId: search.studyTypeId,
      },
    });
    setSelectedExperiment(null);
  };

  const goBackToStudyTypes = () => {
    navigate({
      to: "/project-folders",
      search: {
        projectId: search.projectId,
        experimentId: undefined,
        studyTypeId: undefined,
      },
    });
    setSelectedExperiment(null);
    setSelectedStudyType(null);
  };

  // Project modal handlers
  const handleCloseProject = (project: ProjectItem) => {
    setSelectedProject(project);
    setIsCloseModalOpen(true);
  };

  const confirmCloseProject = () => {
    if (selectedProject) {
      setIsCloseModalOpen(false);
      setSelectedProject(null);
    }
  };

  const cancelCloseProject = () => {
    setIsCloseModalOpen(false);
    setSelectedProject(null);
  };

  // Experiment modal handlers
  const handleCloseExperiment = (experiment: Experiment) => {
    setExperimentToClose(experiment);
    setIsCloseExperimentOpen(true);
  };

  const confirmCloseExperiment = () => {
    setIsCloseExperimentOpen(false);
    setExperimentToClose(null);
  };

  const cancelCloseExperiment = () => {
    setIsCloseExperimentOpen(false);
    setExperimentToClose(null);
  };

  return {
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
  };
}
