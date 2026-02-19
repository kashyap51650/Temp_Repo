import { z } from "zod";

import { experimentNameSchema } from "./commonSchema";

export const CellLineStrainPairSchema = z.object({
  cell_line_id: z.number().optional(),
  mouse_strain_id: z.number().optional(),
});

// Schema for complete form data validation (with cellLineStrainPairs)
export const ModelStudyFormDataSchema = z.object({
  experimentName: experimentNameSchema,
  cellLineStrainPairs: z
    .array(CellLineStrainPairSchema)
    .min(1, "At least one cell line-strain pair is required")
    .superRefine((pairs, ctx) => {
      const hasValidPair = pairs.some(
        (pair) => pair.cell_line_id && pair.mouse_strain_id
      );
      const pairKeys = new Set<string>();

      function addDuplicateIssues(index: number) {
        ctx.addIssue({
          code: "custom",
          message: "This cell line and mouse strain combination already exists",
          path: [index, "cell_line_id"],
        });
        ctx.addIssue({
          code: "custom",
          message: "This cell line and mouse strain combination already exists",
          path: [index, "mouse_strain_id"],
        });
      }

      function addEmptyPairIssues(index: number) {
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

      function addPartialPairIssues({
        index,
        hasCellLine,
        hasMouseStrain,
      }: {
        index: number;
        hasCellLine: boolean;
        hasMouseStrain: boolean;
      }) {
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
      }

      for (const [index, pair] of pairs.entries()) {
        const hasCellLine = pair.cell_line_id !== undefined;
        const hasMouseStrain = pair.mouse_strain_id !== undefined;

        if (hasCellLine && hasMouseStrain) {
          const pairKey = `${pair.cell_line_id}-${pair.mouse_strain_id}`;
          if (pairKeys.has(pairKey)) {
            addDuplicateIssues(index);
            continue;
          }
          pairKeys.add(pairKey);
        }

        if (!hasCellLine && !hasMouseStrain) {
          if (!hasValidPair) {
            addEmptyPairIssues(index);
          }
          continue;
        }

        addPartialPairIssues({ index, hasCellLine, hasMouseStrain });
      }
    }),
  cellInjectionCounts: z
    .array(z.number().positive("Cell injection count must be valid"))
    .min(1, "At least one cell injection count is required"),
  vehicles: z
    .array(z.number().positive("Vehicle must be valid"))
    .min(1, "At least one vehicle is required"),
  injectionDate: z.union([z.instanceof(Date), z.string()]).refine((date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return !Number.isNaN(d.getTime());
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

  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return null;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
