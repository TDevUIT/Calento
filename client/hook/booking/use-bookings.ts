import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getBookings as getBookingsApi,
  getBooking as getBookingApi,
  getBookingStats as getBookingStatsApi,
  cancelBooking as cancelBookingApi,
  rescheduleBooking as rescheduleBookingApi,
  completeBooking as completeBookingApi,
  getPublicBookingLink as getPublicBookingLinkApi,
  getAvailableSlots as getAvailableSlotsApi,
  createPublicBooking as createPublicBookingApi,
  cancelPublicBooking as cancelPublicBookingApi,
  reschedulePublicBooking as reschedulePublicBookingApi,
  Booking, 
  CreateBookingDto,
  BookingTimeSlot,
  BookingAvailabilityQuery
} from '@/service/booking.service';

// Query Keys
export const BOOKING_QUERY_KEYS = {
  all: ['bookings'] as const,
  lists: () => [...BOOKING_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...BOOKING_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...BOOKING_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...BOOKING_QUERY_KEYS.details(), id] as const,
  stats: () => [...BOOKING_QUERY_KEYS.all, 'stats'] as const,
  public: {
    all: ['public-bookings'] as const,
    link: (slug: string) => [...BOOKING_QUERY_KEYS.public.all, 'link', slug] as const,
    slots: (slug: string, params: BookingAvailabilityQuery) => 
      [...BOOKING_QUERY_KEYS.public.all, 'slots', slug, params] as const,
  },
};

// Get bookings for dashboard
export function useBookings(params?: {
  page?: number;
  limit?: number;
  status?: string;
  booking_link_id?: string;
  start_date?: string;
  end_date?: string;
}) {
  return useQuery({
    queryKey: BOOKING_QUERY_KEYS.list(params || {}),
    queryFn: async () => {
      return await getBookingsApi(params);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get single booking
export function useBooking(id: string) {
  return useQuery({
    queryKey: BOOKING_QUERY_KEYS.detail(id),
    queryFn: async () => {
      return await getBookingApi(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get booking statistics
export function useBookingStats() {
  return useQuery({
    queryKey: BOOKING_QUERY_KEYS.stats(),
    queryFn: async () => {
      return await getBookingStatsApi();
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Cancel booking (by owner)
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      await cancelBookingApi(id, reason);
      return id;
    },
    onSuccess: (cancelledId) => {
      // Invalidate all booking queries
      queryClient.invalidateQueries({ 
        queryKey: BOOKING_QUERY_KEYS.all 
      });
      
      toast.success('Booking cancelled successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to cancel booking';
      toast.error(message);
    },
  });
}

// Reschedule booking (by owner)
export function useRescheduleBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      new_start_time, 
      timezone 
    }: { 
      id: string; 
      new_start_time: string; 
      timezone: string; 
    }) => {
      return await rescheduleBookingApi(id, new_start_time, timezone);
    },
    onSuccess: (updatedBooking, { id }) => {
      // Update the specific booking cache
      queryClient.setQueryData(
        BOOKING_QUERY_KEYS.detail(id),
        updatedBooking
      );
      
      // Invalidate all booking queries
      queryClient.invalidateQueries({ 
        queryKey: BOOKING_QUERY_KEYS.all 
      });
      
      toast.success('Booking rescheduled successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to reschedule booking';
      toast.error(message);
    },
  });
}

// Complete booking
export function useCompleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await completeBookingApi(id);
    },
    onSuccess: (updatedBooking, id) => {
      // Update the specific booking cache
      queryClient.setQueryData(
        BOOKING_QUERY_KEYS.detail(id),
        updatedBooking
      );
      
      // Invalidate all booking queries
      queryClient.invalidateQueries({ 
        queryKey: BOOKING_QUERY_KEYS.all 
      });
      
      toast.success('Booking marked as completed');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to complete booking';
      toast.error(message);
    },
  });
}

// PUBLIC BOOKING HOOKS (for public booking pages)

// Get public booking link by slug
export function usePublicBookingLink(slug: string) {
  return useQuery({
    queryKey: BOOKING_QUERY_KEYS.public.link(slug),
    queryFn: async () => {
      return await getPublicBookingLinkApi(slug);
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: false, // Don't retry on 404
  });
}

// Get available time slots
export function useAvailableSlots(slug: string, params: BookingAvailabilityQuery) {
  return useQuery({
    queryKey: BOOKING_QUERY_KEYS.public.slots(slug, params),
    queryFn: async () => {
      return await getAvailableSlotsApi(slug, params);
    },
    enabled: !!slug && !!params.date,
    staleTime: 1000 * 60 * 1, // 1 minute (slots change frequently)
    refetchOnWindowFocus: true,
  });
}

// Create public booking
export function useCreatePublicBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ slug, data }: { slug: string; data: CreateBookingDto }) => {
      return await createPublicBookingApi(slug, data);
    },
    onSuccess: (newBooking, { slug }) => {
      // Invalidate available slots for this booking link
      queryClient.invalidateQueries({
        queryKey: [...BOOKING_QUERY_KEYS.public.all, 'slots', slug]
      });
      
      toast.success('Booking created successfully! Check your email for confirmation.');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create booking';
      toast.error(message);
    },
  });
}

// Cancel public booking with token
export function useCancelPublicBooking() {
  return useMutation({
    mutationFn: async ({ token, reason }: { token: string; reason?: string }) => {
      await cancelPublicBookingApi(token, reason);
      return token;
    },
    onSuccess: () => {
      toast.success('Booking cancelled successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to cancel booking';
      toast.error(message);
    },
  });
}

// Reschedule public booking with token
export function useReschedulePublicBooking() {
  return useMutation({
    mutationFn: async ({ 
      token, 
      new_start_time, 
      timezone 
    }: { 
      token: string; 
      new_start_time: string; 
      timezone: string; 
    }) => {
      return await reschedulePublicBookingApi(token, new_start_time, timezone);
    },
    onSuccess: () => {
      toast.success('Booking rescheduled successfully! Check your email for confirmation.');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to reschedule booking';
      toast.error(message);
    },
  });
}
