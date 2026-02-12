import { z } from "zod";

import { experimentNameSchema } from "./commonSchema";

export const SaturationBindingFormDataSchema = z.object({
  experimentName: experimentNameSchema,
});

export type SaturationBindingFormData = z.infer<
  typeof SaturationBindingFormDataSchema
>;
