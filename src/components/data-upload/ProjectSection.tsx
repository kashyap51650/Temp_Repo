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
}

export function ProjectSection({
  formData,
  setFormData,
  isCreatingNewProject,
  errors,
  existingProjects,
  onShowCreateProjectModal,
  onProjectChange,
}: ProjectSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="project">Project</Label>
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          {!isCreatingNewProject ? (
            <ProjectSelect
              projects={existingProjects}
              value={formData.project?.id || ""}
              onValueChange={(val: string) => {
                const project = existingProjects.find((p: any) => p.id === val);
                if (onProjectChange) {
                  onProjectChange(project || null);
                } else {
                  setFormData((prev: any) => ({
                    ...prev,
                    project: project || null,
                  }));
                }
              }}
              onCreateNew={() => onShowCreateProjectModal?.()}
            />
          ) : (
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
          )}
        </div>
      </div>
      {errors.project && (
        <span className="text-sm text-red-500">{errors.project}</span>
      )}
    </div>
  );
}
