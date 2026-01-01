'use client';

import { format, isSameDay, isSameMonth, isToday } from 'date-fns';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { EventOrTaskCard } from '../shared/EventOrTaskCard';
import { useCalendarSettings } from '../shared/CalendarSettingsProvider';
import { getEventTextClasses } from '@/utils';
import {
  convertToFullEvent,
  generateWeekdays,
  getDaysInMonth,
  getWeekendIndices,
  useCalendar,
} from './CalendarCore';

const CalendarMonthView = () => {
  const { date, view, events, locale, onEventClick } = useCalendar();
  const { weekStartsOn, highlightWeekends } = useCalendarSettings();

  const weekStartsOnDay = weekStartsOn === 'sunday' ? 0 : weekStartsOn === 'monday' ? 1 : 6;
  const weekendIndices = getWeekendIndices(weekStartsOnDay);

  const monthDates = useMemo(() => getDaysInMonth(date, weekStartsOnDay), [date, weekStartsOnDay]);
  const weekDays = useMemo(
    () => generateWeekdays(locale, weekStartsOnDay),
    [locale, weekStartsOnDay]
  );

  if (view !== 'month') return null;

  return (
    <div className="h-full flex flex-col  border bg-[#F7F8FC] shadow-sm overflow-hidden">
      <div className="grid grid-cols-7 gap-px sticky top-0 bg-[#F7F8FC] border-b z-10">
        {weekDays.map((day, i) => (
          <div
            key={day}
            className={cn(
              'py-3 text-center text-xs font-semibold uppercase tracking-wider',
              highlightWeekends && weekendIndices.includes(i)
                ? 'text-muted-foreground/70 bg-accent/5 weekend'
                : 'text-muted-foreground'
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid overflow-auto flex-1 auto-rows-fr grid-cols-7 gap-px bg-border scrollbar-thin">
        {monthDates.map((_date, index) => {
          const currentEvents = events.filter((event) => isSameDay(event.start, _date));

          const dayIndex = index % 7;
          const isWeekend = highlightWeekends && weekendIndices.includes(dayIndex);

          return (
            <div
              className={cn(
                'bg-card p-2 text-sm overflow-auto hover:bg-accent/5 transition-colors group cursor-pointer',
                !isSameMonth(date, _date) && 'bg-muted/30 text-muted-foreground/50',
                isWeekend && 'weekend',
                isWeekend && isToday(_date) && 'weekend today'
              )}
              key={_date.toString()}
            >
              <div className="flex items-center justify-between mb-2 sticky top-0 bg-inherit">
                <span
                  className={cn(
                    'size-7 grid place-items-center rounded-full font-medium transition-all',
                    isToday(_date)
                      ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20 scale-110'
                      : 'group-hover:bg-accent'
                  )}
                >
                  {format(_date, 'd')}
                </span>
                {currentEvents.length > 0 && (
                  <span className="text-[10px] text-muted-foreground bg-accent/50 px-1.5 py-0.5 rounded-full">
                    {currentEvents.length}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {currentEvents.slice(0, 3).map((event, eventIndex) => {
                  const eventColor = event.color || '#3b82f6';
                  const { titleClass, timeClass } = getEventTextClasses(eventColor);

                  return (
                    <EventOrTaskCard
                      key={event.id}
                      event={event}
                      fullEvent={event.type !== 'task' ? convertToFullEvent(event) : undefined}
                      fullTask={event.taskData}
                      side="right"
                      align="start"
                      onEdit={() => onEventClick?.(event)}
                      onDelete={() => { }}
                    >
                      <div
                        className="px-1.5 py-1 text-xs flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-md relative rounded-sm"
                        style={{
                          backgroundColor: event.type === 'task' ? 'white' : eventColor,
                          borderColor: event.type === 'task' ? eventColor : 'rgba(0,0,0,0.1)',
                          borderWidth: event.type === 'task' ? '1px' : '1px',
                          borderLeftWidth: event.type === 'task' ? '3px' : '3px',
                          borderLeftColor: eventColor,
                          borderStyle: event.type === 'task' ? 'dashed' : 'solid',
                          zIndex: 150 + eventIndex,
                        }}
                        onClick={() => onEventClick?.(event)}
                      >
                        <time
                          className={`tabular-nums text-[10px] font-medium shrink-0 ${event.type === 'task' ? 'text-gray-500' : timeClass
                            }`}
                          suppressHydrationWarning
                        >
                          {format(event.start, 'HH:mm')}
                        </time>
                        <span
                          className={`flex-1 truncate font-medium text-[11px] ${event.type === 'task' ? 'text-gray-900' : titleClass
                            }`}
                        >
                          {event.title}
                        </span>
                      </div>
                    </EventOrTaskCard>
                  );
                })}
                {currentEvents.length > 3 && (
                  <div className="text-[10px] text-muted-foreground px-2 py-1 hover:text-primary transition-colors">
                    +{currentEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { CalendarMonthView };
