import { zodResolver } from "@hookform/resolvers/zod";
import type { ReactElement } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button, Dialog, Input, Textarea } from "@/components";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/organisms/Form/Form";

interface Role {
  id: string;
  name: string;
  description: string;
}

interface RoleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  role?: Role | null;
  onSubmit: (roleData: any) => void; // More flexible type to accommodate both use cases
}

const schema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
});

type FormValues = z.infer<typeof schema>;

export function RoleFormModal({
  open,
  onOpenChange,
  mode,
  role,
  onSubmit,
}: RoleFormModalProps): ReactElement {
  const isEdit = mode === "edit";

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isEdit && role) {
      form.reset({
        name: role.name,
        description: role.description,
      });
    } else if (!isEdit) {
      form.reset({
        name: "",
        description: "",
      });
    }
  }, [role, form, isEdit]);

  const handleSubmit = async (values: FormValues) => {
    const trimmedData = {
      name: values.name.trim(),
      description: values.description.trim(),
    };

    if (isEdit && role) {
      await onSubmit({
        id: role.id,
        ...trimmedData,
      });
    } else {
      await onSubmit(trimmedData);
    }

    form.reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const dialogTitle = isEdit ? "Edit Role" : "Create New Role";
  const dialogDescription = isEdit
    ? "Update the role details."
    : "Define a new role for the system";
  const submitButtonText = isEdit ? "Save" : "Create";
  const submittingButtonText = isEdit ? "Saving..." : "Creating...";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      trigger={null}
      title={dialogTitle}
      description={dialogDescription}
      showClose={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="my-6 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input
                      id="role-name"
                      placeholder="Enter role name"
                      size="lg"
                      {...field}
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
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="role-description"
                      placeholder="Enter role description"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <Button
              type="button"
              size="lg"
              variant="outline"
              onClick={handleClose}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? submittingButtonText
                : submitButtonText}
            </Button>
          </div>
        </form>
      </Form>
    </Dialog>
  );
}
