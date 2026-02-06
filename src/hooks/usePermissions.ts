import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { permissionsApi } from "@/api";
import type { Permission } from "@/lib/permissions";
import type { Role } from "@/types/permissions";

interface UsePermissionsResult {
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  userPermissions: string[];
  role: Role | undefined;
  isLoading: boolean;
}

export function usePermissions(): UsePermissionsResult {
  const { data, isLoading } = useQuery({
    queryKey: ["my-permissions"],
    queryFn: () => permissionsApi.getMyPermissions(),
    staleTime: Infinity, // data is NEVER stale
    gcTime: Infinity, // data is NEVER garbage collected
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const user = data?.user;
  const role = data?.roles?.[0];

  const userPermissions = useMemo(() => {
    if (!data?.roles) return [];

    const permissions: string[] = [];
    for (const role of data.roles) {
      if (role.assigned_permissions) {
        for (const perm of role.assigned_permissions) {
          if (!permissions.includes(perm.resource_key)) {
            permissions.push(perm.resource_key);
          }
        }
      }
    }

    return permissions;
  }, [data]);

  const hasPermission = (permission: Permission): boolean => {
    // Superuser has all permissions
    if (user?.is_superuser) return true;
    return userPermissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (user?.is_superuser) return true;

    if (permissions.length === 0) return false;

    return permissions.some((perm) => userPermissions.includes(perm));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (user?.is_superuser) return true;

    if (permissions.length === 0) return false;

    return permissions.every((perm) => userPermissions.includes(perm));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userPermissions,
    role,
    isLoading,
  };
}
