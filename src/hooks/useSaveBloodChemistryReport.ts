import { useMutation } from "@tanstack/react-query";

import { importExperimentDataApi } from "@/api";
import { type StudyType as ExperimentStudyType } from "@/lib/constants";
import type { SaveBloodChemistryPDFPayload } from "@/types/bloodChemistry";

interface UseSaveBloodChemistryReportProps {
  experimentStudyType: ExperimentStudyType;
}

export const useSaveBloodChemistryReport = ({
  experimentStudyType,
}: UseSaveBloodChemistryReportProps) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      payload,
    }: {
      payload: SaveBloodChemistryPDFPayload;
    }) =>
      await importExperimentDataApi.saveBloodChemistryData(
        payload,
        experimentStudyType
      ),
  });

  return { saveBloodChemistryReport: mutate, isSaving: isPending };
};
