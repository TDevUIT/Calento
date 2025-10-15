import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { InvitationService } from '@/services/api/invitation.service';

interface RespondInvitationVariables {
  token: string;
  action: 'accept' | 'decline' | 'tentative';
  comment?: string;
  addToCalento?: boolean;
}

export function useRespondToInvitation() {
  return useMutation({
    mutationFn: async ({ token, action, comment, addToCalento }: RespondInvitationVariables) => {
      const response = await InvitationService.respondToInvitation(token, action, comment, addToCalento);
      return response.data;
    },
    onSuccess: (result, variables) => {
      const actionText = {
        accept: 'chấp nhận',
        decline: 'từ chối',
        tentative: 'có thể tham gia',
      }[variables.action];

      let description = 'Người tổ chức sẽ nhận được thông báo';
      
      if (variables.action === 'accept' && variables.addToCalento && result.eventAddedToCalendar) {
        description = '✨ Sự kiện đã được thêm vào lịch Calento của bạn';
      }

      toast.success(`Bạn đã ${actionText} lời mời`, {
        description,
      });
    },
    onError: (error: any) => {
      toast.error('Phản hồi lời mời thất bại', {
        description: error?.response?.data?.message || error.message,
      });
    },
  });
}

export function useInvitationDetails(token: string, enabled = true) {
  return useQuery({
    queryKey: ['invitation', token],
    queryFn: async () => {
      const response = await InvitationService.getInvitationDetails(token);
      return response.data;
    },
    enabled: enabled && !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
