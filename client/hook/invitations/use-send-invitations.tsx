import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { InvitationService, type SendInvitationsRequest } from '@/service/invitation.service';
import { EVENT_QUERY_KEYS } from '@/hook/event/query-keys';

interface SendInvitationsVariables {
  eventId: string;
  data?: SendInvitationsRequest;
}

interface SendInvitationsResult {
  sent: number;
  failed: number;
  results: Array<{ success: boolean; email: string }>;
}

export function useSendInvitations(): UseMutationResult<
  SendInvitationsResult,
  Error,
  SendInvitationsVariables
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, data }: SendInvitationsVariables) => {
      const response = await InvitationService.sendInvitations(eventId, data);
      return response.data;
    },
    onSuccess: (result, variables) => {
      if (result.sent > 0) {
        toast.success(
          `Đã gửi lời mời thành công đến ${result.sent} người`,
          {
            description: result.failed > 0 
              ? `${result.failed} lời mời gửi thất bại` 
              : 'Tất cả lời mời đã được gửi',
          }
        );
      }

      if (result.failed > 0) {
        const failedEmails = result.results
          .filter((r) => !r.success)
          .map((r) => r.email)
          .join(', ');
        
        toast.error(`Không thể gửi lời mời đến: ${failedEmails}`);
      }

      queryClient.invalidateQueries({ 
        queryKey: EVENT_QUERY_KEYS.detail(variables.eventId) 
      });
    },
    onError: (error: Error) => {
      toast.error('Gửi lời mời thất bại', {
        description: (error as any)?.response?.data?.message || error.message,
      });
    },
  });
}
