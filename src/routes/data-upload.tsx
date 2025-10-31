import { createFileRoute } from "@tanstack/react-router";

import DataUploadCommon from "@/components/data-upload/DataUploadCommon";

export const Route = createFileRoute("/data-upload")({
  component: DataUploadComponent,
});

function DataUploadComponent() {
  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold mb-2">Data Upload</h1>
      <p className="text-muted-foreground mb-6">
        Upload research datasets and files
      </p>
      <DataUploadCommon />
    </div>
  );
}
