import { useState } from "react";

import { Button, Dialog, Input, Label } from "../atoms";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (projectName: string) => void;
}

export function CreateProjectModal({
  isOpen,
  onClose,
  onCreateProject,
}: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!projectName.trim()) return;

    setIsLoading(true);
    try {
      await onCreateProject(projectName.trim());
      setProjectName("");
      onClose();
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProjectName("");
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) handleCancel();
      }}
      title={"Create New Project"}
      description={" Enter the name for your new project"}
      showClose={true}
      className="max-w-lg"
      trigger={null}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="project-name" className="text-sm font-medium">
            Project Name
          </Label>
          <Input
            id="project-name"
            size="lg"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter" && projectName.trim()) {
                handleCreate();
              }
              if (e.key === "Escape") {
                handleCancel();
              }
            }}
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            size={"lg"}
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            size={"lg"}
            disabled={!projectName.trim() || isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
