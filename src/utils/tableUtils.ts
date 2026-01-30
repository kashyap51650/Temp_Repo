import type { VariantProps } from "class-variance-authority";

import { badgeVariants } from "@/components/atoms/Badge/Badge";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export function getStatusBadgeVariant(status: string): BadgeVariant {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "approved") return "default";
  if (normalizedStatus === "rejected") return "destructive";
  return "secondary";
}

export function getStatusBadgeClassName(status: string): string {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "approved") {
    return "bg-green-100 text-green-700 border-green-200";
  }
  if (normalizedStatus === "rejected") {
    return "bg-red-100 text-red-700 border-red-200";
  }
  return "bg-yellow-100 text-yellow-700 border-yellow-200";
}

export const getWeightSheetColumnColor = ({
  isFlagged,
  percentageChange,
}: {
  isFlagged?: boolean;
  percentageChange?: number;
}) => {
  if (isFlagged !== undefined && percentageChange !== undefined) {
    if (isFlagged) {
      if (percentageChange <= -10 && percentageChange >= -20) {
        return "text-yellow-600 font-semibold";
      } else if (percentageChange < -20) {
        return "text-red-600 font-semibold";
      }
    }
  }

  return "";
};
