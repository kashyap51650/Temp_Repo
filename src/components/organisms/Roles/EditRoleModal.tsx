import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/organisms/Form/Form";

export interface EditRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: { id: string; name: string; description: string } | null;
  onSave: (role: { id: string; name: string; description: string }) => void;
}

export function EditRoleModal({
  open,
  onOpenChange,
  role,
  onSave,
}: EditRoleModalProps) {
  const schema = z.object({
    roleName: z.string().min(1, "Role name is required"),
    description: z.string().optional(),
  });
  type FormValues = z.infer<typeof schema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      roleName: role?.name || "",
      description: role?.description || "",
    },
    values: role
      ? { roleName: role.name, description: role.description }
      : undefined,
  });

  React.useEffect(() => {
    if (role) {
      form.reset({ roleName: role.name, description: role.description });
    }
  }, [role, form]);

  const handleSave = async (values: FormValues) => {
    if (role) {
      onSave({
        ...role,
        name: values.roleName.trim(),
        description: values.description || "",
      });
    }
    form.reset();
    onOpenChange(false);
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Role"
      description="Update the role details."
      showClose={true}
      trigger={null}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)}>
          <div className="my-6">
            <FormField
              control={form.control}
              name="roleName"
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
                    <Input
                      id="role-desc"
                      placeholder="Enter description"
                      size="lg"
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
              Save
            </Button>
          </div>
        </form>
      </Form>
    </Dialog>
  );
}
