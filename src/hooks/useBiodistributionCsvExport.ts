import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { biodistributionApi } from "@/api";
import { downloadBlobFile } from "@/lib/utils";
import type { BiodistributionGraphParams } from "@/types/biodistribution";

export type BiodistributionExportMode =
  | "uptake-by-group"
  | "uptake-by-group-mice"
  | "uptake-by-mice";

interface ExportBiodistributionCsvParams {
  experimentId: number;
  mode: BiodistributionExportMode;
  params?: BiodistributionGraphParams;
}

export function useBiodistributionCsvExport() {
  const mutation = useMutation({
    mutationFn: async ({
      experimentId,
      mode,
      params,
    }: ExportBiodistributionCsvParams) => {
      if (mode === "uptake-by-group-mice") {
        const data =
          await biodistributionApi.exportUptakeByGroupMiceCsvByExperiment(
            experimentId,
            params
          );
        return {
          data,
          filename: `Biodistribution-uptake-by-group-mice-${experimentId}.csv`,
        };
      }

      if (mode === "uptake-by-mice") {
        const data = await biodistributionApi.exportUptakeByMiceCsvByExperiment(
          experimentId,
          params
        );
        return {
          data,
          filename: `Biodistribution-uptake-by-mice-${experimentId}.csv`,
        };
      }

      const data = await biodistributionApi.exportUptakeByGroupCsvByExperiment(
        experimentId,
        params
      );
      return {
        data,
        filename: `Biodistribution-uptake-by-group-${experimentId}.csv`,
      };
    },
    onSuccess: ({ data, filename }) => {
      downloadBlobFile(data, filename);
      toast.success("CSV exported successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to export CSV");
    },
  });

  return {
    exportCsv: mutation.mutate,
    isExportingCsv: mutation.isPending,
    exportError: mutation.error,
  };
}
