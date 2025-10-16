import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { InvitationService } from '@/service/invitation.service';
import { EVENT_QUERY_KEYS } from '@/hook/event/query-keys';

interface SendRemindersResult {
  sent: number;
  failed?: number;
}

export function useSendReminders(): UseMutationResult<
  SendRemindersResult,
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await InvitationService.sendReminders(eventId);
      return response.data;
    },
    onSuccess: (result, eventId) => {
      if (result.sent > 0) {
        toast.success(
          `Đã gửi nhắc nhở đến ${result.sent} người`,
          {
            description: 'Người tham dự sẽ nhận được email nhắc nhở',
          }
        );
      } else {
        toast.info('Không có ai cần nhắc nhở', {
          description: 'Tất cả mọi người đã phản hồi lời mời',
        });
      }

      // Invalidate event queries
      queryClient.invalidateQueries({ 
        queryKey: EVENT_QUERY_KEYS.detail(eventId) 
      });
    },
    onError: (error: Error) => {
      toast.error('Gửi nhắc nhở thất bại', {
        description: (error as any)?.response?.data?.message || error.message,
      });
    },
  });
}
