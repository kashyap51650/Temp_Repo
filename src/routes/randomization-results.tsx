import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components/organisms/ProtectedRoute";
import { PERMISSIONS } from "@/lib/permissions";
import RandomizationResults from "@/pages/randomization-results";

export const Route = createFileRoute("/randomization-results")({
  component: () => (
    <ProtectedRoute permissions={PERMISSIONS.MOUSE.RANDOMIZATION}>
      <RandomizationResults />
    </ProtectedRoute>
  ),
  validateSearch: (search) => {
    return {
      experiment_id: Number(search.experiment_id),
      project_id: Number(search.project_id),
      mice_per_group: Number(search.mice_per_group),
      randomization_type: String(search.randomization_type),
    };
  },
});
