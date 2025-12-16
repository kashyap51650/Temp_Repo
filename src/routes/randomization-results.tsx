import { createFileRoute } from "@tanstack/react-router";

import RandomizationResults from "@/pages/randomization-results";

export const Route = createFileRoute("/randomization-results")({
  component: () => <RandomizationResults />,
  validateSearch: (search) => {
    return {
      experiment_id: Number(search.experiment_id),
      mice_per_group: Number(search.mice_per_group),
      randomization_type: String(search.randomization_type),
    };
  },
});
