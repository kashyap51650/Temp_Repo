import { z } from "zod";

export const DoseRangeFindingFormDataSchema = z.object({
  experimentName: z
    .string()
    .trim()
    .min(3, "Experiment name must be at least 3 characters")
    .max(255, "Experiment name must be at most 255 characters"),
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
