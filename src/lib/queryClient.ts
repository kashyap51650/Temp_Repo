import { QueryClient } from "@tanstack/react-query";

// Query client configuration with sensible defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that unused/inactive cache data remains in memory
      staleTime: 1000 * 60 * 5, // 5 minutes

      // Time in milliseconds that cache data remains in memory after being unused
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly known as cacheTime)

      // Number of times to retry failed requests
      retry: 3,

      // Retry delay function (exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus (useful for keeping data fresh)
      refetchOnWindowFocus: false,

      // Refetch on reconnect
      refetchOnReconnect: true,

      // Refetch on mount if data is stale
      refetchOnMount: true,
    },
    mutations: {
      // Number of times to retry failed mutations
      retry: 1,

      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
});

// Export for use in components if needed
export default queryClient;
