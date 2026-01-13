import { z } from "zod";

export const CellLineStrainPairSchema = z.object({
  cell_line_id: z.number().optional(),
  mouse_strain_id: z.number().optional(),
});

// Schema for complete form data validation (with cellLineStrainPairs)
export const ModelStudyFormDataSchema = z.object({
  experimentName: z
    .string()
    .trim()
    .min(3, "Experiment name must be at least 3 characters")
    .max(255, "Experiment name must be at most 255 characters"),
  cellLineStrainPairs: z
    .array(CellLineStrainPairSchema)
    .min(1, "At least one cell line-strain pair is required")
    .superRefine((pairs, ctx) => {
      const hasValidPair = pairs.some(
        (pair) => pair.cell_line_id && pair.mouse_strain_id
      );

      pairs.forEach((pair, index) => {
        const hasCellLine = !!pair.cell_line_id;
        const hasMouseStrain = !!pair.mouse_strain_id;

        if (!hasCellLine && !hasMouseStrain) {
          if (!hasValidPair) {
            ctx.addIssue({
              code: "custom",
              message: "Cell line must be selected",
              path: [index, "cell_line_id"],
            });
            ctx.addIssue({
              code: "custom",
              message: "Mouse strain must be selected",
              path: [index, "mouse_strain_id"],
            });
          }
          return;
        }

        if (hasCellLine && !hasMouseStrain) {
          ctx.addIssue({
            code: "custom",
            message: "Mouse strain must be selected",
            path: [index, "mouse_strain_id"],
          });
        } else if (hasMouseStrain && !hasCellLine) {
          ctx.addIssue({
            code: "custom",
            message: "Cell line must be selected",
            path: [index, "cell_line_id"],
          });
        }
      });
    }),
  cellInjectionCounts: z
    .array(z.number().positive("Cell injection count must be valid"))
    .min(1, "At least one cell injection count is required"),
  vehicles: z
    .array(z.number().positive("Vehicle must be valid"))
    .min(1, "At least one vehicle is required"),
  injectionDate: z.union([z.instanceof(Date), z.string()]).refine((date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return !isNaN(d.getTime());
  }, "Cell injection date is required"),
});

export type ModelStudyFormData = z.infer<typeof ModelStudyFormDataSchema>;

/**
 * Formats a Date object or string to ISO date string (YYYY-MM-DD)
 */
export function formatDateToISO(
  date: Date | string | undefined
): string | null {
  if (!date) return null;

  const d = typeof date === "string" ? new Date(date) : date;

  if (!(d instanceof Date) || isNaN(d.getTime())) return null;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
