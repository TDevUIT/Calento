import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getBookingLinks as getBookingLinksApi,
  getBookingLink as getBookingLinkApi,
  createBookingLink as createBookingLinkApi,
  updateBookingLink as updateBookingLinkApi,
  deleteBookingLink as deleteBookingLinkApi,
  toggleBookingLink as toggleBookingLinkApi,
  getBookingLinkStats as getBookingLinkStatsApi,
  BookingLink, 
  CreateBookingLinkDto, 
  UpdateBookingLinkDto 
} from '@/service/booking.service';

// Query Keys
export const BOOKING_LINK_QUERY_KEYS = {
  all: ['booking-links'] as const,
  lists: () => [...BOOKING_LINK_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...BOOKING_LINK_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...BOOKING_LINK_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...BOOKING_LINK_QUERY_KEYS.details(), id] as const,
  stats: (id: string) => [...BOOKING_LINK_QUERY_KEYS.all, 'stats', id] as const,
};

// Get all booking links
export function useBookingLinks() {
  return useQuery({
    queryKey: BOOKING_LINK_QUERY_KEYS.lists(),
    queryFn: async () => {
      return await getBookingLinksApi();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get single booking link
export function useBookingLink(id: string) {
  return useQuery({
    queryKey: BOOKING_LINK_QUERY_KEYS.detail(id),
    queryFn: async () => {
      return await getBookingLinkApi(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get booking link stats
export function useBookingLinkStats(id: string) {
  return useQuery({
    queryKey: BOOKING_LINK_QUERY_KEYS.stats(id),
    queryFn: async () => {
      return await getBookingLinkStatsApi(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Create booking link
export function useCreateBookingLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookingLinkDto) => {
      return await createBookingLinkApi(data);
    },
    onSuccess: (newBookingLink) => {
      // Update the booking links list cache
      queryClient.setQueryData<BookingLink[]>(
        BOOKING_LINK_QUERY_KEYS.lists(),
        (old) => old ? [newBookingLink, ...old] : [newBookingLink]
      );
      
      // Invalidate all booking link queries
      queryClient.invalidateQueries({ 
        queryKey: BOOKING_LINK_QUERY_KEYS.all 
      });
      
      toast.success('Booking link created successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create booking link';
      toast.error(message);
    },
  });
}

// Update booking link
export function useUpdateBookingLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBookingLinkDto }) => {
      return await updateBookingLinkApi(id, data);
    },
    onSuccess: (updatedBookingLink, { id }) => {
      // Update the specific booking link cache
      queryClient.setQueryData(
        BOOKING_LINK_QUERY_KEYS.detail(id),
        updatedBookingLink
      );
      
      // Update the booking links list cache
      queryClient.setQueryData<BookingLink[]>(
        BOOKING_LINK_QUERY_KEYS.lists(),
        (old) => old ? old.map(link => 
          link.id === id ? updatedBookingLink : link
        ) : [updatedBookingLink]
      );
      
      // Invalidate all booking link queries
      queryClient.invalidateQueries({ 
        queryKey: BOOKING_LINK_QUERY_KEYS.all 
      });
      
      toast.success('Booking link updated successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update booking link';
      toast.error(message);
    },
  });
}

// Delete booking link
export function useDeleteBookingLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteBookingLinkApi(id);
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from booking links list cache
      queryClient.setQueryData<BookingLink[]>(
        BOOKING_LINK_QUERY_KEYS.lists(),
        (old) => old ? old.filter(link => link.id !== deletedId) : []
      );
      
      // Remove the specific booking link cache
      queryClient.removeQueries({
        queryKey: BOOKING_LINK_QUERY_KEYS.detail(deletedId)
      });
      
      // Remove stats cache
      queryClient.removeQueries({
        queryKey: BOOKING_LINK_QUERY_KEYS.stats(deletedId)
      });
      
      // Invalidate all booking link queries
      queryClient.invalidateQueries({ 
        queryKey: BOOKING_LINK_QUERY_KEYS.all 
      });
      
      toast.success('Booking link deleted successfully');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete booking link';
      toast.error(message);
    },
  });
}

// Toggle booking link active status
export function useToggleBookingLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await toggleBookingLinkApi(id);
    },
    onSuccess: (updatedBookingLink, id) => {
      // Update the specific booking link cache
      queryClient.setQueryData(
        BOOKING_LINK_QUERY_KEYS.detail(id),
        updatedBookingLink
      );
      
      // Update the booking links list cache
      queryClient.setQueryData<BookingLink[]>(
        BOOKING_LINK_QUERY_KEYS.lists(),
        (old) => old ? old.map(link => 
          link.id === id ? updatedBookingLink : link
        ) : [updatedBookingLink]
      );
      
      const status = updatedBookingLink.is_active ? 'activated' : 'deactivated';
      toast.success(`Booking link ${status} successfully`);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to toggle booking link';
      toast.error(message);
    },
  });
}
