import { Check, X } from "lucide-react";
import React from "react";

import { validatePasswordRequirements } from "@/lib/password-utils";
import { cn } from "@/lib/utils";

interface PasswordRequirementsProps {
  password: string;
  confirmPassword?: string;
  className?: string;
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
  confirmPassword,
  className,
}) => {
  const requirements = validatePasswordRequirements(password, confirmPassword);

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-gray-700 mb-3">
        Password Requirements:
      </p>
      <div className="space-y-1">
        {requirements.map((requirement) => (
          <div key={requirement.id} className="flex items-center gap-2 text-sm">
            {requirement.satisfied ? (
              <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
            ) : (
              <X className="h-4 w-4 text-red-500 flex-shrink-0" />
            )}
            <span
              className={cn(
                requirement.satisfied ? "text-green-700" : "text-gray-600"
              )}
            >
              {requirement.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
