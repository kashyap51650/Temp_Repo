import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { PERMISSIONS } from "@/lib/permissions";
import { parseSearchParams } from "@/lib/utils";

import DataValidation from "../components/data-validation/DataValidation";

type DataValidateSearch = {
  experimentId?: number;
};

export const Route = createFileRoute("/data-validate")({
  component: () => (
    <ProtectedRoute permissions={PERMISSIONS.DATA_VALIDATE.VIEW_DATA}>
      <DataValidation />
    </ProtectedRoute>
  ),
  validateSearch: (search: Record<string, unknown>): DataValidateSearch => {
    return {
      experimentId: search.experimentId
        ? parseSearchParams(search.experimentId)
        : undefined,
    };
  },
});
