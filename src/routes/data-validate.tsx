import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/data-validate")({
  component: DataValidateComponent,
});

function DataValidateComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Data Validate Page</h1>
      <p>Validate your data integrity here.</p>
    </div>
  );
}
