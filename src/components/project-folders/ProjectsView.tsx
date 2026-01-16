import { FolderOpen, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { Button, Input } from "@/components/atoms";
import { useProjectsList } from "@/hooks";
import useDebounce from "@/hooks/useDebounce";
import { DEFAULT_DEBOUNCE_DELAY, DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { ProjectItem } from "@/types/project";

import { PaginationControls } from "../organisms/DataTable/PaginationControls";

interface ProjectsViewProps {
  onProjectClick: (project: ProjectItem) => void;
  onCloseProject: (project: ProjectItem) => void;
}

export function ProjectsView({
  onProjectClick,
  onCloseProject,
}: Readonly<ProjectsViewProps>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const debounceValue = useDebounce(searchQuery, DEFAULT_DEBOUNCE_DELAY);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const {
    data: projectsData,
    isLoading,
    error,
    isFetching,
  } = useProjectsList({
    search: debounceValue || undefined,
    page: currentPage,
    size: DEFAULT_PAGE_SIZE,
  });

  const projects = projectsData?.data?.items || [];
  const totalItems = projectsData?.data?.total || 0;
  const totalPages = Math.ceil(totalItems / DEFAULT_PAGE_SIZE);

  const loading = isLoading && isFetching;

  return (
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

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8 text-muted-foreground">
          Loading projects...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8 text-destructive">
          Error loading projects: {error.message}
        </div>
      )}

      {/* Project List */}
      {!loading && !error && (
        <>
          <div className="space-y-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onProjectClick={onProjectClick}
                onCloseProject={onCloseProject}
              />
            ))}
          </div>
          {projects.length > 0 && (
            <PaginationControls
              pagination={{
                page: currentPage,
                totalPages,
                canNext: currentPage < totalPages,
                canPrev: currentPage > 1,
                onFirst: () => setCurrentPage(1),
                onPrev: () => setCurrentPage(currentPage - 1),
                onNext: () => setCurrentPage(currentPage + 1),
                onLast: () => setCurrentPage(totalPages),
              }}
            />
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && !error && projects.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery
            ? `No projects found matching "${searchQuery}"`
            : "No projects available"}
        </div>
      )}
    </div>
  );
}

interface ProjectCardProps {
  project: ProjectItem;
  onProjectClick: (project: ProjectItem) => void;
  onCloseProject: (project: ProjectItem) => void;
}

function ProjectCard({
  project,
  onProjectClick,
  onCloseProject,
}: Readonly<ProjectCardProps>) {
  return (
    <div className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/30 transition-colors">
      <Button
        onClick={() => onProjectClick(project)}
        variant="ghost"
        className="gap-3 flex-1 hover:bg-transparent text-left items-start justify-start h-auto"
      >
        <FolderOpen className="size-6 text-muted-foreground shrink-0" />
        <div>
          <h3 className="font-medium">{project.project_name}</h3>
          <p className="text-sm text-muted-foreground">
            {project.project_status}
          </p>
          {project.description && (
            <p className="text-xs text-muted-foreground mt-1">
              {project.description}
            </p>
          )}
        </div>
      </Button>

      {project.project_status !== "closed" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCloseProject(project)}
        >
          <XCircle className="size-4 mr-1 text-destructive" />
          Close Project
        </Button>
      )}
    </div>
  );
}
