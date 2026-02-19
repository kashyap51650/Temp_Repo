import { z } from "zod";

import { experimentNameSchema } from "./commonSchema";

export const DoseRangeFindingFormDataSchema = z.object({
  experimentName: experimentNameSchema,
  doses: z
    .array(z.number().positive("Dose must be valid"))
    .min(1, "At least one dose is required"),
  drugs: z
    .array(z.number().positive("Drug must be valid"))
    .min(1, "At least one drug is required"),
});

export type DoseRangeFindingFormData = z.infer<
  typeof DoseRangeFindingFormDataSchema
>;
