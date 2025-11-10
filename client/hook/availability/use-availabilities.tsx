import { useQuery } from '@tanstack/react-query';
import { availabilityService } from '@/service';
import { AVAILABILITY_QUERY_KEYS } from './query-keys';

export const useAvailabilities = () => {
  return useQuery({
    queryKey: AVAILABILITY_QUERY_KEYS.lists(),
    queryFn: () => availabilityService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
  });
};

export const useActiveAvailabilities = () => {
  return useQuery({
    queryKey: AVAILABILITY_QUERY_KEYS.active(),
    queryFn: () => availabilityService.getActive(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
};

export const useWeeklySchedule = () => {
  return useQuery({
    queryKey: AVAILABILITY_QUERY_KEYS.schedule(),
    queryFn: () => availabilityService.getSchedule(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
};

export const useAvailabilityDetail = (id: string) => {
  return useQuery({
    queryKey: AVAILABILITY_QUERY_KEYS.detail(id),
    queryFn: () => availabilityService.getById(id),
    enabled: !!id,
  });
};
