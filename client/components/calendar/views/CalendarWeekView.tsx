'use client';

import { addDays, format, isToday, setHours, startOfWeek } from 'date-fns';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { useCalendarSettings } from '../shared/CalendarSettingsProvider';
import { HourEvents, TimeTable, useCalendar, getWeekendIndices } from './CalendarCore';

const CalendarWeekView = () => {
  const { view, date, locale, events } = useCalendar();
  const { weekStartsOn, highlightWeekends } = useCalendarSettings();

  const weekStartsOnDay = weekStartsOn === 'sunday' ? 0 : weekStartsOn === 'monday' ? 1 : 6;
  const weekendIndices = getWeekendIndices(weekStartsOnDay);

  const weekDates = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: weekStartsOnDay });
    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      const hours = [...Array(24)].map((_, i) => setHours(day, i));
      weekDates.push(hours);
    }

    return weekDates;
  }, [date, weekStartsOnDay]);

  const headerDays = useMemo(() => {
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const result = addDays(startOfWeek(date, { weekStartsOn: weekStartsOnDay }), i);
      daysOfWeek.push(result);
    }
    return daysOfWeek;
  }, [date, weekStartsOnDay]);

  if (view !== 'week') return null;

  return (
    <div className="flex flex-col relative overflow-hidden h-full border-b border-r bg-[#F7F8FC] shadow-sm">
      <div className="flex sticky top-0 bg-[#F7F8FC] z-10 border-b">
        <div className="w-12"></div>
        {headerDays.map((date, i) => (
          <div
            key={date.toString()}
            className={cn(
              'text-center flex-1 gap-2 py-3 text-sm font-medium flex flex-col items-center justify-center transition-colors',
              highlightWeekends && weekendIndices.includes(i) && 'bg-accent/5 weekend'
            )}
          >
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              {format(date, 'E', { locale })}
            </div>
            <span
              className={cn(
                'h-8 w-8 grid place-content-center rounded-full font-semibold transition-all',
                isToday(date)
                  ? 'bg-primary text-primary-foreground shadow-md scale-110'
                  : 'group-hover:bg-accent'
              )}
            >
              {format(date, 'd')}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-thin">
        <div className="w-fit">
          <TimeTable />
        </div>
        <div className="grid grid-cols-7 flex-1 min-w-0">
          {weekDates.map((hours, i) => {
            return (
              <div
                className={cn(
                  'h-full text-sm text-muted-foreground border-l first:border-l-0',
                  highlightWeekends && weekendIndices.includes(i) && 'bg-accent/5 weekend'
                )}
                key={hours[0].toString()}
              >
                {hours.map((hour) => (
                  <HourEvents key={hour.toString()} hour={hour} events={events} />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export { CalendarWeekView };
