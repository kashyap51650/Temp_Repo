import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { projectApi } from "@/lib/api";

export function useUpdateProjectStatus({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      status,
    }: {
      projectId: number;
      status: string;
    }) => projectApi.updateProjectStatus(projectId, status),
    onSuccess: () => {
      toast.success("Project status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["projectsList"] });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to update project status");
      if (onError) {
        onError(error);
      }
    },
  });
}
