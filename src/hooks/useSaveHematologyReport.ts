import { useMutation } from "@tanstack/react-query";

import { importExperimentDataApi } from "@/api";
import { type StudyType as ExperimentStudyType } from "@/lib/constants";
import type { SaveHematologyPDFPayload } from "@/types/hematology";

interface UseSaveHematologyReportProps {
  experimentStudyType: ExperimentStudyType;
}

export const useSaveHematologyReport = ({
  experimentStudyType,
}: UseSaveHematologyReportProps) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ payload }: { payload: SaveHematologyPDFPayload }) =>
      await importExperimentDataApi.saveHematologyData(
        payload,
        experimentStudyType
      ),
  });

  return { saveHematologyReport: mutate, isSaving: isPending };
};
