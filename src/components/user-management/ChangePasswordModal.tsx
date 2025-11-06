import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { toast } from "@/components/atoms/Sonner/toast";
import { PasswordFields } from "@/components/molecules/PasswordFields";
import { Form } from "@/components/organisms/Form/Form";
import { API_CONFIG, apiClient } from "@/lib/api";

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
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  open,
  onOpenChange,
  onChangePassword,
  onSuccess,
  mode = "change",
}) => {
  const changePasswordSchema = z
    .object({
      current: z.string().min(1, "Please enter current password"),
      new: z.string().min(8, "New password must be at least 8 characters"),
      confirm: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.new === data.confirm, {
      message: "Passwords do not match",
      path: ["confirm"],
    });

  const resetPasswordSchema = z
    .object({
      new: z.string().min(8, "New password must be at least 8 characters"),
      confirm: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.new === data.confirm, {
      message: "Passwords do not match",
      path: ["confirm"],
    });

  const schema = mode === "change" ? changePasswordSchema : resetPasswordSchema;
  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(mode === "change" && { current: "" }),
      new: "",
      confirm: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      if (mode === "change" && onChangePassword) {
        onChangePassword({
          currentPassword: (values as any).current,
          newPassword: values.new,
          confirmPassword: values.confirm,
        });
      } else if (mode === "reset") {
        const resetToken = sessionStorage.getItem("reset_token");
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
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Updating..."
                : mode === "change"
                  ? "Change Password"
                  : "Reset Password"}
            </Button>
          </div>
        </form>
      </Form>
    </Dialog>
  );
};
