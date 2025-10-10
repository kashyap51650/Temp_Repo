import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: SettingsComponent,
});

function SettingsComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings Page</h1>
      <p>Configure your application settings here.</p>
    </div>
  );
}
