import { useMemo } from 'react';
import { Calendar, Check } from 'lucide-react';
import { BookingLink } from '@/service/booking.service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookingTimeSlot } from '@/interface/booking.interface';
import { format, addDays, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

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
              <span>🟩</span>
              <span>Google Meet</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</div>
            <div className="relative">
              <select
                className="w-full appearance-none bg-white dark:bg-gray-900 border border-gray-200 rounded-md px-3 py-2 pr-8 text-sm"
                value={Intl.DateTimeFormat().resolvedOptions().timeZone}
                onChange={() => {}}
              >
                <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}
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
                        className={`h-9 rounded-md text-sm transition ${
                          active
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
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Select a time</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </div>
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
                    {availableSlots.slice(0, 3).length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-500 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          <span className="font-medium">Preferred time</span>
                        </div>
                      </div>
                    )}
                    {availableSlots.map((slot: BookingTimeSlot, index: number) => (
                      <button
                        key={slot.start}
                        onClick={() => onSlotSelect(slot.start)}
                        disabled={!slot.available}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group ${
                          selectedSlot === slot.start
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : index < 3
                            ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 hover:border-green-300 dark:hover:border-green-700 hover:shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            selectedSlot === slot.start ? 'text-white' : 'text-gray-900 dark:text-gray-100'
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
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">My calendar</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Your calendar will never be shared</div>
            </div>
            <div className="h-[420px] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <div className="relative">
                {Array.from({ length: 12 }).map((_, i) => {
                  const hour = i + 8;
                  const hasEvent = i === 2 || i === 5;
                  return (
                    <div key={i} className="flex border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="w-16 flex-shrink-0 p-3 text-xs text-gray-500 dark:text-gray-400 font-medium border-r border-gray-100 dark:border-gray-700">
                        {hour > 12 ? `${hour - 12}pm` : `${hour}am`}
                      </div>
                      <div className="flex-1 p-3 min-h-[60px] relative">
                        {hasEvent && (
                          <div
                            className={`absolute inset-x-2 top-2 bottom-2 rounded-md p-2 ${
                              i === 2
                                ? 'bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500'
                                : 'bg-purple-100 dark:bg-purple-900/30 border-l-4 border-purple-500'
                            }`}
                          >
                            <div className="text-xs font-medium text-gray-900 dark:text-gray-100">
                              {i === 2 ? 'Team Meeting' : 'Client Call'}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                              {i === 2 ? '10:00 - 10:30' : '1:00 - 2:00'}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
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
