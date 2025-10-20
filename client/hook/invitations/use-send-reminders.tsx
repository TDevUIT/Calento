import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sendReminders, type SendRemindersResponse } from '@/service/invitation.service';
import { EVENT_QUERY_KEYS } from '@/hook/event/query-keys';


export function useSendReminders(): UseMutationResult<
  SendRemindersResponse,
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      return await sendReminders(eventId);
    },
    onSuccess: (result, eventId) => {
      if (result.sent > 0) {
        toast.success(
          `Sent reminders to ${result.sent} people`,
          {
            description: 'Attendees will receive reminder emails',
          }
        );
      } else {
        toast.info('No one needs reminders', {
          description: 'Everyone has already responded to the invitation',
        });
      }

      queryClient.invalidateQueries({ 
        queryKey: EVENT_QUERY_KEYS.detail(eventId) 
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to send reminders', {
        description: (error as any)?.response?.data?.message || error.message,
      });
    },
  });
}
