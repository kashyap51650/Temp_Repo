import { z } from "zod";

import { experimentNameSchema } from "./commonSchema";

export const BiodExperimentFormDataSchema = z.object({
  experimentName: experimentNameSchema,
  isotopeId: z.number().min(1, "At least one isotope is required"),
  cellLineIds: z.array(z.number()).min(1, "At least one cell line is required"),
});

export type BiodExperimentFormData = z.infer<
  typeof BiodExperimentFormDataSchema
>;
