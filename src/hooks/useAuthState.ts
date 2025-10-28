import { useQueryClient } from "@tanstack/react-query";

import {
  AUTH_QUERY_KEYS,
  tokenUtils,
  useCurrentUser,
  useIsAuthenticated,
  useLogout,
} from "@/lib/auth";
import type { User } from "@/types/auth";

export const useAuthState = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useIsAuthenticated();
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useCurrentUser();
  const logoutMutation = useLogout();

  const cachedUser = queryClient.getQueryData<User>(AUTH_QUERY_KEYS.user);

  return {
    isAuthenticated,
    isLoading: isUserLoading,

    user: user || cachedUser || null,
    userError,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    token: tokenUtils.getAccessToken(),
    refreshToken: tokenUtils.getRefreshToken(),

    hasRole: (role: string) => {
      const currentUser = user || cachedUser;
      if (!currentUser) return false;

      // Add role checking logic based on your user structure
      if (role === "admin") return currentUser.is_superuser;
      // Add more role checks as needed
      return false;
    },

    clearAuthCache: () => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.auth });
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.user });
    },
  };
};
