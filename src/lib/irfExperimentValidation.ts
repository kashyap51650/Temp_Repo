import { z } from "zod";

import { experimentNameSchema } from "./commonSchema";

export const IrfFormDataSchema = z.object({
  experimentName: experimentNameSchema,
});

export type IrfFormData = z.infer<typeof IrfFormDataSchema>;
