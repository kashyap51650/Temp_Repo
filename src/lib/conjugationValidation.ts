import { z } from "zod";

export const ConjugationFormDataSchema = z.object({
  experimentName: z
    .string()
    .trim()
    .min(3, "Experiment name must be at least 3 characters")
    .max(255, "Experiment name must be at most 255 characters"),
});

export type ConjugationFormData = z.infer<typeof ConjugationFormDataSchema>;
