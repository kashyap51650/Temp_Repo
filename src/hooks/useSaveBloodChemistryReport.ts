import { useMutation } from "@tanstack/react-query";

import { importExperimentDataApi } from "@/api";
import type { SaveBloodChemistryPDFPayload } from "@/types/bloodChemistry";

export const useSaveBloodChemistryReport = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      payload,
    }: {
      payload: SaveBloodChemistryPDFPayload;
    }) => await importExperimentDataApi.saveBloodChemistryData(payload),
  });

  return { saveBloodChemistryReport: mutate, isSaving: isPending };
};
