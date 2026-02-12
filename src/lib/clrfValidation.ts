import { z } from "zod";

import { experimentNameSchema } from "./commonSchema";

export const ClrfFormDataSchema = z.object({
  experimentName: experimentNameSchema,
});

export type ClrfFormData = z.infer<typeof ClrfFormDataSchema>;
