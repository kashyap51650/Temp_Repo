import { z } from "zod";

export const ReceptorQuantificationFormDataSchema = z.object({
  experimentName: z
    .string()
    .trim()
    .min(3, "Experiment name must be at least 3 characters")
    .max(255, "Experiment name must be at most 255 characters"),
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
