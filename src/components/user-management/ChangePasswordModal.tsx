import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { PasswordFields } from "@/components/molecules/PasswordFields";
import { Form } from "@/components/organisms/Form/Form";

export interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangePassword: (data: {
    newPassword: string;
    confirmPassword: string;
  }) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onOpenChange,
  onChangePassword,
}) => {
  const schema = z
    .object({
      new: z.string().min(6, "New password must be at least 6 characters"),
      confirm: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.new === data.confirm, {
      message: "Passwords do not match",
      path: ["confirm"],
    });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      new: "",
      confirm: "",
    },
  });

  const handleChangePassword = (values: FormValues) => {
    onChangePassword({
      newPassword: values.new,
      confirmPassword: values.confirm,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        return;
      }}
      title="Change Password"
      description="Set your new password."
      trigger={null}
      showClose={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleChangePassword)}>
          <PasswordFields showConfirm className="py-2" />
          <div className="flex flex-row gap-2 justify-end pt-3">
            <Button size="lg" className="default" type="submit">
              Change Password
            </Button>
          </div>
        </form>
      </Form>
    </Dialog>
  );
};
