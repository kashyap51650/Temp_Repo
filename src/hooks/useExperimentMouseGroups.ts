import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { modelStudyExperimentApi } from "@/api";
import { handleApiError } from "@/lib";
import type {
  ExperimentMouseGroupsWithDragIdType,
  ModelStudyExperimentMouseGroupsPayload,
} from "@/types/modelStudy";

interface UseExperimentMouseGroupsReturnType {
  mouseGroupData: ExperimentMouseGroupsWithDragIdType[];
  isLoading: boolean;
  error: string | null;
  mutationFn: (
    payload: ModelStudyExperimentMouseGroupsPayload
  ) => Promise<ExperimentMouseGroupsWithDragIdType[]>;
}

export default function useExperimentMouseGroups(): UseExperimentMouseGroupsReturnType {
  const { mutateAsync, data, isPending, error } = useMutation({
    mutationFn: async (payload: ModelStudyExperimentMouseGroupsPayload) => {
      try {
        if (!payload.experiment_id) {
          return [];
        }
        const response =
          await modelStudyExperimentApi.experimentMouseGroups(payload);

        const groups = response.data?.groups || [];

        const groupsWithDragData = groups.map((data, index) => {
          return {
            dragId: index + 1,
            ...data,
          };
        });

        return groupsWithDragData;
      } catch (error) {
        const errorMessage = handleApiError(
          error,
          "Failed to load mouse groups"
        );
        console.error("Error loading mouse groups:", error);
        toast.error("Failed to load mouse groups", {
          description: errorMessage,
        });
        throw error;
      }
    },
  });

  return {
    mutationFn: mutateAsync,
    mouseGroupData: data ?? [],
    isLoading: isPending,
    error: error?.message || null,
  };
}
