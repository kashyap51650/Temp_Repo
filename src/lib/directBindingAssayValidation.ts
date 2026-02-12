import { z } from "zod";

import { experimentNameSchema } from "./commonSchema";

export const DirectBindingAssayFormDataSchema = z.object({
  experimentName: experimentNameSchema,
});

export type DirectBindingAssayFormData = z.infer<
  typeof DirectBindingAssayFormDataSchema
>;
