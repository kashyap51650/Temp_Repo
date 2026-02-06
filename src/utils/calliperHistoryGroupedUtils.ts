import type { CaliperHistoryMeasurement } from "@/api";

export function getSortedDeliveryIds(
  groupMeasurements: Record<string, Record<string, CaliperHistoryMeasurement>>
): string[] {
  return Object.keys(groupMeasurements).sort((a, b) => {
    const numA = Number.parseInt(a.split("-").pop() || "0", 10);
    const numB = Number.parseInt(b.split("-").pop() || "0", 10);
    return numA - numB;
  });
}
