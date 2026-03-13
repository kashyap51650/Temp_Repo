import { z } from "zod";

/**
 * Builds the slot-size update validation schema.
 * Each group's slot size must be >= 1 and the total across all groups
 * must be >= totalMiceCount (the number of mice being moved).
 */
export const buildSlotSizeSchema = (totalMiceCount: number) => {
  return z.object({
    groups: z
      .array(
        z.object({
          groupId: z.number(),
          slotSize: z
            .number({ error: "Must be a number" })
            .int("Must be a whole number")
            .min(0, "Must be greater or equal to 0"),
        })
      )
      .superRefine((items, ctx) => {
        const sum = items.reduce((acc, item) => acc + item.slotSize, 0);
        if (sum < totalMiceCount) {
          ctx.addIssue({
            code: "custom",
            message: `Total slot size (${sum}) must be at least ${totalMiceCount}`,
          });
        }
      }),
  });
};

export type SlotSizeFormValues = z.infer<
  ReturnType<typeof buildSlotSizeSchema>
>;
