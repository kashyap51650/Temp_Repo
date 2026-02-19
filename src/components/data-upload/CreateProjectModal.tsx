import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  type ProjectFormDataType,
  projectSchema,
} from "@/schemas/dataUploadSchema";

import { Button, Dialog, Input, Textarea } from "../atoms";
import { Form } from "../organisms";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../organisms/Form/Form";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (projectName: string, description: string) => Promise<void>;
}

export function CreateProjectModal({
  isOpen,
  onClose,
  onCreateProject,
}: Readonly<CreateProjectModalProps>) {
  const form = useForm<ProjectFormDataType>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: "",
      description: "",
    },
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  const handleCreate = async (data: ProjectFormDataType) => {
    try {
      const { projectName, description } = data;
      await onCreateProject(projectName, description);
      reset();
      onClose();
    } catch (error) {
      toast.error("Failed to create project", {
        description: (error as AxiosError)?.message,
      });
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) handleCancel();
      }}
      title={"Create New Project"}
      description={"Enter the details for your new project"}
      showClose={true}
      className="max-w-lg"
      trigger={null}
    >
      <div className="space-y-4">
        <Form {...form}>
          <form onSubmit={handleSubmit(handleCreate)}>
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>
                    Project Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      size="lg"
                      {...field}
                      placeholder="Enter project name"
                      className="w-full"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && field.value.trim()) {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSubmit(handleCreate)();
                        }
                        if (e.key === "Escape") {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCancel();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter project description (optional)"
                      className="w-full min-h-[100px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Escape") {
                          handleCancel();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                size={"lg"}
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" size={"lg"} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Dialog>
  );
}
