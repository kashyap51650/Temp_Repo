import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronRight } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { roleApi } from "@/api";
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
  children?: PermissionGroup[]; // Nested permission groups
}

interface PermissionsTabProps {
  selectedRole?: string;
  onRoleChange: (role: string) => void;
  onCancel?: () => void;
}

type PermissionGroupItemProps = Readonly<{
  group: PermissionGroup;
  level: number;
  toggleGroup: (groupId: string) => void;
  toggleGroupCheckbox: (groupId: string) => void;
  togglePermission: (groupId: string, permissionId: string) => void;
  canEditPermission: boolean;
}>;

const getTotalSelectedCount = (g: PermissionGroup): number => {
  let count = g.permissions.filter((p) => p.checked).length;
  if (g.children && g.children.length > 0) {
    for (const child of g.children) {
      count += getTotalSelectedCount(child);
    }
  }
  return count;
};

const getTotalPermissionsCount = (g: PermissionGroup): number => {
  let count = g.permissions.length;
  if (g.children && g.children.length > 0) {
    for (const child of g.children) {
      count += getTotalPermissionsCount(child);
    }
  }
  return count;
};

function PermissionGroupItem({
  group,
  level,
  toggleGroup,
  toggleGroupCheckbox,
  togglePermission,
  canEditPermission,
}: PermissionGroupItemProps) {
  const hasContent =
    group.permissions.length > 0 ||
    (group.children && group.children.length > 0);

  return (
    <div
      className="border border-border rounded-lg bg-background overflow-hidden"
      style={{ marginLeft: level > 0 ? `${level * 1.5}rem` : "0" }}
    >
      <div className="flex items-center gap-2 bg-gray-50 py-3 px-4">
        {hasContent && (
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
        )}

        <Checkbox
          checked={group.checked}
          ref={(el) => {
            if (el)
              (el as HTMLInputElement).indeterminate = group.indeterminate;
          }}
          onCheckedChange={() => toggleGroupCheckbox(group.id)}
          className="mr-2"
          disabled={!canEditPermission}
        />

        <span className="font-medium text-foreground">{group.name}</span>
        <span className="text-sm text-muted-foreground ml-2">
          ({getTotalSelectedCount(group)}/{getTotalPermissionsCount(group)}{" "}
          selected)
        </span>
      </div>

      {group.expanded && (
        <div className="border-t border-border">
          {/* Render permissions */}
          {group.permissions.length > 0 && (
            <div className="px-4 py-3 space-y-3">
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

          {/* Render child groups recursively */}
          {group.children && group.children.length > 0 && (
            <div className="px-4 py-3 space-y-3">
              {group.children.map((childGroup) => (
                <PermissionGroupItem
                  key={childGroup.id}
                  group={childGroup}
                  level={level + 1}
                  toggleGroup={toggleGroup}
                  toggleGroupCheckbox={toggleGroupCheckbox}
                  togglePermission={togglePermission}
                  canEditPermission={canEditPermission}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
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
      setOriginalPermissionGroups(structuredClone(transformedGroups));
    }
  }, [permissionsResponse]);

  // Shared helper to calculate checked/indeterminate state for a group
  const calculateGroupState = (
    group: Omit<PermissionGroup, "checked" | "indeterminate"> & {
      checked?: boolean;
      indeterminate?: boolean;
    }
  ): PermissionGroup => {
    // First, recalculate all children recursively
    const updatedChildren =
      group.children?.map((child) => calculateGroupState(child)) || [];

    // Count checked permissions in this group
    const checkedPermissionsCount = group.permissions.filter(
      (p) => p.checked
    ).length;
    const totalPermissionsCount = group.permissions.length;

    // Count checked children
    const checkedChildrenCount = updatedChildren.filter(
      (child) => child.checked
    ).length;
    const totalChildrenCount = updatedChildren.length;

    // Determine if there are any indeterminate children
    const hasIndeterminateChildren = updatedChildren.some(
      (child) => child.indeterminate
    );

    // Calculate total checked and total items (permissions + children)
    const totalChecked = checkedPermissionsCount + checkedChildrenCount;
    const totalItems = totalPermissionsCount + totalChildrenCount;

    // Determine checked state
    const isFullyChecked = totalChecked === totalItems && totalItems > 0;
    const isPartiallyChecked = totalChecked > 0 && totalChecked < totalItems;

    return {
      ...group,
      checked: isFullyChecked,
      indeterminate: isPartiallyChecked || hasIndeterminateChildren,
      children: updatedChildren,
    };
  };

  const transformPermissionsData = (
    modules: ApiModule[]
  ): PermissionGroup[] => {
    return modules.map((module) => {
      let childGroups: PermissionGroup[] = [];
      if (module.children && module.children.length > 0) {
        childGroups = transformPermissionsData(module.children);
      }
      const permissions: Permission[] = module.permissions.map(
        (permission: ApiPermission) => ({
          id: permission.id.toString(),
          name: permission.name,
          checked: permission.is_assigned,
        })
      );
      // Use shared state calculation
      return calculateGroupState({
        id: module.id.toString(),
        name: module.name,
        expanded: false,
        permissions,
        children: childGroups,
      });
    });
  };

  const toggleGroup = (groupId: string) => {
    const toggleInGroup = (groups: PermissionGroup[]): PermissionGroup[] => {
      return groups.map((group) => {
        if (group.id === groupId) {
          return { ...group, expanded: !group.expanded };
        }
        if (group.children && group.children.length > 0) {
          return { ...group, children: toggleInGroup(group.children) };
        }
        return group;
      });
    };
    setPermissionGroups((prev) => toggleInGroup(prev));
  };

  const updateGroupCheckState = (group: PermissionGroup): PermissionGroup => {
    const newChecked = !group.checked;

    // Recursively update children if they exist
    const updatedChildren = group.children?.map((child) =>
      updateGroupCheckStateRecursive(child, newChecked)
    );

    return {
      ...group,
      checked: newChecked,
      indeterminate: false,
      permissions: group.permissions.map((permission) => ({
        ...permission,
        checked: newChecked,
      })),
      children: updatedChildren,
    };
  };

  const updateGroupCheckStateRecursive = (
    group: PermissionGroup,
    newChecked: boolean
  ): PermissionGroup => {
    // Recursively update children if they exist
    const updatedChildren = group.children?.map((child) =>
      updateGroupCheckStateRecursive(child, newChecked)
    );

    return {
      ...group,
      checked: newChecked,
      indeterminate: false,
      permissions: group.permissions.map((permission) => ({
        ...permission,
        checked: newChecked,
      })),
      children: updatedChildren,
    };
  };

  const toggleGroupCheckbox = (groupId: string) => {
    const toggleInGroup = (groups: PermissionGroup[]): PermissionGroup[] => {
      return groups.map((group) => {
        if (group.id === groupId) {
          return updateGroupCheckState(group);
        }
        if (group.children && group.children.length > 0) {
          const updatedGroup = {
            ...group,
            children: toggleInGroup(group.children),
          };
          // Recalculate parent state after child changes
          return calculateGroupState(updatedGroup);
        }
        return group;
      });
    };
    setPermissionGroups((prev) => {
      const updated = toggleInGroup(prev);
      // Recalculate all parent states from root
      return updated.map((group) => calculateGroupState(group));
    });
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
    const toggleInGroup = (groups: PermissionGroup[]): PermissionGroup[] => {
      return groups.map((group) => {
        if (group.id === groupId) {
          return updatePermissionInGroup(group, permissionId);
        }
        if (group.children && group.children.length > 0) {
          const updatedGroup = {
            ...group,
            children: toggleInGroup(group.children),
          };
          // Recalculate parent state after child changes
          return calculateGroupState(updatedGroup);
        }
        return group;
      });
    };
    setPermissionGroups((prev) => {
      const updated = toggleInGroup(prev);
      // Recalculate all parent states from root
      return updated.map((group) => calculateGroupState(group));
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Collect all selected permission IDs recursively
    const selectedPermissionIds: number[] = [];

    const collectPermissions = (groups: PermissionGroup[]) => {
      for (const group of groups) {
        for (const permission of group.permissions) {
          if (permission.checked) {
            selectedPermissionIds.push(Number.parseInt(permission.id, 10));
          }
        }
        if (group.children && group.children.length > 0) {
          collectPermissions(group.children);
        }
      }
    };

    collectPermissions(permissionGroups);

    // Call the API with the selected role ID and permission IDs
    updatePermissionsMutation.mutate({
      roleId: selectedRoleId,
      permission_ids: selectedPermissionIds,
    });
  };

  const handleCancel = () => {
    // Revert all changes to original state
    setPermissionGroups(structuredClone(originalPermissionGroups));
    onCancel?.();
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
            <PermissionGroupItem
              key={group.id}
              group={group}
              level={0}
              toggleGroup={toggleGroup}
              toggleGroupCheckbox={toggleGroupCheckbox}
              togglePermission={togglePermission}
              canEditPermission={canEditPermission}
            />
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
