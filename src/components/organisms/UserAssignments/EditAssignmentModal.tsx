import * as React from "react";

import { Button } from "@/components/atoms/Button/Button";
import { Dialog } from "@/components/atoms/Dialog/Dialog";
import { Input } from "@/components/atoms/Input/Input";
import { Label } from "@/components/atoms/Label/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/Select";
import type { PermissionAssignment } from "@/components/organisms/DataTable/tableData";
import { handleApiError, roleApi } from "@/lib/api";
import type { Role, UserAssignment } from "@/types/auth";

interface EditAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment?: PermissionAssignment | null;
  userAssignment?: UserAssignment | null;
  roles?: Role[]; // Add roles from API
  onSave: (updatedAssignment: PermissionAssignment) => void;
}

export function EditAssignmentModal({
  open,
  onOpenChange,
  assignment,
  userAssignment,
  roles,
  onSave,
}: EditAssignmentModalProps) {
  const [selectedRole, setSelectedRole] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const allApiPermissions = React.useMemo(() => {
    if (!userAssignment?.roles) return [];

    const primaryRole =
      userAssignment.roles.find((role) => role.is_primary) ||
      userAssignment.roles[0];
    return primaryRole
      ? primaryRole.assigned_permissions.map((p) => ({
          id: p.id.toString(),
          name: p.name,
        }))
      : [];
  }, [userAssignment]);

  const roleNameToIdMap = React.useMemo(() => {
    if (!roles || roles.length === 0) return {};

    return roles.reduce(
      (map, role) => {
        map[role.name] = role.id;
        return map;
      },
      {} as Record<string, number>
    );
  }, [roles]);

  const availableRoles = React.useMemo(() => {
    return roles ? roles.map((role) => role.name) : [];
  }, [roles]);

  React.useEffect(() => {
    if (assignment && userAssignment) {
      const primaryRole =
        userAssignment.roles.find((role) => role.is_primary) ||
        userAssignment.roles[0];
      setSelectedRole(primaryRole ? primaryRole.name : "");
      setError(null);
    }
  }, [assignment, userAssignment]);

  const handleSave = async () => {
    if (!assignment || !userAssignment || !selectedRole) return;

    setIsLoading(true);
    setError(null);

    try {
      const roleId =
        roleNameToIdMap[selectedRole as keyof typeof roleNameToIdMap];

      if (!roleId) {
        throw new Error("Invalid role selected");
      }

      await roleApi.assignUserRole({
        role_id: roleId,
        user_id: userAssignment.user.id,
      });

      onSave({
        ...assignment,
        role: selectedRole,
        permissions: [],
      });

      onOpenChange(false);
    } catch (err) {
      const errorMessage = handleApiError(err, "Failed to update user role");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (assignment && userAssignment) {
      const primaryRole =
        userAssignment.roles.find((role) => role.is_primary) ||
        userAssignment.roles[0];
      setSelectedRole(primaryRole ? primaryRole.name : "");
      setError(null);
    }
    onOpenChange(false);
  };

  if (!assignment || !userAssignment) return null;

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
          <div className="space-y-2">
            {allApiPermissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 bg-muted rounded-lg max-h-60 overflow-y-auto">
                {allApiPermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="text-sm px-3 py-2 bg-background rounded border text-gray-700"
                  >
                    {permission.name}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-muted rounded-lg text-gray-500 text-sm">
                No permissions assigned
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">
              Total: {allApiPermissions.length} permission(s)
            </div>
          </div>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            Save Changes
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
