import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { PERMISSIONS } from "@/lib/permissions";

import DataValidation from "../components/data-validation/DataValidation";

export const Route = createFileRoute("/data-validate")({
  component: () => (
    <ProtectedRoute permissions={PERMISSIONS.DATA_VALIDATE.VIEW_DATA}>
      <DataValidation />
    </ProtectedRoute>
  ),
});
