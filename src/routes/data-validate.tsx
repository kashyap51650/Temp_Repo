import { createFileRoute } from "@tanstack/react-router";

import DataValidation from "../components/data-validation/DataValidation";

export const Route = createFileRoute("/data-validate")({
  component: DataValidation,
});
