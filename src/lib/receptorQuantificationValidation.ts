import { z } from "zod";

import { experimentNameSchema } from "./commonSchema";

export const ReceptorQuantificationFormDataSchema = z.object({
  experimentName: experimentNameSchema,
  cellLine: z
    .array(z.number("Cell line must be valid"))
    .min(1, "At least one cell line is required"),
  primaryAntibody: z.number("Primary Antibody must be valid"),
  secondaryAntibody: z.number().optional(),
  noOfReceptors: z
    .string()
    .trim()
    .min(1, "Number of receptors is required")
    .refine(
      (data) => {
        return Number(data) > 0;
      },
      {
        message: `Number of receptors must be greater than 0`,
      }
    ),
});

export type ReceptorQuantificationFormData = z.infer<
  typeof ReceptorQuantificationFormDataSchema
>;
