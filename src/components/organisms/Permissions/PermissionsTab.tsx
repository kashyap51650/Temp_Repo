import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronRight } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import {
  Button,
  Checkbox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { usePermissions } from "@/hooks/usePermissions";
import { roleApi } from "@/lib/api";
import { REACT_QUERY_CONFIG } from "@/lib/constants";
import { PERMISSIONS } from "@/lib/permissions";
import type { ApiModule, ApiPermission } from "@/types/auth";

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
  onCancel: () => void;
}

export function PermissionsTab({
  selectedRole = "1",
  onRoleChange,
  onCancel,
}: Readonly<PermissionsTabProps>) {
  const [permissionGroups, setPermissionGroups] = React.useState<
    PermissionGroup[]
  >([]);
  const [originalPermissionGroups, setOriginalPermissionGroups] =
    React.useState<PermissionGroup[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);

  const { role, hasPermission } = usePermissions();
  const canEditPermission = hasPermission(
    PERMISSIONS.RBAC.ASSIGN_ROLE_PERMISSIONS
  );

  const { data: roles } = useQuery({
    queryKey: ["roles-dropdown"],
    queryFn: () => roleApi.getRolesDropdown(),
  });
  const rolesDropdownData =
    roles?.data?.map((val) => {
      return {
        ...val,
        id: val.id?.toString(),
      };
    }) || [];

  const queryClient = useQueryClient();
  const selectedRoleId = selectedRole;

  const {
    data: permissionsResponse,
    isLoading: permissionsLoading,
    error: permissionsError,
  } = useQuery({
    queryKey: ["permissions", selectedRoleId],
    queryFn: () => roleApi.getPermissions(selectedRoleId),
    enabled: !!selectedRoleId,
    retry: REACT_QUERY_CONFIG.RETRY.TWO,
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: (data: { roleId: string; permission_ids: number[] }) =>
      roleApi.updatePermissions(data.roleId, {
        permission_ids: data.permission_ids,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["permissions", selectedRoleId],
      });
      if (selectedRoleId === role?.id?.toString()) {
        queryClient.invalidateQueries({
          queryKey: ["my-permissions"],
        });
      }

      const roleName =
        rolesDropdownData.find((r) => r.id === selectedRoleId)?.name ||
        "this role";

      toast.success(`Permissions updated successfully for ${roleName}`);
    },
    onError: (error) => {
      console.error("Failed to update permissions:", error);
      toast.error(error.message || "Failed to update permissions");
    },
    onSettled: () => {
      setIsSaving(false);
    },
  });

  React.useEffect(() => {
    if (permissionsResponse?.data?.modules) {
      const transformedGroups: PermissionGroup[] = transformPermissionsData(
        permissionsResponse.data.modules
      );
      setPermissionGroups(transformedGroups);
      // Store original state for reverting changes
      setOriginalPermissionGroups(
        JSON.parse(JSON.stringify(transformedGroups))
      );
    }
  }, [permissionsResponse]);

  const transformPermissionsData = (
    modules: ApiModule[]
  ): PermissionGroup[] => {
    return modules.map((module) => {
      const permissions: Permission[] = module.permissions.map(
        (permission: ApiPermission) => ({
          id: permission.id.toString(),
          name: permission.name,
          checked: permission.is_assigned,
        })
      );

      const checkedCount = permissions.filter((p) => p.checked).length;
      const totalCount = permissions.length;

      return {
        id: module.id.toString(),
        name: module.name,
        expanded: false,
        checked: checkedCount === totalCount,
        indeterminate: checkedCount > 0 && checkedCount < totalCount,
        permissions,
      };
    });
  };

  const toggleGroup = (groupId: string) => {
    setPermissionGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, expanded: !group.expanded } : group
      )
    );
  };

  const updateGroupCheckState = (group: PermissionGroup): PermissionGroup => {
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
  };

  const toggleGroupCheckbox = (groupId: string) => {
    setPermissionGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? updateGroupCheckState(group) : group
      )
    );
  };

  const updatePermissionInGroup = (
    group: PermissionGroup,
    permissionId: string
  ): PermissionGroup => {
    const updatedPermissions = group.permissions.map((permission) =>
      permission.id === permissionId
        ? { ...permission, checked: !permission.checked }
        : permission
    );

    const checkedCount = updatedPermissions.filter((p) => p.checked).length;
    const totalCount = updatedPermissions.length;

    return {
      ...group,
      permissions: updatedPermissions,
      checked: checkedCount === totalCount,
      indeterminate: checkedCount > 0 && checkedCount < totalCount,
    };
  };

  const togglePermission = (groupId: string, permissionId: string) => {
    setPermissionGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? updatePermissionInGroup(group, permissionId)
          : group
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Collect all selected permission IDs
    const selectedPermissionIds: number[] = [];

    permissionGroups.forEach((group) => {
      group.permissions.forEach((permission) => {
        if (permission.checked) {
          selectedPermissionIds.push(Number.parseInt(permission.id, 10));
        }
      });
    });

    // Call the API with the selected role ID and permission IDs
    updatePermissionsMutation.mutate({
      roleId: selectedRoleId,
      permission_ids: selectedPermissionIds,
    });
  };

  const handleCancel = () => {
    // Revert all changes to original state
    setPermissionGroups(JSON.parse(JSON.stringify(originalPermissionGroups)));
    onCancel();
  };

  const selectedRoleName =
    rolesDropdownData.find((role) => role.id === selectedRoleId)?.name ||
    "Unknown Role";

  if (permissionsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Configure Permissions
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Loading permissions data...
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading permissions...</div>
        </div>
      </div>
    );
  }

  if (permissionsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Configure Permissions
            </h2>
            <p className="text-sm text-red-500 mt-1">
              Error loading permissions. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Configure Permissions for {selectedRoleName}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select modules and their specific permissions for this role
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Label>Select Role</Label>
          <Select value={selectedRoleId} onValueChange={onRoleChange}>
            <SelectTrigger className="w-48" size="lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {rolesDropdownData.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {permissionGroups.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No permissions data available for this role.
          </div>
        ) : (
          permissionGroups.map((group) => (
            <div
              key={group.id}
              className="border border-border rounded-lg bg-background overflow-hidden"
            >
              <div className="flex items-center gap-2 bg-gray-50 py-3 px-4">
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
                  disabled={!canEditPermission}
                />

                <span className="font-medium text-foreground">
                  {group.name}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({group.permissions.filter((p) => p.checked).length}/
                  {group.permissions.length} selected)
                </span>
              </div>

              {group.expanded && (
                <div className="px-4 py-3 space-y-3 border-t border-border">
                  {group.permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center gap-3 pl-8"
                    >
                      <Checkbox
                        checked={permission.checked}
                        onCheckedChange={() =>
                          togglePermission(group.id, permission.id)
                        }
                        disabled={!canEditPermission}
                      />
                      <span className="text-sm text-foreground flex-1">
                        {permission.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {canEditPermission && (
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" size="lg" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="lg" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Permissions"}
          </Button>
        </div>
      )}
    </div>
  );
}
