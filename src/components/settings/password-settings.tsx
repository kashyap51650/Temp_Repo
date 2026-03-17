import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms";
import { PasswordFields } from "@/components/molecules/PasswordFields";
import { Form } from "@/components/organisms/Form/Form";
import {
  changePasswordSchema,
  isPasswordFormValid,
} from "@/lib/password-utils";

export function PasswordSettings() {
  type PasswordFormValues = {
    current: string;
    new: string;
    confirm: string;
  };

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current: "",
      new: "",
      confirm: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const newPassword = passwordForm.watch("new");
  const confirmPassword = passwordForm.watch("confirm");
  const currentPassword = passwordForm.watch("current");

  const isFormValid = isPasswordFormValid(
    newPassword,
    confirmPassword,
    currentPassword,
    true
  );

  const handlePasswordSubmit = async (_data: PasswordFormValues) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      passwordForm.reset();
    }, 1200);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          <CardTitle className="text-xl">Password Settings</CardTitle>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          Change your account password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
            <PasswordFields showCurrent showConfirm />
            <Button
              type="submit"
              size={"lg"}
              disabled={!isFormValid || loading}
            >
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
