import { useMutation, useQueryClient } from "@tanstack/react-query";

import { roleApi } from "@/api";
import type { ApiResponse } from "@/lib/api";

interface AssignUserRolePayload {
  role_id: number;
  user_id: number;
}

export const useAssignUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, AssignUserRolePayload>({
    mutationFn: (payload) => roleApi.assignUserRole(payload),
    onSuccess: () => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["userAssignments"] });
      queryClient.invalidateQueries({ queryKey: ["usersWithRoles"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
