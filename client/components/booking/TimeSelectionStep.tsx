import { useMemo } from 'react';
import { Calendar, Check, Video, ShieldCheck } from 'lucide-react';
import { BookingLink } from '@/service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookingTimeSlot } from '@/interface';
import { format, addDays, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, startOfDay, endOfDay } from 'date-fns';
import { getBrowserTimezone } from '@/utils';
import { useEventsByDateRange } from '@/hook/event';

interface TimeSelectionStepProps {
  bookingLink: BookingLink;
  selectedDate: string;
  selectedSlot: string;
  availableSlots?: BookingTimeSlot[];
  isLoadingSlots: boolean;
  currentUser: { id: string; avatar?: string; username?: string; email?: string } | null;
  onDateSelect: (date: string) => void;
  onSlotSelect: (slot: string) => void;
  onContinue: () => void;
  formatDuration: (minutes: number) => string;
  formatTimeSlot: (slot: string) => string;
}

export const TimeSelectionStep = ({
  bookingLink,
  selectedDate,
  selectedSlot,
  availableSlots,
  isLoadingSlots,
  currentUser,
  onDateSelect,
  onSlotSelect,
  onContinue,
  formatDuration,
  formatTimeSlot,
}: TimeSelectionStepProps) => {
  const monthDays = useMemo(() => {
    const base = parseISO(selectedDate + 'T00:00:00');
    const monthStart = startOfMonth(base);
    const monthEnd = endOfMonth(base);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [selectedDate]);

  // Fetch user's calendar events for the selected day
  const selectedDateStart = useMemo(() => {
    return format(startOfDay(parseISO(selectedDate + 'T00:00:00')), "yyyy-MM-dd'T'HH:mm:ss'Z'");
  }, [selectedDate]);

  const selectedDateEnd = useMemo(() => {
    return format(endOfDay(parseISO(selectedDate + 'T00:00:00')), "yyyy-MM-dd'T'HH:mm:ss'Z'");
  }, [selectedDate]);

  const { data: eventsData, isLoading: isLoadingEvents } = useEventsByDateRange(
    selectedDateStart,
    selectedDateEnd,
    {
      limit: 50,
    }
  );

  const userEvents = useMemo(() => {
    return eventsData?.data?.items || [];
  }, [eventsData]);

  // Helper to format event time range
  const formatEventTime = (startTime: string | Date, endTime: string | Date) => {
    const start = typeof startTime === 'string' ? parseISO(startTime) : startTime;
    const end = typeof endTime === 'string' ? parseISO(endTime) : endTime;
    return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
  };

  // Helper to get color scheme for event
  const getEventColorScheme = (color?: string) => {
    // Map color strings to Tailwind classes
    const colorMap: Record<string, { bg: string; border: string }> = {
      blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-500' },
      purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-500' },
      green: { bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-500' },
      red: { bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-500' },
      orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-500' },
      yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-500' },
      pink: { bg: 'bg-pink-100 dark:bg-pink-900/30', border: 'border-pink-500' },
      indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', border: 'border-indigo-500' },
    };

    return colorMap[color?.toLowerCase() || ''] || { bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-500' };
  };

  return (
    <Card className="shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-3 border-r border-gray-200 dark:border-gray-700 p-5 space-y-5">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            This is a link to my maximum availability.
          </div>
          <div>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</div>
            <div className="text-gray-900 dark:text-gray-100">{formatDuration(bookingLink.duration_minutes)}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Videoconference</div>
            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <div className="h-6 w-6 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                <Video className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium leading-5">Google Meet</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 leading-4">Video call</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</div>
            <div className="relative">
              <select
                className="w-full appearance-none bg-white dark:bg-gray-900 border border-gray-200 rounded-md px-3 py-2 pr-8 text-sm"
                value={getBrowserTimezone()}
                onChange={() => { }}
              >
                <option value={getBrowserTimezone()}>
                  {getBrowserTimezone()}
                </option>
              </select>
            </div>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3">
            This is a medium priority link. Only critical priority scheduling links will show Focus Time as available.
          </div>
        </div>

        <div className={currentUser ? 'lg:col-span-6 p-5' : 'lg:col-span-9 p-5'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select a day</div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 text-sm border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <span>{format(parseISO(selectedDate + 'T00:00:00'), 'MMMM yyyy')}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDateSelect(format(addDays(parseISO(selectedDate + 'T00:00:00'), -30), 'yyyy-MM-dd'))}
                    >
                      {'<'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDateSelect(format(addDays(parseISO(selectedDate + 'T00:00:00'), 30), 'yyyy-MM-dd'))}
                    >
                      {'>'}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 text-center text-xs text-gray-500 py-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 p-2">
                  {monthDays.map((d) => {
                    const isCurrentMonth = isSameMonth(d, parseISO(selectedDate + 'T00:00:00'));
                    const active = isSameDay(d, parseISO(selectedDate + 'T00:00:00'));
                    return (
                      <button
                        key={d.toISOString()}
                        onClick={() => onDateSelect(format(d, 'yyyy-MM-dd'))}
                        className={`h-9 rounded-md text-sm transition ${active
                          ? 'bg-blue-600 text-white'
                          : isCurrentMonth
                            ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100'
                            : 'text-gray-400 dark:text-gray-600'
                          }`}
                      >
                        {format(d, 'd')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Select a time</div>
                  <div className="mt-1 inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:text-gray-300">
                    {getBrowserTimezone()}
                  </div>
                </div>
                {availableSlots && availableSlots.filter((s) => s.available).slice(0, 3).length > 0 && (
                  <div className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    Preferred time
                  </div>
                )}
              </div>
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {isLoadingSlots ? (
                  <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-11 w-full rounded-lg" />
                    ))}
                  </div>
                ) : availableSlots && availableSlots.length > 0 ? (
                  <>
                    {availableSlots.map((slot: BookingTimeSlot, index: number) => (
                      <button
                        key={slot.start}
                        onClick={() => onSlotSelect(slot.start)}
                        disabled={!slot.available}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group ${selectedSlot === slot.start
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : index < 3
                            ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 hover:border-green-300 dark:hover:border-green-700 hover:shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                          }`}
                      >
                        <span
                          className={`text-sm font-medium ${selectedSlot === slot.start ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                            }`}
                        >
                          {formatTimeSlot(slot.start)}
                        </span>
                        {selectedSlot === slot.start && <Check className="h-4 w-4" />}
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-40" />
                    <p className="text-sm font-medium">No available time slots</p>
                    <p className="text-xs mt-1">Please select another date</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {currentUser && (
          <div className="lg:col-span-3 border-l border-gray-200 dark:border-gray-700 p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">My calendar</div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Your calendar will never be shared</span>
                </div>
              </div>
            </div>
            <div className="h-[420px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {isLoadingEvents ? (
                <div className="p-3 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-md" />
                  ))}
                </div>
              ) : userEvents.length > 0 ? (
                <div className="relative">
                  {userEvents.map((event) => {
                    const startTime = typeof event.start_time === 'string' ? parseISO(event.start_time) : event.start_time;
                    const colorScheme = getEventColorScheme(event.color);

                    return (
                      <div key={event.id} className="flex border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <div className="w-16 flex-shrink-0 p-3 text-xs text-gray-500 dark:text-gray-400 font-medium border-r border-gray-100 dark:border-gray-700">
                          {format(startTime, 'h:mm a')}
                        </div>
                        <div className="flex-1 p-3 min-h-[60px] relative">
                          <div
                            className={`rounded-md p-2 ${colorScheme.bg} border-l-4 ${colorScheme.border}`}
                          >
                            <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                              {event.title}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                              {formatEventTime(event.start_time, event.end_time)}
                            </div>
                            {event.location && (
                              <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 truncate">
                                📍 {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-6">
                  <div className="text-center">
                    <Calendar className="h-10 w-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No events scheduled</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Your calendar is clear for this day</p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
              Times shown are in your timezone
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end">
        <Button onClick={onContinue} disabled={!selectedSlot} className="px-6" size="lg">
          Next
        </Button>
      </div>
    </Card>
  );
};
