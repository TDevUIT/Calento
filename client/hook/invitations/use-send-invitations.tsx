import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sendInvitations, type SendInvitationsRequest, type SendInvitationsResponse } from '@/service/invitation.service';
import { EVENT_QUERY_KEYS } from '@/hook/event/query-keys';

interface SendInvitationsVariables {
  eventId: string;
  data?: SendInvitationsRequest;
}


export function useSendInvitations(): UseMutationResult<
  SendInvitationsResponse,
  Error,
  SendInvitationsVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, data }: SendInvitationsVariables) => {
      return await sendInvitations(eventId, data);
    },
    onSuccess: (result, variables) => {
      if (result.sent > 0) {
        toast.success(
          `Successfully sent invitations to ${result.sent} people`,
          {
            description: result.failed > 0 
              ? `${result.failed} invitations failed to send` 
              : 'All invitations have been sent',
          }
        );
      }

      if (result.failed > 0) {
        const failedEmails = result.results
          .filter((r) => !r.success)
          .map((r) => r.email)
          .join(', ');
        
        toast.error(`Unable to send invitations to: ${failedEmails}`);
      }

      queryClient.invalidateQueries({ 
        queryKey: EVENT_QUERY_KEYS.detail(variables.eventId) 
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to send invitations', {
        description: (error as any)?.response?.data?.message || error.message,
      });
    },
  });
}
