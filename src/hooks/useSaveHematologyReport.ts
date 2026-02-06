import { useMutation } from "@tanstack/react-query";

import { importExperimentDataApi } from "@/api";
import type { SaveHematologyPDFPayload } from "@/types/hematology";

export const useSaveHematologyReport = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ payload }: { payload: SaveHematologyPDFPayload }) =>
      await importExperimentDataApi.saveHematologyData(payload),
  });

  return { saveHematologyReport: mutate, isSaving: isPending };
};
