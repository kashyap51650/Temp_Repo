import { useMutation } from "@tanstack/react-query";

import { experimentDataApi } from "@/lib/api";
import type { SaveBloodChemistryPDFPayload } from "@/types/bloodChemistry";

export const useSaveBloodChemistryReport = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      payload,
    }: {
      payload: SaveBloodChemistryPDFPayload;
    }) => await experimentDataApi.saveBloodChemistryData(payload),
  });

  return { saveBloodChemistryReport: mutate, isSaving: isPending };
};
