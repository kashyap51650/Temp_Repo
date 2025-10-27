import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { PasswordFields } from "@/components/molecules/PasswordFields";
import { Form } from "@/components/organisms/Form/Form";

export interface ResetPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: (data: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  open,
  onOpenChange,
  onReset,
}) => {
  const schema = z
    .object({
      current: z.string().min(1, "Old password is required"),
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
      current: "",
      new: "",
      confirm: "",
    },
  });

  const handleReset = (values: FormValues) => {
    onReset({
      oldPassword: values.current,
      newPassword: values.new,
      confirmPassword: values.confirm,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
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
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button size="lg" className="default" type="submit">
              Reset Password
            </Button>
          </div>
        </form>
      </Form>
    </Dialog>
  );
};
