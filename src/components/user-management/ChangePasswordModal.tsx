import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { toast } from "@/components/atoms/Sonner/toast";
import { PasswordFields } from "@/components/molecules/PasswordFields";
import { Form } from "@/components/organisms/Form/Form";
import { API_CONFIG, apiClient } from "@/lib/api";
import { isPasswordFormValid } from "@/lib/password-utils";

export interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangePassword?: (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
  onSuccess?: () => void;
  mode?: "change" | "reset";
  resetToken?: string | null;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onOpenChange,
  onChangePassword,
  onSuccess,
  mode = "change",
  resetToken,
}) => {
  type FormValues = {
    current?: string;
    new: string;
    confirm: string;
  };

  const form = useForm<FormValues>({
    defaultValues: {
      ...(mode === "change" && { current: "" }),
      new: "",
      confirm: "",
    },
  });

  const newPassword = form.watch("new");
  const confirmPassword = form.watch("confirm");

  // Handle current password based on mode
  let currentPassword = "";
  if (mode === "change") {
    try {
      currentPassword = (form.getValues() as any).current || "";
    } catch {
      currentPassword = "";
    }
  }

  const isFormValid = isPasswordFormValid(
    newPassword,
    confirmPassword,
    currentPassword,
    mode === "change"
  );

  const handleSubmit = async (values: FormValues) => {
    try {
      if (mode === "change" && onChangePassword) {
        onChangePassword({
          currentPassword: (values as any).current,
          newPassword: values.new,
          confirmPassword: values.confirm,
        });
      } else if (mode === "reset") {
        if (!resetToken) {
          toast.error("Reset token not found. Please try again.");
          return;
        }

        const response = await apiClient.post<{
          message: string;
        }>(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, {
          reset_token: resetToken,
          new_password: values.new,
          confirm_password: values.confirm,
        });

        toast.success(
          response.message ||
            "Password has been reset successfully. You can now log in with your new password."
        );

        if (onSuccess) {
          onSuccess();
        }
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update password";
      toast.error(errorMessage);
    }
  };

  const getButtonText = () => {
    if (form.formState.isSubmitting) {
      return "Updating...";
    }
    if (mode === "change") {
      return "Change Password";
    }
    return "Reset Password";
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        return;
      }}
      title={mode === "change" ? "Change Password" : "Reset Password"}
      description={
        mode === "change"
          ? "Set your new password."
          : "Enter your new password."
      }
      trigger={null}
      showClose={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <PasswordFields
            showCurrent={mode === "change"}
            showConfirm
            className="py-2"
          />
          <div className="flex flex-row gap-2 justify-end pt-3">
            <Button
              size="lg"
              className="default"
              type="submit"
              disabled={!isFormValid || form.formState.isSubmitting}
            >
              {getButtonText()}
            </Button>
          </div>
        </form>
      </Form>
    </Dialog>
  );
};
