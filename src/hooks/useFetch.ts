import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { roleApi, userApi } from "@/lib/api";
import type { RolesResponse, UserFilters, UsersResponse } from "@/types/auth";

const useFetch = <T>(key: string, fetchFunction: () => Promise<T>) => {
  return useQuery<T>({ queryKey: [key], queryFn: fetchFunction });
};

export const useUsers = (filters?: UserFilters) => {
  return useQuery<UsersResponse>({
    queryKey: ["users", filters],
    queryFn: () => userApi.getUsers(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useRoles = () => {
  return useQuery<RolesResponse>({
    queryKey: ["roles"],
    queryFn: () => roleApi.getRoles(),
    staleTime: 1000 * 60 * 10, // 10 minutes - roles change less frequently
    refetchOnWindowFocus: false,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: {
      email: string;
      first_name: string;
      last_name: string;
      role_id: number;
      account_expiry_date?: string | null;
    }) => userApi.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      userData,
    }: {
      userId: string;
      userData: {
        email: string;
        first_name: string;
        last_name: string;
        role_id: number;
        account_expiry_date?: string | null;
        status: string;
      };
    }) => userApi.updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: string;
      status: "active" | "inactive";
    }) => userApi.updateUserStatus(userId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export default useFetch;
