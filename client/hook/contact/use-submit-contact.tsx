'use client';

import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { contactService } from '@/service';
import { CreateContactRequest, ContactResponse } from '@/interface';
import { CONTACT_QUERY_KEYS } from './query-keys';
import { toast } from 'sonner';

export const useSubmitContact = (): UseMutationResult<ContactResponse, Error, CreateContactRequest> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactRequest) => contactService.submitContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: CONTACT_QUERY_KEYS.all,
        refetchType: 'active'
      });
      toast.success('Message sent successfully!', {
        description: 'We will get back to you within 24 hours.',
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to send message', {
        description: error.message || 'Please try again later.',
      });
    },
  });
};
