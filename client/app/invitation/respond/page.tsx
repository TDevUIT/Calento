'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useInvitationDetails } from '@/hook/invitations/use-respond-invitation';
import { useAuthStore } from '@/store/auth.store';
import { useEventsByDateRange } from '@/hook/event/use-events';
import { format, parseISO } from 'date-fns';
import {
  LoadingState,
  ErrorState,
  SuccessState,
  InvitationHeader,
  ResponseButtons,
  InvitationForm,
  UserCalendarSection,
  useInvitationResponse,
} from '@/components/invitation';

const InvitationResponseContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const action = searchParams.get('action') as 'accept' | 'decline' | 'tentative' | null;

  const { data: invitation, isLoading, error } = useInvitationDetails(token || '', !!token);
  const currentUser = useAuthStore((s) => s.user);

  const {
    comment,
    setComment,
    hasResponded,
    addToCalento,
    setAddToCalento,
    respondMutation,
    handleResponse,
    handleAddToGoogleCalendar,
  } = useInvitationResponse(token, action, invitation);

  const invitationDate = invitation?.start_time ? format(parseISO(invitation.start_time), 'yyyy-MM-dd') : '';
  const shouldFetchEvents = !!currentUser && !!invitationDate;
  const { data: userEvents } = useEventsByDateRange(
    shouldFetchEvents ? invitationDate : '',
    shouldFetchEvents ? invitationDate : ''
  );

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(new Date(dateString));
  };

  if (isLoading) return <LoadingState />;
  if (error || !invitation) return <ErrorState />;

  if (hasResponded || respondMutation.isSuccess) {
    return (
      <SuccessState
        action={action}
        eventAddedToCalendar={respondMutation.data?.eventAddedToCalendar}
        onAddToGoogleCalendar={handleAddToGoogleCalendar}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] dark:bg-gray-900 p-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-sm border-0">
          <InvitationHeader
            organizerName={invitation.organizer_name}
            organizerAvatar={invitation.organizer_avatar}
            title={invitation.title}
            description={invitation.description}
            startTime={invitation.start_time}
            location={invitation.location}
            isOptional={invitation.is_optional}
            formatDateTime={formatDateTime}
          />

          <CardContent className="p-6 space-y-6">
            {currentUser && (
              <UserCalendarSection
                invitationStartTime={invitation.start_time}
                userEvents={userEvents?.data?.items}
              />
            )}

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4 text-base">Will you attend this event?</h3>
              <ResponseButtons onResponse={handleResponse} isPending={respondMutation.isPending} />
              <InvitationForm
                addToCalento={addToCalento}
                setAddToCalento={setAddToCalento}
                comment={comment}
                setComment={setComment}
                isPending={respondMutation.isPending}
                responseStatus={invitation.response_status}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function InvitationResponsePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC] dark:bg-gray-900">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <InvitationResponseContent />
    </Suspense>
  );
}
