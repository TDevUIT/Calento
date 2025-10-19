import { Check, X, AlertCircle, Calendar, Plus, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SuccessStateProps {
  action: 'accept' | 'decline' | 'tentative' | null;
  eventAddedToCalendar?: boolean;
  onAddToGoogleCalendar: () => void;
}

const ACTION_TEXT = {
  accept: 'accepted',
  decline: 'declined',
  tentative: 'might attend',
};

const ACTION_ICONS = {
  accept: (
    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mx-auto flex items-center justify-center">
      <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
    </div>
  ),
  decline: (
    <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 mx-auto flex items-center justify-center">
      <X className="h-8 w-8 text-red-600 dark:text-red-400" />
    </div>
  ),
  tentative: (
    <div className="h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mx-auto flex items-center justify-center">
      <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
    </div>
  ),
};

export const SuccessState = ({ action, eventAddedToCalendar, onAddToGoogleCalendar }: SuccessStateProps) => {
  const router = useRouter();
  const actionText = ACTION_TEXT[action || 'accept'];
  const actionIcon = ACTION_ICONS[action || 'accept'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F8FC] dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-sm">
        <CardContent className="p-12 text-center">
          <div className="mb-6">{actionIcon}</div>
          <h2 className="text-2xl font-bold mb-2">Response Recorded!</h2>
          <p className="text-muted-foreground mb-6">
            You have {actionText} the event invitation.
            <br />
            The organizer will be notified.
          </p>
          <div className="space-y-3">
            {action === 'accept' && (
              <>
                {eventAddedToCalendar && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Added to Calento</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Event has been synced to your calendar
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  onClick={() => router.push('/dashboard/calendar')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  View in Calento Calendar
                </Button>
                <Button onClick={onAddToGoogleCalendar} variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Google Calendar
                </Button>
              </>
            )}
            {action !== 'accept' && (
              <Button onClick={() => router.push('/dashboard/calendar')} variant="outline" className="w-full">
                Go to Calendar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
