import { useQuery } from '@tanstack/react-query';
import { availabilityService } from '@/service';
import { AVAILABILITY_QUERY_KEYS } from './query-keys';

export const useAvailabilities = () => {
  return useQuery({
    queryKey: AVAILABILITY_QUERY_KEYS.lists(),
    queryFn: () => availabilityService.getAll(),
  });
};

export const useActiveAvailabilities = () => {
  return useQuery({
    queryKey: AVAILABILITY_QUERY_KEYS.active(),
    queryFn: () => availabilityService.getActive(),
  });
};

export const useWeeklySchedule = () => {
  return useQuery({
    queryKey: AVAILABILITY_QUERY_KEYS.schedule(),
    queryFn: () => availabilityService.getSchedule(),
  });
};

export const useAvailabilityDetail = (id: string) => {
  return useQuery({
    queryKey: AVAILABILITY_QUERY_KEYS.detail(id),
    queryFn: () => availabilityService.getById(id),
    enabled: !!id,
  });
};
