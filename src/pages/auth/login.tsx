import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/organisms/Form/Form";
import { ResetPasswordModal } from "@/components/user-management/ResetPasswordModal";
import { useLogin } from "@/lib/auth";
import type { LoginCredentials } from "@/types/auth";

const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required")
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/login" });
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);

  const onSubmit = async (data: LoginFormValues) => {
    const credentials: LoginCredentials = {
      email: data.email,
      password: data.password,
    };

    try {
      const response = await loginMutation.mutateAsync(credentials);

      if (response.must_change_password) {
        setShowPasswordResetModal(true);
        return;
      }

      const redirectTo = (search as { redirect?: string })?.redirect || "/home";
      navigate({ to: redirectTo });
    } catch (error) {
      // In future replace it by sentry error logs
      console.error("Login error:", error);
    }
  };

  const handlePasswordResetSuccess = () => {
    setShowPasswordResetModal(false);
    const redirectTo = (search as { redirect?: string })?.redirect || "/home";
    navigate({ to: redirectTo });
  };

  return (
    <>
      <Card className="mx-auto gap-4 w-full max-w-md border border-gray-200 shadow-none rounded-2xl ">
        <CardHeader className="text-center gap-1">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Orano Med
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Research Data Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 pt-2 pb-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="text-left mb-5">
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        size="lg"
                        autoComplete="off"
                        placeholder="Enter your email"
                        disabled={
                          form.formState.isSubmitting || loginMutation.isPending
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="text-left mb-3">
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          autoComplete="off"
                          size="lg"
                          placeholder="Enter your password"
                          disabled={
                            form.formState.isSubmitting ||
                            loginMutation.isPending
                          }
                          className="pr-10"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        tabIndex={0}
                        className="bg-transparent p-0 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-transparent focus:outline-none h-auto w-auto"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeIcon className="size-4" />
                        ) : (
                          <EyeOffIcon className="size-4" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-right mb-5">
                <Link
                  className="text-sm text-gray-500 font-medium hover:underline"
                  to={"/auth/forgot-password"}
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                variant={"default"}
                size={"lg"}
                className="w-full"
                disabled={
                  form.formState.isSubmitting || loginMutation.isPending
                }
              >
                {form.formState.isSubmitting || loginMutation.isPending
                  ? "Signing in..."
                  : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ResetPasswordModal
        open={showPasswordResetModal}
        onOpenChange={setShowPasswordResetModal}
        onSuccess={handlePasswordResetSuccess}
        restrictedMode={true}
      />
    </>
  );
}
