/**
 * Generic paginated query hook for scalable list loading.
 * 
 * Usage:
 *   const { data, isLoading, hasMore, loadMore } = usePaginatedQuery({
 *     queryKey: ['clientes', therapistId],
 *     fetcher: (range) => dal.clientes.listClientes({ therapistId, limit: range.limit, offset: range.offset }),
 *     pageSize: 20,
 *     enabled: !!therapistId,
 *   });
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface PaginationRange {
  offset: number;
  limit: number;
}

export interface UsePaginatedQueryOptions<T> {
  queryKey: unknown[];
  fetcher: (range: PaginationRange) => Promise<T[]>;
  pageSize?: number;
  enabled?: boolean;
  staleTime?: number;
}

export function usePaginatedQuery<T>({
  queryKey,
  fetcher,
  pageSize = 20,
  enabled = true,
  staleTime = 5 * 60 * 1000,
}: UsePaginatedQueryOptions<T>) {
  const [page, setPage] = useState(0);

  const range: PaginationRange = useMemo(() => ({
    offset: page * pageSize,
    limit: pageSize,
  }), [page, pageSize]);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: [...queryKey, 'page', page],
    queryFn: () => fetcher(range),
    enabled,
    staleTime,
  });

  const hasMore = useMemo(() => (data?.length ?? 0) >= pageSize, [data, pageSize]);

  const loadMore = useCallback(() => {
    if (hasMore && !isFetching) {
      setPage((p) => p + 1);
    }
  }, [hasMore, isFetching]);

  const loadPrevious = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  const reset = useCallback(() => setPage(0), []);

  return {
    data: data ?? [],
    isLoading,
    isFetching,
    error,
    page,
    hasMore,
    hasPrevious: page > 0,
    loadMore,
    loadPrevious,
    reset,
    range,
  };
}
