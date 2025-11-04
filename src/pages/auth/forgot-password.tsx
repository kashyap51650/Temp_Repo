import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/atoms";
import { OtpInput } from "@/components/atoms/Input/otp-input";
import { toast } from "@/components/atoms/Sonner/toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/organisms/Form/Form";
import { ResetPasswordModal } from "@/components/user-management/ResetPasswordModal";
import { API_CONFIG, apiClient } from "@/lib/api";

const forgotSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .min(1, "Email is required")
    .email({ message: "Please enter a valid email address" }),
});
const otpSchema = z.object({
  otp: z
    .string({ message: "OTP is required" })
    .min(1, "OTP is required")
    .length(6, { message: "OTP must be exactly 6 digits" })
    .regex(/^\d{6}$/, { message: "OTP must contain only numbers" }),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<"email" | "otp">("email");
  const [email, setEmail] = React.useState("");
  const [timer, setTimer] = React.useState(120);
  const [resetModalOpen, setResetModalOpen] = React.useState(false);

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const {
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors, isSubmitting: isOtpSubmitting },
    reset: resetOtpForm,
    setValue: setOtpValue,
    watch: watchOtp,
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  React.useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const onSubmit = async (data: ForgotFormValues) => {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email: data.email,
      });

      toast.success("Reset link sent successfully! Check your email.");
      setEmail(data.email);
      setStep("otp");
      setTimer(120);
      resetOtpForm();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send reset link";
      toast.error(errorMessage);
    }
  };

  const onOtpSubmit = async (data: OtpFormValues) => {
    try {
      const response = await apiClient.post<{
        message: string;
        reset_token: string;
      }>(API_CONFIG.ENDPOINTS.AUTH.VERIFY_RESET_CODE, {
        email: email,
        code: data.otp,
      });

      toast.success(response.message || "OTP verified successfully!");

      sessionStorage.setItem("reset_token", response.reset_token);

      setResetModalOpen(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Invalid verification code. Please check the code and try again.";
      toast.error(errorMessage);
      setOtpValue("otp", "");
    }
  };

  const handlePasswordResetSuccess = () => {
    toast.success("Password reset successfully!");
    sessionStorage.removeItem("reset_token");
    navigate({ to: "/auth/login" });
  };

  const handleChangeEmail = () => {
    setStep("email");
    setEmail("");
    form.reset();
    resetOtpForm();
    setTimer(120);
  };

  const handleResendOtp = async () => {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email: email,
      });

      toast.success("OTP resent successfully! Check your email.");
      setOtpValue("otp", "");
      setTimer(120);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to resend OTP";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <Card className="mx-auto w-full max-w-md border border-gray-200 shadow-none rounded-2xl">
        <CardHeader className="text-center gap-1">
          <CardTitle className="text-2xl font-semibold text-gray-900">
            Password Reset
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            {step === "email"
              ? "Enter your email to reset your password"
              : `Enter the OTP sent to ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 pt-2 pb-0">
          {step === "email" ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          size="lg"
                          placeholder="Enter your email"
                          disabled={form.formState.isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  size={"lg"}
                  variant="default"
                  className="w-full mb-2"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Sending..."
                    : "Send Reset Link"}
                </Button>
                <Button
                  variant={"link"}
                  className="w-full p-0"
                  type="button"
                  onClick={() => navigate({ to: "/auth/login" })}
                >
                  <ArrowLeft /> Back to Login
                </Button>
              </form>
            </Form>
          ) : (
            <form onSubmit={handleSubmitOtp(onOtpSubmit)} className="space-y-6">
              <div>
                <Label className="mb-2.5" htmlFor="otp">
                  OTP
                </Label>
                <OtpInput
                  value={watchOtp("otp") || ""}
                  onChange={(val) => setOtpValue("otp", val)}
                  disabled={isOtpSubmitting}
                  error={otpErrors.otp?.message}
                />
              </div>
              <div className="flex justify-between items-center gap-2 ">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  {timer > 0
                    ? `Resend OTP in ${Math.floor(timer / 60)}:${(timer % 60)
                        .toString()
                        .padStart(2, "0")}`
                    : "Didn't receive the code?"}
                  <Button
                    type="button"
                    variant="link"
                    className="text-xs text-primary px-2"
                    onClick={handleResendOtp}
                    disabled={timer !== 0}
                  >
                    Resend OTP
                  </Button>
                </span>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="link"
                    className="text-xs text-primary px-0"
                    onClick={handleChangeEmail}
                  >
                    Change Email
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                size={"lg"}
                variant="default"
                className="w-full mb-2"
                disabled={isOtpSubmitting}
              >
                {isOtpSubmitting ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <ResetPasswordModal
        open={resetModalOpen}
        onOpenChange={setResetModalOpen}
        onSuccess={handlePasswordResetSuccess}
      />
    </>
  );
}
