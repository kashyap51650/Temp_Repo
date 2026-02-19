import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

import { masterDataApi } from "@/api";
import { DEFAULT_PAGE_SIZE, REACT_QUERY_CONFIG } from "@/lib/constants";

export interface MasterDataItem {
  id: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface MasterDataFilters {
  page?: number;
  size?: number;
}

export interface UseMasterDataResult {
  data: {
    data: MasterDataItem[];
    page: number;
    size: number;
    total: number;
    pages: number;
  };
  loading: boolean;
  error: string | null;
  addItem: (item: Record<string, any>) => Promise<void>;
  updateItem: (id: number, item: Record<string, any>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  refetch: () => void;
  setFilters: (filters: MasterDataFilters) => void;
  filters: MasterDataFilters;
}

export function useMasterData(slug: string | null): UseMasterDataResult {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<MasterDataFilters>({
    page: 1,
    size: DEFAULT_PAGE_SIZE,
  });

  const {
    data = { data: [], page: 0, size: 0, total: 0, pages: 0 },
    isLoading: loading,
    error,
    refetch,
  } = useQuery<{
    data: MasterDataItem[];
    page: number;
    size: number;
    total: number;
    pages: number;
  }>({
    queryKey: ["master-data", slug, filters],
    queryFn: async () => {
      const response = await masterDataApi.getMasterData(slug!, {
        page: filters.page ?? 1,
        size: filters.size ?? DEFAULT_PAGE_SIZE,
      });
      return {
        data: response?.data?.items ?? [],
        page: response?.data?.pagination?.page ?? 0,
        size: response?.data?.pagination?.size ?? 0,
        total: response?.data?.pagination?.total ?? 0,
        pages: response?.data?.pagination?.pages ?? 0,
      };
    },
    enabled: !!slug,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.MEDIUM,
  });

  const addMutation = useMutation({
    mutationFn: ({ slug, item }: { slug: string; item: Record<string, any> }) =>
      masterDataApi.createMasterDataItem(slug, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master-data", slug] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      slug,
      id,
      item,
    }: {
      slug: string;
      id: number;
      item: Record<string, any>;
    }) => masterDataApi.updateMasterDataItem(slug, id, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master-data", slug] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ slug, id }: { slug: string; id: number }) =>
      masterDataApi.deleteMasterDataItem(slug, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["master-data", slug] });
    },
  });

  const addItem = async (item: Record<string, any>): Promise<void> => {
    if (!slug) throw new Error("No slug provided");
    await addMutation.mutateAsync({ slug, item });
  };

  const updateItem = async (
    id: number,
    item: Record<string, any>
  ): Promise<void> => {
    if (!slug) throw new Error("No slug provided");
    await updateMutation.mutateAsync({ slug, id, item });
  };

  const deleteItem = async (id: number): Promise<void> => {
    if (!slug) throw new Error("No slug provided");
    await deleteMutation.mutateAsync({ slug, id });
  };

  const handleSetFilters = useCallback((newFilters: MasterDataFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  return {
    data,
    loading:
      loading ||
      addMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error:
      error?.message ||
      addMutation.error?.message ||
      updateMutation.error?.message ||
      deleteMutation.error?.message ||
      null,
    addItem,
    updateItem,
    deleteItem,
    refetch,
    setFilters: handleSetFilters,
    filters,
  };
}
