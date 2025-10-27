import * as React from "react";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";
import { Label } from "@/components/atoms/Label/Label";
import { MultiSelect } from "@/components/atoms/Select/MultiSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/Select";
import type { PermissionAssignment } from "@/components/organisms/DataTable/tableData";

interface Permission {
  id: string;
  name: string;
}

interface EditAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment?: PermissionAssignment | null;
  onSave: (updatedAssignment: PermissionAssignment) => void;
}

const availableRoles = [
  "Administrator",
  "Data Uploader",
  "Data Validator",
  "Scientist",
  "Researcher",
];

const availablePermissions: Permission[] = [
  { id: "user-management", name: "User Management" },
  { id: "data-upload", name: "Data Upload" },
  { id: "query-builder", name: "Query Builder" },
  { id: "view-data", name: "View Data" },
  { id: "system-settings", name: "System Settings" },
  { id: "rbac", name: "RBAC" },
  { id: "templates", name: "Templates" },
  { id: "notifications", name: "Notifications" },
  { id: "data-validate", name: "Data Validate" },
];

export function EditAssignmentModal({
  open,
  onOpenChange,
  assignment,
  onSave,
}: EditAssignmentModalProps) {
  const [selectedRole, setSelectedRole] = React.useState(
    assignment?.role || ""
  );
  const [selectedPermissions, setSelectedPermissions] = React.useState<
    Permission[]
  >([]);

  React.useEffect(() => {
    if (assignment) {
      setSelectedRole(assignment.role);
      const permissions = assignment.permissions.map(
        (permName) =>
          availablePermissions.find((p) => p.name === permName) || {
            id: permName.toLowerCase().replace(/\s+/g, "-"),
            name: permName,
          }
      );
      setSelectedPermissions(permissions);
    }
  }, [assignment]);

  const handleSave = () => {
    if (assignment) {
      onSave({
        ...assignment,
        role: selectedRole,
        permissions: selectedPermissions.map((p) => p.name),
      });
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (assignment) {
      setSelectedRole(assignment.role);
      const permissions = assignment.permissions.map(
        (permName) =>
          availablePermissions.find((p) => p.name === permName) || {
            id: permName.toLowerCase().replace(/\s+/g, "-"),
            name: permName,
          }
      );
      setSelectedPermissions(permissions);
    }
    onOpenChange(false);
  };

  if (!assignment) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      trigger={<></>}
      title="Edit User Assignment"
      description={`Update role and permissions for ${assignment.user}`}
      className="max-w-2xl"
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="user-assignment-user" className="mb-2 block">
            User
          </Label>
          <Input
            id="user-assignment-user"
            type="text"
            value={assignment.user}
            readOnly
            size="lg"
            className="bg-muted text-muted-foreground cursor-not-allowed"
            tabIndex={-1}
          />
        </div>

        <div>
          <Label htmlFor="user-assignment-role" className="mb-2 block">
            Role
          </Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger
              id="user-assignment-role"
              className="w-full"
              size="lg"
            >
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="user-assignment-permissions" className="mb-2 block">
            Permissions
          </Label>
          <MultiSelect
            options={availablePermissions.map((p) => ({
              id: p.id,
              label: p.name,
            }))}
            value={selectedPermissions.map((p) => p.id)}
            onChange={(ids) => {
              setSelectedPermissions(
                availablePermissions.filter((p) => ids.includes(p.id))
              );
            }}
            placeholder="Select permissions"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Dialog>
  );
}
