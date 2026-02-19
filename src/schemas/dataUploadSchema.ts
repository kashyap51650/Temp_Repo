import { z } from "zod";

export const projectSchema = z.object({
  projectName: z.string().trim().min(1, "Project Name is required"),
  description: z.string().trim(),
});

export type ProjectFormDataType = z.infer<typeof projectSchema>;
