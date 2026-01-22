'use client';

import { addDays, format, isToday, startOfWeek } from 'date-fns';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { useCalendarSettings } from '../shared/CalendarSettingsProvider';
import { DayTimelineEvents, TimeTable, useCalendar, getWeekendIndices } from './CalendarCore';

const HOUR_HEIGHT = 80; // pixels per hour

const CalendarWeekView = () => {
  const { view, date, locale, events } = useCalendar();
  const { weekStartsOn, highlightWeekends } = useCalendarSettings();

  const weekStartsOnDay = weekStartsOn === 'sunday' ? 0 : weekStartsOn === 'monday' ? 1 : 6;
  const weekendIndices = getWeekendIndices(weekStartsOnDay);

  const weekDates = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: weekStartsOnDay });
    const dates = [];

    for (let i = 0; i < 7; i++) {
      dates.push(addDays(start, i));
    }

    return dates;
  }, [date, weekStartsOnDay]);

  const hours = useMemo(() => [...Array(24)].map((_, i) => i), []);

  if (view !== 'week') return null;

  return (
    <div className="flex flex-col relative overflow-hidden h-full border-b border-r bg-[#F7F8FC] shadow-sm">
      <div className="flex sticky top-0 bg-[#F7F8FC] z-10 border-b">
        <div className="w-12"></div>
        {weekDates.map((dayDate, i) => (
          <div
            key={dayDate.toString()}
            className={cn(
              'text-center flex-1 gap-2 py-3 text-sm font-medium flex flex-col items-center justify-center transition-colors',
              highlightWeekends && weekendIndices.includes(i) && 'bg-accent/5 weekend'
            )}
          >
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              {format(dayDate, 'E', { locale })}
            </div>
            <span
              className={cn(
                'h-8 w-8 grid place-content-center rounded-full font-semibold transition-all',
                isToday(dayDate)
                  ? 'bg-primary text-primary-foreground shadow-md scale-110'
                  : 'group-hover:bg-accent'
              )}
            >
              {format(dayDate, 'd')}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <div className="w-fit">
          <TimeTable />
        </div>
        <div className="grid grid-cols-7 flex-1 min-w-0">
          {weekDates.map((dayDate, i) => {
            return (
              <div
                className={cn(
                  'h-full text-sm text-muted-foreground border-l first:border-l-0 relative',
                  highlightWeekends && weekendIndices.includes(i) && 'bg-accent/5 weekend'
                )}
                key={dayDate.toString()}
              >
                {/* Hour grid lines */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-20 border-b border-border/50 hover:bg-accent/5 transition-colors"
                  />
                ))}
                {/* Events overlay */}
                <DayTimelineEvents events={events} dayDate={dayDate} hourHeight={HOUR_HEIGHT} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { CalendarWeekView };
