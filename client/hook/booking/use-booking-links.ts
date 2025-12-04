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
} from '@/service';

export const BOOKING_LINK_QUERY_KEYS = {
  all: ['booking-links'] as const,
  lists: () => [...BOOKING_LINK_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...BOOKING_LINK_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...BOOKING_LINK_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...BOOKING_LINK_QUERY_KEYS.details(), id] as const,
  stats: (id: string) => [...BOOKING_LINK_QUERY_KEYS.all, 'stats', id] as const,
};

export function useBookingLinks() {
  return useQuery({
    queryKey: BOOKING_LINK_QUERY_KEYS.lists(),
    queryFn: async () => {
      return await getBookingLinksApi();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

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

export function useCreateBookingLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookingLinkDto) => {
      return await createBookingLinkApi(data);
    },
    onSuccess: (newBookingLink) => {
      queryClient.setQueryData<BookingLink[]>(
        BOOKING_LINK_QUERY_KEYS.lists(),
        (old) => old ? [newBookingLink, ...old] : [newBookingLink]
      );
      
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

export function useUpdateBookingLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBookingLinkDto }) => {
      return await updateBookingLinkApi(id, data);
    },
    onSuccess: (updatedBookingLink, { id }) => {
      queryClient.setQueryData(
        BOOKING_LINK_QUERY_KEYS.detail(id),
        updatedBookingLink
      );
      
      queryClient.setQueryData<BookingLink[]>(
        BOOKING_LINK_QUERY_KEYS.lists(),
        (old) => old ? old.map(link => 
          link.id === id ? updatedBookingLink : link
        ) : [updatedBookingLink]
      );
      
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

export function useDeleteBookingLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteBookingLinkApi(id);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData<BookingLink[]>(
        BOOKING_LINK_QUERY_KEYS.lists(),
        (old) => old ? old.filter(link => link.id !== deletedId) : []
      );
      
      queryClient.removeQueries({
        queryKey: BOOKING_LINK_QUERY_KEYS.detail(deletedId)
      });
      
      queryClient.removeQueries({
        queryKey: BOOKING_LINK_QUERY_KEYS.stats(deletedId)
      });
      
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

export function useToggleBookingLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await toggleBookingLinkApi(id);
    },
    onSuccess: (updatedBookingLink, id) => {
      queryClient.setQueryData(
        BOOKING_LINK_QUERY_KEYS.detail(id),
        updatedBookingLink
      );
      
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
