import { z } from "zod";

import { experimentNameSchema } from "./commonSchema";

export const ConjugationFormDataSchema = z.object({
  experimentName: experimentNameSchema,
});

export type ConjugationFormData = z.infer<typeof ConjugationFormDataSchema>;
