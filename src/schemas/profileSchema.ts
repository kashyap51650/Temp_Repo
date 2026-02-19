import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  profilePictureFile: z.file().optional(),
});

export type ProfileFormDataType = z.infer<typeof profileSchema>;
