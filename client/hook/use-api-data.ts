import { UseQueryResult } from '@tanstack/react-query';

export function useApiData<T>(
  queryResult: UseQueryResult<any, Error>
): {
  items: T[];
  meta?: any;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const { data, isLoading, error, refetch } = queryResult;
  const nestedData = data?.data?.data;
  
  return {
    items: nestedData?.items || [],
    meta: nestedData?.meta,
    isLoading,
    error,
    refetch,
  };
}

export function useApiItem<T>(
  queryResult: UseQueryResult<any, Error>
): {
  item: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const { data, isLoading, error, refetch } = queryResult;
  const nestedData = data?.data?.data;
  
  return {
    item: nestedData || null,
    isLoading,
    error,
    refetch,
  };
}
