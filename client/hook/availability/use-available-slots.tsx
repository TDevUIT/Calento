import { useQuery } from '@tanstack/react-query';
import { availabilityService } from '@/service';
import type { GetAvailableSlotsDto } from '@/interface';
import { AVAILABILITY_QUERY_KEYS } from './query-keys';

export const useAvailabilitySlots = (
  data: GetAvailableSlotsDto,
  enabled = true
) => {
  return useQuery({
    queryKey: AVAILABILITY_QUERY_KEYS.slots(data.start_date, data.end_date),
    queryFn: () => availabilityService.getAvailableSlots(data),
    enabled: enabled && !!data.start_date && !!data.end_date,
  });
};
