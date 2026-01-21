import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { PERMISSIONS } from "@/lib/permissions";
import UserManagementPage from "@/pages/user-management";

export const Route = createFileRoute("/user-management")({
  component: UserManagementComponent,
});

function UserManagementComponent() {
  return (
    <ProtectedRoute permissions={PERMISSIONS.USER_MANAGEMENT.VIEW_USERS}>
      <UserManagementPage />
    </ProtectedRoute>
  );
}
