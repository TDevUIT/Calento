import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { availabilityService } from '@/service';
import type {
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
  BulkCreateAvailabilityDto,
} from '@/interface';
import { AVAILABILITY_QUERY_KEYS } from './query-keys';

export const useCreateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAvailabilityDto) => availabilityService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_QUERY_KEYS.all });
      toast.success('Availability rule created successfully');
    },
    onError: () => {
      toast.error('Failed to create availability rule');
    },
  });
};

export const useBulkCreateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkCreateAvailabilityDto) => availabilityService.bulkCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_QUERY_KEYS.all });
      toast.success('Availability rules created successfully');
    },
    onError: () => {
      toast.error('Failed to create availability rules');
    },
  });
};

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAvailabilityDto }) =>
      availabilityService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_QUERY_KEYS.all });
      queryClient.invalidateQueries({ 
        queryKey: AVAILABILITY_QUERY_KEYS.detail(variables.id) 
      });
      toast.success('Availability rule updated successfully');
    },
    onError: () => {
      toast.error('Failed to update availability rule');
    },
  });
};

export const useDeleteAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => availabilityService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_QUERY_KEYS.all });
      toast.success('Availability rule deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete availability rule');
    },
  });
};

export const useDeleteAllAvailabilities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => availabilityService.deleteAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_QUERY_KEYS.all });
      toast.success('All availability rules deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete availability rules');
    },
  });
};
