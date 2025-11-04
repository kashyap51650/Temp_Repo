import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { PasswordFields } from "@/components/molecules/PasswordFields";
import { Form } from "@/components/organisms/Form/Form";
import { useChangePassword } from "@/lib/auth";
import { createPasswordSchema, isPasswordValid } from "@/lib/password-utils";

export interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const changePasswordMutation = useChangePassword();

  const schema = z
    .object({
      current: z.string().min(1, "Old password is required"),
      new: createPasswordSchema("New password"),
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
      current: "",
      new: "",
      confirm: "",
    },
  });

  const newPassword = form.watch("new");
  const confirmPassword = form.watch("confirm");
  const currentPassword = form.watch("current");

  const isFormValid =
    currentPassword &&
    newPassword &&
    confirmPassword &&
    isPasswordValid(newPassword) &&
    newPassword === confirmPassword;

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    onOpenChange(isOpen);
  };

  const handleReset = (values: FormValues) => {
    changePasswordMutation.mutate(
      {
        current_password: values.current,
        new_password: values.new,
        confirm_password: values.confirm,
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Reset Password"
      description="Change the user's password."
      trigger={null}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleReset)}>
          <PasswordFields showCurrent showConfirm className="py-2" />
          <div className="flex flex-row gap-2 justify-end pt-3">
            <Button
              variant="outline"
              size="lg"
              type="button"
              onClick={handleCancel}
              disabled={changePasswordMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              className="default"
              type="submit"
              disabled={!isFormValid || changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending
                ? "Changing..."
                : "Reset Password"}
            </Button>
          </div>
        </form>
      </Form>
    </Dialog>
  );
};
