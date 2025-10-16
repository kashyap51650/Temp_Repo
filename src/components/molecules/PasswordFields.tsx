import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

import { Button, Input } from "../atoms";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../organisms/Form/Form";

interface PasswordFieldsProps {
  showCurrent?: boolean;
  showConfirm?: boolean;
  className?: string;
}

export const PasswordFields: React.FC<PasswordFieldsProps> = ({
  showCurrent = false,
  showConfirm = true,
  className = "",
}) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const { control } = useFormContext();

  return (
    <div className={cn("grid gap-4", className)}>
      {showCurrent && (
        <FormField
          control={control}
          name="current"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    id="current-password"
                    size="lg"
                    type={showCurrentPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="pr-10"
                    placeholder="Enter current password"
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  tabIndex={0}
                  aria-label={
                    showCurrentPassword ? "Hide password" : "Show password"
                  }
                  className="bg-transparent p-0 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-transparent focus:outline-none h-auto w-auto"
                  onClick={() => setShowCurrentPassword((v) => !v)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={control}
        name="new"
        render={({ field }) => (
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  id="new-password"
                  size="lg"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="pr-10"
                  placeholder="Enter new password"
                  {...field}
                />
              </FormControl>
              <Button
                type="button"
                tabIndex={0}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                className="bg-transparent p-0 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-transparent focus:outline-none h-auto w-auto"
                onClick={() => setShowNewPassword((v) => !v)}
              >
                {showNewPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
            </div>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      {showConfirm && (
        <FormField
          control={control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {showCurrent ? "Confirm Password" : "Retype Password"}
              </FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    id="confirm-password"
                    size="lg"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="pr-10"
                    placeholder="Retype new password"
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  tabIndex={0}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="bg-transparent p-0 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-transparent focus:outline-none h-auto w-auto"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};
