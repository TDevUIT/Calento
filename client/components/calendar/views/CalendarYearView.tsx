'use client';

import { format, getMonth, isSameDay, setMonth } from 'date-fns';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { useCalendarSettings } from '../shared/CalendarSettingsProvider';
import { generateWeekdays, getDaysInMonth, useCalendar } from './CalendarCore';

const CalendarYearView = () => {
  const { view, date, today, locale } = useCalendar();
  const { weekStartsOn } = useCalendarSettings();

  const weekStartsOnDay = weekStartsOn === 'sunday' ? 0 : weekStartsOn === 'monday' ? 1 : 6;

  const months = useMemo(() => {
    if (!view) {
      return [];
    }

    return Array.from({ length: 12 }).map((_, i) => {
      return getDaysInMonth(setMonth(date, i), weekStartsOnDay);
    });
  }, [date, view, weekStartsOnDay]);

  const weekDays = useMemo(
    () => generateWeekdays(locale, weekStartsOnDay),
    [locale, weekStartsOnDay]
  );

  if (view !== 'year') return null;

  return (
    <div className="grid grid-cols-3 xl:grid-cols-4 gap-8 p-6 overflow-auto h-full bg-[#F7F8FC] scrollbar-thin">
      {months.map((days, i) => (
        <div
          key={days[0].toString()}
          className=" border bg-card p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="text-lg font-semibold mb-4 text-foreground">
            {format(setMonth(date, i), 'MMMM', { locale })}
          </div>

          <div className="grid grid-cols-7 gap-1 mb-3">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-[10px] font-medium text-muted-foreground uppercase"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid gap-1 text-center grid-cols-7 text-xs tabular-nums">
            {days.map((_date) => {
              return (
                <div
                  key={_date.toString()}
                  className={cn(
                    'transition-colors',
                    getMonth(_date) !== i && 'text-muted-foreground/40'
                  )}
                >
                  <div
                    className={cn(
                      'aspect-square grid place-content-center size-full tabular-nums  hover:bg-accent transition-all cursor-pointer',
                      isSameDay(today, _date) &&
                        getMonth(_date) === i &&
                        'bg-primary text-primary-foreground font-semibold shadow-sm ring-2 ring-primary/20'
                    )}
                  >
                    {format(_date, 'd')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export { CalendarYearView };
