import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rbac")({
  component: RBACComponent,
});

function RBACComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">RBAC Page</h1>
      <p>Role-Based Access Control management.</p>
    </div>
  );
}
