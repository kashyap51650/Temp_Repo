import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";
import { Textarea } from "@/components/atoms/Textarea/Textarea";
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
  onSave: (roleData: { id: string; name: string; description: string }) => void;
}

export function EditRoleModal({
  open,
  onOpenChange,
  role,
  onSave,
}: EditRoleModalProps) {
  const schema = z.object({
    name: z.string().min(1, "Role name is required"),
    description: z.string().min(1, "Description is required"),
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  React.useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        description: role.description,
      });
    }
  }, [role, form]);

  const handleSave = async (values: FormValues) => {
    if (role) {
      await onSave({
        id: role.id,
        name: values.name.trim(),
        description: values.description.trim(),
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
              {form.formState.isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </Dialog>
  );
}
