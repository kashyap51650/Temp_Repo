import { QueryClient } from "@tanstack/react-query";

import type { ApiError } from "./api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,

      // Time in milliseconds that cache data remains in memory after being unused
      gcTime: import.meta.env.VITE_REACT_QUERY_CACHE_TIME
        ? Number(import.meta.env.VITE_REACT_QUERY_CACHE_TIME)
        : 1000 * 60 * 10, // 10 minutes

      retry: (failureCount, error) => {
        const apiError = error as ApiError;
        if (apiError?.status === 401) {
          return false;
        }

        const maxRetries = import.meta.env.VITE_REACT_QUERY_RETRY
          ? Number(import.meta.env.VITE_REACT_QUERY_RETRY)
          : 3;

        return failureCount < maxRetries;
      },

      // Retry delay function (exponential backoff)
      retryDelay: (attemptIndex) =>
        Math.min(
          (import.meta.env.VITE_REACT_QUERY_RETRY_DELAY
            ? Number(import.meta.env.VITE_REACT_QUERY_RETRY_DELAY)
            : 1000) *
            2 ** attemptIndex,
          import.meta.env.VITE_REACT_QUERY_MAX_RETRY_DELAY
            ? Number(import.meta.env.VITE_REACT_QUERY_MAX_RETRY_DELAY)
            : 30000
        ),

      refetchOnWindowFocus: true,

      refetchOnReconnect: true,

      refetchOnMount: "always",
    },
    mutations: {
      retry: (failureCount, error) => {
        const apiError = error as ApiError;
        if (apiError?.status === 401) {
          return false;
        }

        return failureCount < 1;
      },

      // Retry delay for mutations
      retryDelay: import.meta.env.VITE_REACT_QUERY_RETRY_DELAY
        ? Number(import.meta.env.VITE_REACT_QUERY_RETRY_DELAY)
        : 1000,
    },
  },
});

export default queryClient;
