import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

  const failedAttemptsRef = useRef(0);
  const [lockoutUntil, setLockoutUntil] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const getLockoutMs = (attempts: number) => {
    if (attempts >= 5) return 5 * 60 * 1000;
    if (attempts === 4) return 40_000;
    if (attempts === 3) return 10_000;
    return 0;
  };

  useEffect(() => {
    if (lockoutUntil <= Date.now()) return;
    setCountdown(Math.ceil((lockoutUntil - Date.now()) / 1000));
    const id = setInterval(() => {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setCountdown(0);
        clearInterval(id);
      } else {
        setCountdown(remaining);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [lockoutUntil]);

  const onSubmit = async (data: LoginFormValues) => {
    if (Date.now() < lockoutUntil) return;

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

      failedAttemptsRef.current = 0;
      setLockoutUntil(0);
      setCountdown(0);
      const redirectTo = (search as { redirect?: string })?.redirect || "/home";
      navigate({ to: redirectTo });
    } catch (error: unknown) {
      // Error handling is done by useLogin's onError callback
      // API errors are already logged by the API interceptor
      // Only increment failed attempts for authentication failures
      let status: number | undefined;
      let message: string | undefined;
      if (typeof error === "object" && error !== null) {
        const anyError = error as {
          status?: number;
          response?: { status?: number };
          message?: string;
        };
        status = anyError.status ?? anyError.response?.status;
        if (typeof anyError.message === "string") {
          message = anyError.message;
        }
      } else if (typeof error === "string") {
        message = error;
      }
      const isThrottlingError =
        typeof message === "string" &&
        (message.includes("Request throttled") ||
          message.includes("already pending"));
      const isAuthFailure = status === 401 || status === 403 || status === 400;

      if (isAuthFailure && !isThrottlingError) {
        failedAttemptsRef.current += 1;
        const lockMs = getLockoutMs(failedAttemptsRef.current);
        if (lockMs > 0) {
          setLockoutUntil(Date.now() + lockMs);
        }
      }
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
                          form.formState.isSubmitting ||
                          loginMutation.isPending ||
                          countdown > 0
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
                            loginMutation.isPending ||
                            countdown > 0
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
                  form.formState.isSubmitting ||
                  loginMutation.isPending ||
                  countdown > 0
                }
              >
                {(() => {
                  if (countdown > 0)
                    return `Too many attempts — wait ${countdown}s`;
                  if (form.formState.isSubmitting || loginMutation.isPending)
                    return "Signing in...";
                  return "Sign In";
                })()}
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
