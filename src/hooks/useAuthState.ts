import { useQueryClient } from "@tanstack/react-query";

import {
  AUTH_QUERY_KEYS,
  useAuthTokens,
  useCurrentUser,
  useIsAuthenticated,
  useLogout,
} from "@/lib/auth";
import type { User } from "@/types/auth";

export const useAuthState = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useIsAuthenticated();
  const { accessToken, refreshToken } = useAuthTokens();
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

    user: user ?? cachedUser ?? null,
    userError,

    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    token: accessToken,
    refreshToken: refreshToken,

    clearAuthCache: () => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.auth });
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.user });
    },
  };
};
