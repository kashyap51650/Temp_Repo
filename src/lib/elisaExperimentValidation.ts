import { z } from "zod";

import { experimentNameSchema } from "./commonSchema";

const KdValueSchema = z.object({
  kd_key: z.string().optional(),
  kd_value: z.string().optional(),
});

export const ElisaFormDataSchema = z.object({
  experimentName: experimentNameSchema,
  kd_values: z
    .array(KdValueSchema)
    .min(1, "At least one Kd key-value pair is required")
    .superRefine((pairs, ctx) => {
      const hasValidPair = pairs.some(
        (pair) => pair.kd_key?.trim() && pair.kd_value?.trim()
      );
      const pairKeys = new Set<string>();

      function addDuplicateIssues(index: number) {
        ctx.addIssue({
          code: "custom",
          message: "This key and value combination already exists",
          path: [index, "kd_key"],
        });
        ctx.addIssue({
          code: "custom",
          message: "This key and value combination already exists",
          path: [index, "kd_value"],
        });
      }

      function addEmptyPairIssues(index: number) {
        ctx.addIssue({
          code: "custom",
          message: "Key is required",
          path: [index, "kd_key"],
        });
        ctx.addIssue({
          code: "custom",
          message: "Value is required",
          path: [index, "kd_value"],
        });
      }

      function addPartialPairIssues({
        index,
        hasKey,
        hasValue,
      }: {
        index: number;
        hasKey: boolean;
        hasValue: boolean;
      }) {
        if (hasKey && !hasValue) {
          ctx.addIssue({
            code: "custom",
            message: "Value is required",
            path: [index, "kd_value"],
          });
        } else if (hasValue && !hasKey) {
          ctx.addIssue({
            code: "custom",
            message: "Key is required",
            path: [index, "kd_key"],
          });
        }
      }

      for (const [index, pair] of pairs.entries()) {
        const hasKey = pair.kd_key !== undefined && pair.kd_key.trim() !== "";
        const hasValue =
          pair.kd_value !== undefined && pair.kd_value.trim() !== "";

        if (hasKey && hasValue) {
          const pairKey = `${pair.kd_key}-${pair.kd_value}`;
          if (pairKeys.has(pairKey)) {
            addDuplicateIssues(index);
            continue;
          }
          pairKeys.add(pairKey);
        }

        if (!hasKey && !hasValue) {
          if (!hasValidPair) {
            addEmptyPairIssues(index);
          }
          continue;
        }

        addPartialPairIssues({ index, hasKey, hasValue });
      }
    }),
});

export type ElisaFormData = z.infer<typeof ElisaFormDataSchema>;
