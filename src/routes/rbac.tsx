import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { PERMISSIONS } from "@/lib/permissions";
import RBACRolesPage from "@/pages/rbac/roles";

export const Route = createFileRoute("/rbac")({
  component: () => (
    <ProtectedRoute
      permissions={[
        PERMISSIONS.RBAC.VIEW_ROLES,
        PERMISSIONS.RBAC.VIEW_ROLE_PERMISSIONS,
        PERMISSIONS.RBAC.VIEW_USER_ASSIGNED_ROLES,
      ]}
      mode="any"
    >
      <RBACRolesPage />
    </ProtectedRoute>
  ),
});
