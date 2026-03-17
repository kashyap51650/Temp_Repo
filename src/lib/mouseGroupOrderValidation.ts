import { z } from "zod";

export const ModelStudyGroupOrderSchema = z.object({
  groups: z.array(
    z.object({
      dragId: z.number(),
      groupId: z.number(),
      groupName: z.string(),
      slotSize: z
        .number({ error: "Must be a number" })
        .int("Must be a whole number")
        .min(1, "Must be greater or equal to 1"),
    })
  ),
});

export type ModelStudyGroupOrderSchemaData = z.infer<
  typeof ModelStudyGroupOrderSchema
>;
