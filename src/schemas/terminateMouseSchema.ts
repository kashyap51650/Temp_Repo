import { z } from "zod";

export const terminateMouseSchema = z.object({
  reason: z
    .string()
    .max(500, "Reason must be 500 characters or less")
    .optional(),
});

export type TerminateMouseFormData = z.infer<typeof terminateMouseSchema>;
