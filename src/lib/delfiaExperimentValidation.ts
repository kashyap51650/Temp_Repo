import { z } from "zod";

import { experimentNameSchema } from "./commonSchema";

export const DelfiaFormDataSchema = z.object({
  experimentName: experimentNameSchema,
});

export type DelfiaFormData = z.infer<typeof DelfiaFormDataSchema>;
