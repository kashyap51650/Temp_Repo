// src/components/organisms/ProtectedRoute.tsx
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { usePermissions } from "@/hooks/usePermissions";
import type { Permission } from "@/lib/permissions";

interface ProtectedRouteProps {
  /** Required permission(s) to access this route/component */
  permissions: Permission | Permission[];
  /** Require all permissions or any permission (default: 'any') */
  mode?: "any" | "all";
  /**
   * If provided, redirects to this path when unauthorized (route protection).
   * If not provided, shows fallback instead (component protection).
   * @default "/home" for route protection
   */
  redirectTo?: string | false;
  /**
   * Fallback component when permission is denied and redirectTo is false.
   * Only used when redirectTo is explicitly set to false.
   */
  fallback?: ReactNode;
  /** Children to render when authorized */
  children: ReactNode;
}

/**
 * Unified component for both route-level and component-level permission protection.
 *
 * @example Route Protection (redirects when unauthorized):
 * ```tsx
 * <ProtectedRoute permissions={PERMISSIONS.USER_MANAGEMENT.VIEW_USERS}>
 *   <UserManagementPage />
 * </ProtectedRoute>
 * ```
 *
 * @example Component Protection (shows fallback when unauthorized):
 * ```tsx
 * <ProtectedRoute
 *   permissions={PERMISSIONS.USER_MANAGEMENT.ADD_USER}
 *   redirectTo={false}
 *   fallback={<p>You cannot add users</p>}
 * >
 *   <Button>Add User</Button>
 * </ProtectedRoute>
 * ```
 *
 * @example Custom redirect path:
 * ```tsx
 * <ProtectedRoute
 *   permissions={PERMISSIONS.RBAC.VIEW_ROLES}
 *   redirectTo="/unauthorized"
 * >
 *   <RBACPage />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({
  permissions,
  mode = "any",
  redirectTo = "/home",
  fallback = null,
  children,
}: Readonly<ProtectedRouteProps>) {
  const { hasAnyPermission, hasAllPermissions, isLoading } = usePermissions();

  if (isLoading) {
    return null;
  }

  const isAuthorized = (() => {
    const permsArray = Array.isArray(permissions) ? permissions : [permissions];

    if (mode === "all") {
      return hasAllPermissions(permsArray);
    }

    return hasAnyPermission(permsArray);
  })();

  if (!isAuthorized) {
    // Component-level protection: show fallback
    if (redirectTo === false) {
      return <>{fallback}</>;
    }

    // Route-level protection: redirect to specified path
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
}

// Alias exports for semantic clarity
export { ProtectedRoute as ProtectedComponent };
