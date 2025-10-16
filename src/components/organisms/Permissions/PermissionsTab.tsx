import { ChevronDown, ChevronRight } from "lucide-react";
import * as React from "react";

import { Label } from "@/components/atoms";
import { Button } from "@/components/atoms/Button/Button";
import { Checkbox } from "@/components/atoms/Checkbox/Checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select/Select";

import { initialPermissions } from "./data";

export interface Permission {
  id: string;
  name: string;
  checked: boolean;
}

export interface PermissionGroup {
  id: string;
  name: string;
  expanded: boolean;
  checked: boolean;
  indeterminate: boolean;
  permissions: Permission[];
}

interface PermissionsTabProps {
  selectedRole?: string;
  onRoleChange: (role: string) => void;
  onSave: (permissions: PermissionGroup[]) => void;
  onCancel: () => void;
}

export function PermissionsTab({
  selectedRole = "Administrator",
  onRoleChange,
  onSave,
  onCancel,
}: PermissionsTabProps) {
  const [permissionGroups, setPermissionGroups] =
    React.useState<PermissionGroup[]>(initialPermissions);

  const toggleGroup = (groupId: string) => {
    setPermissionGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, expanded: !group.expanded } : group
      )
    );
  };

  const toggleGroupCheckbox = (groupId: string) => {
    setPermissionGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          const newChecked = !group.checked;
          return {
            ...group,
            checked: newChecked,
            indeterminate: false,
            permissions: group.permissions.map((permission) => ({
              ...permission,
              checked: newChecked,
            })),
          };
        }
        return group;
      })
    );
  };

  const togglePermission = (groupId: string, permissionId: string) => {
    setPermissionGroups((prev) =>
      prev.map((group) => {
        if (group.id === groupId) {
          const updatedPermissions = group.permissions.map((permission) =>
            permission.id === permissionId
              ? { ...permission, checked: !permission.checked }
              : permission
          );

          const checkedCount = updatedPermissions.filter(
            (p) => p.checked
          ).length;
          const totalCount = updatedPermissions.length;

          return {
            ...group,
            permissions: updatedPermissions,
            checked: checkedCount === totalCount,
            indeterminate: checkedCount > 0 && checkedCount < totalCount,
          };
        }
        return group;
      })
    );
  };

  const handleSave = () => {
    onSave(permissionGroups);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Configure Permissions for {selectedRole}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select modules and their specific permissions for this role
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Label>Select Role</Label>
          <Select value={selectedRole} onValueChange={onRoleChange}>
            <SelectTrigger className="w-48" size="lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Administrator">Administrator</SelectItem>
              <SelectItem value="Data Uploader">Data Uploader</SelectItem>
              <SelectItem value="Data Validator">Data Validator</SelectItem>
              <SelectItem value="Scientist">Scientist</SelectItem>
              <SelectItem value="Researcher">Researcher</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {permissionGroups.map((group) => (
          <div
            key={group.id}
            className="border border-border rounded-lg bg-background overflow-hidden"
          >
            <div className="flex items-center gap-2 bg-gray-50 py-3 px-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6"
                onClick={() => toggleGroup(group.id)}
              >
                {group.expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>

              <Checkbox
                checked={group.checked}
                ref={(el) => {
                  if (el)
                    (el as HTMLInputElement).indeterminate =
                      group.indeterminate;
                }}
                onCheckedChange={() => toggleGroupCheckbox(group.id)}
                className="mr-2"
              />

              <span className="font-medium text-foreground">{group.name}</span>
            </div>

            {group.expanded && (
              <div className="pl-9 space-y-2 py-3 border-t-border border-t">
                {group.permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={permission.checked}
                      onCheckedChange={() =>
                        togglePermission(group.id, permission.id)
                      }
                    />
                    <span className="text-sm text-foreground">
                      {permission.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" size={"lg"} onClick={onCancel}>
          Cancel
        </Button>
        <Button size={"lg"} onClick={handleSave}>
          Save Permissions
        </Button>
      </div>
    </div>
  );
}
