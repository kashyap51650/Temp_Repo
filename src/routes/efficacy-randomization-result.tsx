import { createFileRoute } from "@tanstack/react-router";

import { ProtectedRoute } from "@/components";
import { PERMISSIONS } from "@/lib/permissions";
import { parseSearchParams } from "@/lib/utils";
import EfficacyRandomizationResultPage from "@/pages/efficacy-randomization-result";

type EfficacyRandomizationResultSearch = {
  experiment_id?: number;
};

function EfficacyRandomizationResultRouteComponent() {
  const { experiment_id } = Route.useSearch();

  return (
    <ProtectedRoute permissions={PERMISSIONS.MOUSE.RANDOMIZATION}>
      {experiment_id === undefined ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-sm text-muted-foreground">
            No experiment ID provided. Please provide an experiment ID to view
            the randomization results.
          </p>
        </div>
      ) : (
        <EfficacyRandomizationResultPage experimentId={experiment_id} />
      )}
    </ProtectedRoute>
  );
}

export const Route = createFileRoute("/efficacy-randomization-result")({
  component: EfficacyRandomizationResultRouteComponent,
  validateSearch: (
    search: Record<string, unknown>
  ): EfficacyRandomizationResultSearch => {
    return {
      experiment_id: search.experiment_id
        ? parseSearchParams(search.experiment_id)
        : undefined,
    };
  },
});
