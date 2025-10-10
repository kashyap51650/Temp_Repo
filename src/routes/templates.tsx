import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/templates")({
  component: TemplatesComponent,
});

function TemplatesComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Templates Page</h1>
      <p>Manage your templates here.</p>
    </div>
  );
}
