import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Infinite stale time
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days for persist
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
