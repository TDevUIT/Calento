import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Event } from '@/interface/event.interface';

interface UserCalendarSectionProps {
  invitationStartTime: string;
  userEvents?: Event[];
}

const toDate = (value: string | Date): Date =>
  typeof value === 'string' ? parseISO(value) : value;

export const UserCalendarSection = ({ invitationStartTime, userEvents }: UserCalendarSectionProps) => {
  const router = useRouter();

  return (
    <div className="border-t pt-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-semibold text-base">Your Calendar</h3>
        {userEvents && userEvents.length > 0 && (
          <Badge variant="secondary" className="ml-auto">{userEvents.length} events</Badge>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-100 dark:border-blue-900 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {format(parseISO(invitationStartTime), 'EEEE')}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(parseISO(invitationStartTime), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          {userEvents && userEvents.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                You have {userEvents.length} event{userEvents.length > 1 ? 's' : ''} on this day:
              </p>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {userEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-2 text-xs">
                    <div
                      className="h-2 w-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: event.color || '#3b82f6' }}
                    />
                    <span className="truncate text-gray-700 dark:text-gray-300">
                      {format(toDate(event.start_time), 'h:mm a')} - {event.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No events scheduled on this day
            </p>
          )}
        </div>

        {userEvents && userEvents.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <p className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-3">
              Event Details
            </p>
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {userEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: event.color || '#3b82f6' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate text-gray-900 dark:text-gray-100">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {format(toDate(event.start_time), 'h:mm a')} - {format(toDate(event.end_time), 'h:mm a')}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Check for scheduling conflicts before accepting
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/dashboard/calendar')}
          className="w-full"
        >
          <Calendar className="h-4 w-4 mr-2" />
          View Full Calendar
        </Button>
      </div>
    </div>
  );
};
