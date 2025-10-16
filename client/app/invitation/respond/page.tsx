'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Calendar, Check, X, AlertCircle, Loader2, MapPin, Clock, Users, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useInvitationDetails, useRespondToInvitation } from '@/hook/invitations/use-respond-invitation';
import { generateGoogleCalendarLink } from '@/service/invitation.service';

function InvitationResponseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const action = searchParams.get('action') as 'accept' | 'decline' | 'tentative' | null;

  const [comment, setComment] = useState('');
  const [hasResponded, setHasResponded] = useState(false);
  const [addToCalento, setAddToCalento] = useState(true); // Default checked

  const { data: invitation, isLoading, error } = useInvitationDetails(token || '', !!token);
  const respondMutation = useRespondToInvitation();

  useEffect(() => {
    if (token && action && invitation && !hasResponded && !respondMutation.isPending) {
      handleResponse(action);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // Error is handled by the mutation hook
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading invitation details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-2xl font-bold mb-2">Invalid Invitation</h2>
            <p className="text-muted-foreground mb-6">
              This invitation may have expired or does not exist.
            </p>
            <Button onClick={() => router.push('/dashboard/calendar')}>
              Go to Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasResponded || respondMutation.isSuccess) {
    const actionText = {
      accept: 'accepted',
      decline: 'declined',
      tentative: 'might attend',
    }[action || 'accept'];

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-12 text-center">
            <div className="mb-6">
              {action === 'accept' && (
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mx-auto flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              )}
              {action === 'decline' && (
                <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mx-auto flex items-center justify-center">
                  <X className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              )}
              {action === 'tentative' && (
                <div className="h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mx-auto flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2">Response Recorded!</h2>
            <p className="text-muted-foreground mb-6">
              You have {actionText} the event invitation.
              <br />
              The organizer will be notified.
            </p>
            <div className="space-y-3">
              {action === 'accept' && (
                <>
                  {respondMutation.data?.eventAddedToCalendar && (
                    <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 rounded-lg p-4 mb-3">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">Added to Calento</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Event has been synced to your Calento calendar
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <Button 
                    onClick={() => router.push('/dashboard/calendar')} 
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Xem trong Calento Calendar
                  </Button>
                  <Button 
                    onClick={handleAddToGoogleCalendar} 
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Google Calendar
                  </Button>
                </>
              )}
              {action !== 'accept' && (
                <Button 
                  onClick={() => router.push('/dashboard/calendar')} 
                  variant="outline"
                  className="w-full"
                >
                  Go to Calendar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader className="border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12 border-2 border-white">
                <AvatarImage src={invitation.organizer_avatar} alt={invitation.organizer_name} />
                <AvatarFallback>
                  {invitation.organizer_name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm opacity-90">You are invited by</p>
                <p className="font-semibold">{invitation.organizer_name}</p>
              </div>
            </div>
            <CardTitle className="text-2xl">{invitation.title}</CardTitle>
            {invitation.description && (
              <CardDescription className="text-blue-50 mt-2">
                {invitation.description}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateTime(invitation.start_time)}
                  </p>
                </div>
              </div>

              {invitation.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{invitation.location}</p>
                  </div>
                </div>
              )}

              {invitation.is_optional && (
                <Badge variant="secondary" className="mt-2">
                  <Users className="h-3 w-3 mr-1" />
                  Optional Attendance
                </Badge>
              )}
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Will you attend this event?</h3>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                <Button
                  onClick={() => handleResponse('accept')}
                  disabled={respondMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 h-auto py-4 flex-col gap-1"
                >
                  <Check className="h-5 w-5" />
                  <span className="text-sm font-medium">Join</span>
                </Button>
                <Button
                  onClick={() => handleResponse('tentative')}
                  disabled={respondMutation.isPending}
                  variant="outline"
                  className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 h-auto py-4 flex-col gap-1"
                >
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Maybe</span>
                </Button>
                <Button
                  onClick={() => handleResponse('decline')}
                  disabled={respondMutation.isPending}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 h-auto py-4 flex-col gap-1"
                >
                  <X className="h-5 w-5" />
                  <span className="text-sm font-medium">Decline</span>
                </Button>
              </div>

              <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-lg p-4 mb-6 border border-violet-200 dark:border-violet-800">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="addToCalento"
                    checked={addToCalento}
                    onCheckedChange={(checked) => setAddToCalento(!!checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="addToCalento"
                      className="text-sm font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      Add to Calento Calendar
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Automatically sync event to your Calento calendar when accepting invitation
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-2">
                <Label htmlFor="comment" className="text-sm font-medium">
                  Note (optional)
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Add a note for the organizer..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  disabled={respondMutation.isPending}
                  className="resize-none"
                />
              </div>
            </div>

            {invitation.response_status && invitation.response_status !== 'needsAction' && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Current status:{' '}
                  <Badge variant="secondary">
                    {invitation.response_status === 'accepted' && 'Accepted'}
                    {invitation.response_status === 'declined' && 'Declined'}
                    {invitation.response_status === 'tentative' && 'Maybe'}
                  </Badge>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          This email was sent from <strong>Tempra Calendar</strong>
        </p>
      </div>
    </div>
  );
}

export default function InvitationResponsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    }>
      <InvitationResponseContent />
    </Suspense>
  );
}
