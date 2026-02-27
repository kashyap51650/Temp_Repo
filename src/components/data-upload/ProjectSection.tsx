import React from "react";

import { Input } from "@/components/atoms";
import { Label } from "@/components/atoms/Label/Label";
import { ProjectSelect } from "@/components/atoms/Selects";

interface ProjectSectionProps {
  formData: any;
  setFormData: (updater: (prev: any) => any) => void;
  isCreatingNewProject: boolean;
  errors: any;
  existingProjects: any[];
  onShowCreateProjectModal?: () => void;
  onProjectChange?: (project: any) => void;
  projectsLoading?: boolean;
}

export function ProjectSection({
  formData,
  setFormData,
  isCreatingNewProject,
  errors,
  existingProjects,
  onShowCreateProjectModal,
  onProjectChange,
  projectsLoading = false,
}: Readonly<ProjectSectionProps>) {
  const selectedProjectId = formData.project
    ? formData.project.id?.toString()
    : "";

  return (
    <div className="space-y-2">
      <Label htmlFor="project">Project</Label>
      <div className="flex gap-2 items-start">
        <div className="flex-1 min-w-0">
          {isCreatingNewProject ? (
            <Input
              placeholder="Enter new project name"
              value={formData.newProjectName}
              size={"default"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData((prev: any) => ({
                  ...prev,
                  newProjectName: e.target.value,
                }))
              }
            />
          ) : (
            <ProjectSelect
              projects={existingProjects}
              value={selectedProjectId}
              onValueChange={(val: string) => {
                const project = existingProjects.find((p: any) => p.id === val);
                const apiProject = project
                  ? {
                      id: Number.parseInt(project.id),
                      project_name: project.name,
                    }
                  : null;

                if (onProjectChange) {
                  onProjectChange(apiProject);
                } else {
                  setFormData((prev: any) => ({
                    ...prev,
                    project: apiProject,
                  }));
                }
              }}
              onCreateNew={() => onShowCreateProjectModal?.()}
              disabled={projectsLoading}
              className="max-w-full"
            />
          )}
          {projectsLoading && (
            <p className="text-xs text-muted-foreground mt-1">
              Loading projects...
            </p>
          )}
        </div>
      </div>
      {errors.project && (
        <span className="text-sm text-red-500">{errors.project}</span>
      )}
    </div>
  );
}
