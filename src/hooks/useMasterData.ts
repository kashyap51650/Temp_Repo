import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { masterDataApi } from "@/lib/api";

export interface MasterDataItem {
  id: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface UseMasterDataResult {
  data: MasterDataItem[];
  loading: boolean;
  error: string | null;
  addItem: (item: Record<string, any>) => Promise<void>;
  updateItem: (id: number, item: Record<string, any>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  refetch: () => void;
}

export function useMasterData(slug: string | null): UseMasterDataResult {
  const queryClient = useQueryClient();

  const {
    data = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["master-data", slug],
    queryFn: async () => {
      const response = await masterDataApi.getMasterData(slug!);
      return response.data.items;
    },
    enabled: !!slug,
    staleTime:
      Number(import.meta.env.VITE_REACT_QUERY_STALE_TIME) || 5 * 60 * 1000,
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
  };
}
