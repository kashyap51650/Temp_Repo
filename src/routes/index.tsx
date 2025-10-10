import { createFileRoute } from "@tanstack/react-router";

import UserManagementPage from "@/pages/user-management/page";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  return <UserManagementPage />;
}
