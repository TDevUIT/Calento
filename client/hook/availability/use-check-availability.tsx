import { useQuery } from '@tanstack/react-query';
import { availabilityService } from '@/service';
import type { CheckAvailabilityDto } from '@/interface/availability.interface';
import { AVAILABILITY_QUERY_KEYS } from './query-keys';

export const useCheckAvailability = (
  data: CheckAvailabilityDto,
  enabled = true
) => {
  return useQuery({
    queryKey: AVAILABILITY_QUERY_KEYS.check(data.date_time),
    queryFn: () => availabilityService.checkAvailability(data),
    enabled: enabled && !!data.date_time,
  });
};
