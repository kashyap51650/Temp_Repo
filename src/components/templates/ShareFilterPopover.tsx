import { useState } from "react";

import { Button, Input, Label } from "../atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/Select/Select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../molecules/Popover/Popover";
import type { VisualFilterRow } from "../organisms/DataTable/tableData";

interface ShareFilterPopoverProps {
  filter: VisualFilterRow;
  trigger: React.ReactNode;
  onShare: (shareData: {
    filterId: string;
    shareBy: "email" | "role";
    value: string;
    accessLevel: string;
  }) => void;
}

export function ShareFilterPopover({
  filter,
  trigger,
  onShare,
}: ShareFilterPopoverProps) {
  const [shareBy, setShareBy] = useState<"email" | "role">("role");
  const [emailValue, setEmailValue] = useState("");
  const [roleValue, setRoleValue] = useState("");
  const [accessLevel, setAccessLevel] = useState("Read");
  const [errors, setErrors] = useState({
    value: "",
    accessLevel: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    "Administrator",
    "Data Uploader",
    "Scientist",
    "Researcher",
    "Data Validator",
    "Viewer",
  ];

  const accessLevels = [
    { value: "Read", label: "Read" },
    { value: "Edit", label: "Edit" },
    { value: "Owner", label: "Owner" },
  ];

  const validateForm = () => {
    const newErrors = { value: "", accessLevel: "" };
    let isValid = true;

    if (shareBy === "email" && !emailValue.trim()) {
      newErrors.value = "Email address is required";
      isValid = false;
    } else if (
      shareBy === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
    ) {
      newErrors.value = "Please enter a valid email address";
      isValid = false;
    }

    if (shareBy === "role" && !roleValue) {
      newErrors.value = "Please select a role";
      isValid = false;
    }

    if (!accessLevel) {
      newErrors.accessLevel = "Please select an access level";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleShare = () => {
    if (validateForm()) {
      onShare({
        filterId: filter.id,
        shareBy,
        value: shareBy === "email" ? emailValue : roleValue,
        accessLevel,
      });
      handleReset();
      setIsOpen(false);
    }
  };

  const handleReset = () => {
    setShareBy("role");
    setEmailValue("");
    setRoleValue("");
    setAccessLevel("Read");
    setErrors({ value: "", accessLevel: "" });
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-80 p-6" align="end">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Share Filter</h3>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="share-by">Share by</Label>
            <Select
              value={shareBy}
              onValueChange={(value) => {
                setShareBy(value as "email" | "role");
                setErrors({ ...errors, value: "" });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="role">Role</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email or Role Input */}
          {shareBy === "email" ? (
            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={emailValue}
                onChange={(e) => {
                  setEmailValue(e.target.value);
                  setErrors({ ...errors, value: "" });
                }}
                placeholder="Enter email address"
                className="w-full"
              />
              {errors.value && (
                <p className="text-sm text-destructive">{errors.value}</p>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <Label htmlFor="role">Select Role</Label>
              <Select
                value={roleValue}
                onValueChange={(value) => {
                  setRoleValue(value);
                  setErrors({ ...errors, value: "" });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.value && (
                <p className="text-sm text-destructive">{errors.value}</p>
              )}
            </div>
          )}

          {/* Access Level */}
          <div className="space-y-1">
            <Label htmlFor="access-level">Access Level</Label>
            <Select
              value={accessLevel}
              onValueChange={(value) => {
                setAccessLevel(value);
                setErrors({ ...errors, accessLevel: "" });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {accessLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.accessLevel && (
              <p className="text-sm text-destructive">{errors.accessLevel}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {accessLevel === "Owner" &&
                "Full control (edit, delete, reshare)"}
              {accessLevel === "Edit" &&
                "Modify filter properties but cannot delete or reshare"}
              {accessLevel === "Read" &&
                "Apply filter for search/analysis but cannot modify"}
            </p>
          </div>

          {/* Share Button */}
          <Button size="default" onClick={handleShare} className="w-full">
            Share Filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
