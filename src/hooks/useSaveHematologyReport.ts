import { useMutation } from "@tanstack/react-query";

import { experimentDataApi } from "@/lib/api";
import type { SaveHematologyPDFPayload } from "@/types/hematology";

export const useSaveHematologyReport = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ payload }: { payload: SaveHematologyPDFPayload }) =>
      await experimentDataApi.saveHematologyData(payload),
  });

  return { saveHematologyReport: mutate, isSaving: isPending };
};
