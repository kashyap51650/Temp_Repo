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
} from "@/components/atoms";
import { Button } from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { toast } from "@/components/atoms/Sonner/toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/organisms/Form/Form";

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
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async () => {
    toast.success("Login successful!");
    setTimeout(() => {
      navigate({ to: "/home" });
    }, 1200);
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
                      disabled={form.formState.isSubmitting}
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
                        disabled={form.formState.isSubmitting}
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
                        <EyeOffIcon className="size-4" />
                      ) : (
                        <EyeIcon className="size-4" />
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
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
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
