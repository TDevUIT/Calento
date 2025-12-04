import { useMutation, useQuery, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  respondToInvitation, 
  getInvitationDetails,
  type InvitationResponse,
  type InvitationDetails,
  type RespondToInvitationRequest
} from '@/service';

interface RespondInvitationVariables {
  token: string;
  action: 'accept' | 'decline' | 'tentative';
  comment?: string;
  addToCalento?: boolean;
}

export function useRespondToInvitation(): UseMutationResult<
  InvitationResponse,
  Error,
  RespondInvitationVariables
> {
  return useMutation({
    mutationFn: async ({ token, action, comment, addToCalento }: RespondInvitationVariables) => {
      const data: RespondToInvitationRequest = {
        action,
        comment,
        addToCalento
      };
      return await respondToInvitation(token, data);
    },
    onSuccess: (result, variables) => {
      const actionText = {
        accept: 'accepted',
        decline: 'declined',
        tentative: 'tentatively accepted',
      }[variables.action];

      let description = 'The organizer will be notified';
      
      if (variables.action === 'accept' && variables.addToCalento && result.eventAddedToCalendar) {
        description = '✨ Event has been added to your Calento calendar';
      }

      toast.success(`You have ${actionText} the invitation`, {
        description,
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to respond to invitation', {
        description: (error as any)?.response?.data?.message || error.message,
      });
    },
  });
}

export function useInvitationDetails(token: string, enabled = true): UseQueryResult<InvitationDetails, Error> {
  return useQuery({
    queryKey: ['invitation', token],
    queryFn: async () => {
      return await getInvitationDetails(token);
    },
    enabled: enabled && !!token,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
