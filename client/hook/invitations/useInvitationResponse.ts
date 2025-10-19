import { useState, useEffect } from 'react';
import { useRespondToInvitation } from '@/hook/invitations/use-respond-invitation';
import { generateGoogleCalendarLink } from '@/service/invitation.service';

interface InvitationData {
  title: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time: string;
}

export const useInvitationResponse = (
  token: string | null,
  action: 'accept' | 'decline' | 'tentative' | null,
  invitation: InvitationData | undefined
) => {
  const [comment, setComment] = useState('');
  const [hasResponded, setHasResponded] = useState(false);
  const [addToCalento, setAddToCalento] = useState(true);

  const respondMutation = useRespondToInvitation();

  useEffect(() => {
    if (token && action && invitation && !hasResponded && !respondMutation.isPending) {
      handleResponse(action);
    }
  }, [token, action, invitation, hasResponded, respondMutation.isPending]);

  const handleResponse = async (responseAction: 'accept' | 'decline' | 'tentative') => {
    if (!token || hasResponded) return;

    try {
      await respondMutation.mutateAsync({
        token,
        action: responseAction,
        comment: comment || undefined,
        addToCalento: responseAction === 'accept' ? addToCalento : false,
      });
      setHasResponded(true);
    } catch {
      
    }
  };

  const handleAddToGoogleCalendar = () => {
    if (!invitation) return;

    const calendarLink = generateGoogleCalendarLink({
      title: invitation.title,
      description: invitation.description,
      location: invitation.location,
      start_time: invitation.start_time,
      end_time: invitation.end_time,
    });

    window.open(calendarLink, '_blank');
  };

  return {
    comment,
    setComment,
    hasResponded,
    addToCalento,
    setAddToCalento,
    respondMutation,
    handleResponse,
    handleAddToGoogleCalendar,
  };
};
