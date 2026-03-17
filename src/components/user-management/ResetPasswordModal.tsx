import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { PasswordFields } from "@/components/molecules/PasswordFields";
import { Form } from "@/components/organisms/Form/Form";
import { useChangePassword } from "@/lib/auth";
import {
  changePasswordSchema,
  isPasswordFormValid,
} from "@/lib/password-utils";

export interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  restrictedMode?: boolean; // When true, no close button and can't close outside
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
  restrictedMode = false,
}) => {
  const changePasswordMutation = useChangePassword();

  type FormValues = {
    current: string;
    new: string;
    confirm: string;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current: "",
      new: "",
      confirm: "",
    },
  });

  const newPassword = form.watch("new");
  const confirmPassword = form.watch("confirm");
  const currentPassword = form.watch("current");

  const isFormValid = isPasswordFormValid(
    newPassword,
    confirmPassword,
    currentPassword,
    true
  );

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
      showClose={!restrictedMode}
      preventOutsideClose={restrictedMode}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleReset)}>
          <PasswordFields showCurrent showConfirm className="py-2" />
          <div className="flex flex-row gap-2 justify-end pt-3">
            {!restrictedMode && (
              <Button
                variant="outline"
                size="lg"
                type="button"
                onClick={handleCancel}
                disabled={changePasswordMutation.isPending}
              >
                Cancel
              </Button>
            )}
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
