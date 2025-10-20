'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { healthService } from '@/service/health.service';
import { HealthStatus, HealthOkResponse } from '@/interface/health.interface';
import { HEALTH_QUERY_KEYS } from './query-keys';

export const useHealthStatus = (
  refetchInterval?: number
): UseQueryResult<HealthStatus, Error> => {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.status(),
    queryFn: () => healthService.getHealthStatus(),
    refetchInterval: refetchInterval || 30000, // Default 30s
    refetchIntervalInBackground: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useHealthOk = (): UseQueryResult<HealthOkResponse, Error> => {
  return useQuery({
    queryKey: HEALTH_QUERY_KEYS.ok(),
    queryFn: () => healthService.getHealthOk(),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
