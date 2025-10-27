import { createFileRoute } from "@tanstack/react-router";

import RBACRolesPage from "@/pages/rbac/roles";

export const Route = createFileRoute("/rbac")({
  component: RBACRolesPage,
});
