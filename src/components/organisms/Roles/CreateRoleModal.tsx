import { zodResolver } from "@hookform/resolvers/zod";
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

export function CreateRoleModal({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (roleName: string) => void;
}) {
  const schema = z.object({
    roleName: z.string().min(1, "Role name is required"),
  });
  type FormValues = z.infer<typeof schema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { roleName: "" },
  });

  const handleCreate = async (values: FormValues) => {
    await onCreate(values.roleName.trim());
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
      trigger={null}
      title="Create New Role"
      description="Define a new role for the system"
      showClose={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreate)}>
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
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <Button
              type="button"
              size={"lg"}
              variant="outline"
              onClick={handleClose}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size={"lg"}
              disabled={form.formState.isSubmitting}
            >
              Create
            </Button>
          </div>
        </form>
      </Form>
    </Dialog>
  );
}
