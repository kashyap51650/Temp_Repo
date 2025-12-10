import { createLazyFileRoute } from "@tanstack/react-router";

import RandomizationResults from "@/pages/randomization-results";

export const Route = createLazyFileRoute("/randomization-results")({
  component: () => <RandomizationResults />,
});
