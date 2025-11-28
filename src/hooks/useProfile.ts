import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authApi } from "../lib/api";

export interface UserProfile {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_picture: string;
  status: string;
  is_email_verified: boolean;
  last_login_at: string;
  must_change_password: boolean;
  roles: any[];
}

export function useProfile() {
  const queryClient = useQueryClient();

  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: authApi.getProfile,
    staleTime:
      Number(import.meta.env.VITE_REACT_QUERY_STALE_TIME) || 5 * 60 * 1000,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: {
      first_name: string;
      last_name: string;
      profile_picture?: File;
    }) => authApi.updateProfile(profileData),
    onSuccess: (response, variables) => {
      queryClient.setQueryData(["profile"], (oldData: any) => {
        if (oldData?.data) {
          const updatedData = {
            ...oldData.data,
            first_name: variables.first_name,
            last_name: variables.last_name,
            full_name: `${variables.first_name} ${variables.last_name}`,
          };

          if (response && typeof response === "object" && "data" in response) {
            const responseData = response.data as any;
            if (responseData?.profile_picture) {
              updatedData.profile_picture = responseData.profile_picture;
            }
          }

          return {
            ...oldData,
            data: updatedData,
          };
        }
        return oldData;
      });

      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    profile: profileData?.data,
    isLoading,
    error,
    refetch,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
  };
}
