import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Label,
} from "@/components/atoms";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async () => {
    navigate({ to: "/user-management" });
  };

  return (
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="text-left mb-5">
            <Label className="mb-2.5" htmlFor="email">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              size="lg"
              autoComplete="off"
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
          <div className="text-left mb-3">
            <Label className="mb-2.5" htmlFor="password">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="off"
                size="lg"
                placeholder="Enter your password"
                {...register("password")}
                disabled={isSubmitting}
                aria-invalid={errors.email ? "true" : "false"}
              />
              <Button
                type="button"
                tabIndex={0}
                className="has-[>svg]:px-1 bg-transparent p-0 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-transparent focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-1  pt-4">
        <div className="text-sm text-slate-500 text-center">
          <div className="font-medium">Demo Accounts:</div>
          <div className="font-medium">admin@oranomed.com (Admin)</div>
          <div className="font-medium">
            uploader@oranomed.com (Data Uploader)
          </div>
          <div className="font-medium">scientist@oranomed.com (Scientist)</div>
        </div>
      </CardFooter>
    </Card>
  );
}
