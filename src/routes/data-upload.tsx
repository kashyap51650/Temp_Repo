import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/data-upload")({
  component: DataUploadComponent,
});

function DataUploadComponent() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Data Upload Page</h1>
      <p>Upload your data files here.</p>
    </div>
  );
}
