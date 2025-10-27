import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";
import { CalendarDatePicker } from "@/components/organisms/CalendarDatePicker/CalendarDatePicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/organisms/Form/Form";

export interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: { username: string; email: string; expiry?: string | null };
  onSave: (data: {
    username: string;
    email: string;
    expiry: string | null;
  }) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  open,
  onOpenChange,
  user,
  onSave,
}) => {
  const schema = z.object({
    username: z.string().min(1, "User name is required"),
    email: z.string().email("Invalid email address"),
    expiry: z.date().nullable().optional(),
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user.username,
      email: user.email,
      expiry: user.expiry ? new Date(user.expiry) : null,
    },
  });

  React.useEffect(() => {
    form.reset({
      username: user.username,
      email: user.email,
      expiry: user.expiry ? new Date(user.expiry) : null,
    });
  }, [user, form]);

  const handleSave = (values: FormValues) => {
    onSave({
      username: values.username,
      email: values.email,
      expiry: values.expiry ? values.expiry.toISOString() : null,
    });
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit User"
      description="Update user account details."
      trigger={null}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)}>
          <div className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input size="lg" placeholder="Enter user name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      size="lg"
                      placeholder="Enter email address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expiry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Expiry Date</FormLabel>
                  <FormControl>
                    <CalendarDatePicker
                      id="expiry"
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      placeholder="Pick a date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-2 justify-end pt-3">
            <Button
              variant="outline"
              size={"lg"}
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button size={"lg"} className="default" type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </Dialog>
  );
};
