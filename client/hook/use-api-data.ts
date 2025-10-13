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
  const responseData = data?.data;
  
  return {
    items: responseData?.items || [],
    meta: responseData?.meta,
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
  const responseData = data?.data;
  
  return {
    item: responseData || null,
    isLoading,
    error,
    refetch,
  };
}
