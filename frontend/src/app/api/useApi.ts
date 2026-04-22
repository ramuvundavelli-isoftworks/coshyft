/**
 * useApi Hook
 * Generic data fetching hook with loading, error, and refetch states.
 * Works seamlessly with both mock and live API modes.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApi(() => emissionsApi.getSummary());
 *   const { data, execute } = useApiMutation((params) => commuteApi.logCommute(params));
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import type { ApiResponse } from './client';

/** Returns true for error codes that warrant a redirect to the error page */
function isServerError(code?: string): boolean {
  if (!code) return false;
  return (
    code === 'NETWORK_ERROR' ||
    /^HTTP_5\d\d$/.test(code)
  );
}

interface UseApiOptions {
  /** Skip initial fetch (useful for conditional loading) */
  skip?: boolean;
  /** Dependencies that trigger refetch (like useEffect deps) */
  deps?: any[];
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching data from API on mount.
 * Automatically handles loading states and errors.
 */
export function useApi<T>(
  fetcher: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {},
): UseApiReturn<T> {
  const { skip = false, deps = [] } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    if (skip) return;
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      if (!mountedRef.current) return;

      if (result.success && result.data !== undefined) {
        setData(result.data);
      } else if (result.error) {
        if (isServerError(result.error.code)) {
          navigate('/500');
          return;
        }
        setError(result.error.message);
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err.message || 'An error occurred');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [skip, navigate, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for API mutations (POST, PUT, DELETE).
 * Returns an execute function instead of auto-fetching.
 */
interface UseApiMutationReturn<TInput, TOutput> {
  data: TOutput | null;
  loading: boolean;
  error: string | null;
  execute: (input: TInput) => Promise<ApiResponse<TOutput>>;
  reset: () => void;
}

export function useApiMutation<TInput, TOutput>(
  mutationFn: (input: TInput) => Promise<ApiResponse<TOutput>>,
): UseApiMutationReturn<TInput, TOutput> {
  const [data, setData] = useState<TOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (input: TInput): Promise<ApiResponse<TOutput>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await mutationFn(input);
        if (result.success && result.data !== undefined) {
          setData(result.data);
        } else if (result.error) {
          setError(result.error.message);
        }
        setLoading(false);
        return result;
      } catch (err: any) {
        const errorMsg = err.message || 'Mutation failed';
        setError(errorMsg);
        setLoading(false);
        return { success: false, error: { code: 'MUTATION_ERROR', message: errorMsg } };
      }
    },
    [mutationFn],
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}

/**
 * Hook for paginated API data.
 */
interface UsePaginatedApiReturn<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
}

export function usePaginatedApi<T>(
  fetcher: (page: number, pageSize: number) => Promise<ApiResponse<any>>,
  pageSize = 20,
): UsePaginatedApiReturn<T> {
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher(page, pageSize);
      if (result.success && result.data) {
        const d = result.data;
        setItems(d.items || []);
        setTotal(d.total || 0);
        setTotalPages(d.total_pages || Math.ceil((d.total || 0) / pageSize));
      } else if (result.error) {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { items, total, page, pageSize, totalPages, loading, error, setPage, refetch: fetchData };
}
