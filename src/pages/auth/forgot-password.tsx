import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
} from "@/components/atoms";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";

const forgotSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <Card className="mx-auto w-full max-w-md border border-gray-200 shadow-none rounded-2xl">
      <CardHeader className="text-center gap-1">
        <CardTitle className="text-2xl font-semibold text-gray-900">
          Password Reset
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Enter your email to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 pt-2 pb-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-left mb-4">
            <Label className="mb-2.5" htmlFor="email">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              size="lg"
              placeholder="Enter your email"
              {...register("email")}
              disabled={isSubmitting}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            size={"lg"}
            variant="default"
            className="w-full mb-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
          <Button
            variant={"outline"}
            className="w-full"
            type="button"
            onClick={() => navigate({ to: "/auth/login" })}
          >
            Back to Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
