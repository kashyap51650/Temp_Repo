import { createFileRoute } from "@tanstack/react-router";

import UserManagementPage from "@/pages/user-management";

export const Route = createFileRoute("/user-management")({
  component: UserManagementComponent,
});

function UserManagementComponent() {
  return <UserManagementPage />;
}
