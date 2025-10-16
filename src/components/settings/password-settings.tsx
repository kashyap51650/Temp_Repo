import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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

export function PasswordSettings() {
  const passwordSchema = z
    .object({
      current: z.string().min(1, "Current password is required"),
      new: z.string().min(6, "New password must be at least 6 characters"),
      confirm: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.new === data.confirm, {
      message: "Passwords do not match",
      path: ["confirm"],
    });

  type PasswordFormValues = z.infer<typeof passwordSchema>;

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current: "",
      new: "",
      confirm: "",
    },
  });
  const [loading, setLoading] = useState(false);

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
          <form
            onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
            className="space-y-6"
          >
            <PasswordFields showCurrent showConfirm />
            <Button type="submit" size={"lg"} disabled={loading}>
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
