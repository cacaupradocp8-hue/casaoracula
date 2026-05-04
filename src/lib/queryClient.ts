import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * World-Class Query Client Configuration
 * - Aggressive stale-while-revalidate (5m)
 * - Automatic background refetching disabled to save battery/bandwidth
 * - Global error handling for telemetria and UX feedback
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Only show error for critical data or if specifically tagged
      if (query.meta?.errorMessage) {
        toast.error(query.meta.errorMessage as string);
      }
      console.error(`[query-error][${query.queryKey.join('/')}]`, error);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.errorMessage) {
        toast.error(mutation.meta.errorMessage as string);
      }
      console.error('[mutation-error]', error);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 15,    // 15 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Don't retry on 401, 403 or 404
        if (error?.status === 401 || error?.status === 403 || error?.status === 404) return false;
        return failureCount < 2;
      },
    },
  },
});
