import { useInfiniteQuery } from "@tanstack/react-query";

import { calliperingNotesCommentsApi } from "@/lib/api";
import { REACT_QUERY_CONFIG } from "@/lib/constants";
import type {
  CalliperingNotesListParams,
  CalliperNoteCommentItem,
} from "@/types/modelStudy";

interface UseCalliperingNoteCommentsProps {
  calliperMeasurementId: number;
  params?: Omit<CalliperingNotesListParams, "page">;
  enabled?: boolean;
}

export const useCalliperingNoteComments = ({
  calliperMeasurementId,
  params = { size: 10, desc: true },
  enabled = true,
}: UseCalliperingNoteCommentsProps) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["callipering-notes-comments", calliperMeasurementId, params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await calliperingNotesCommentsApi.getNotesComments({
        id: calliperMeasurementId,
        params: {
          ...params,
          page: pageParam,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination.has_next) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: enabled && !!calliperMeasurementId,
    staleTime: REACT_QUERY_CONFIG.STALE_TIME_OPTIONS.SHORT,
  });

  const comments: CalliperNoteCommentItem[] =
    data?.pages.flatMap((page) => page?.items ?? []) ?? [];

  const totalCount = data?.pages[0]?.pagination.total ?? 0;

  return {
    comments,
    totalCount,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading: status === "pending",
    isError: status === "error",
    refetch,
  };
};
