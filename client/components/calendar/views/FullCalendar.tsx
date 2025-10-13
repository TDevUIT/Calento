'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Locale,
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInMinutes,
  format,
  getMonth,
  isSameDay,
  isSameHour,
  isSameMonth,
  isToday,
  setHours,
  setMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import {
  ReactNode,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { EventHoverCard } from '../shared/EventHoverCard';
import type { Event } from '@/interface/event.interface';
import { getEventZIndexStyle } from '@/utils/event-display';

type View = 'day' | 'week' | 'month' | 'year';

type ContextType = {
  view: View;
  setView: (view: View) => void;
  date: Date;
  setDate: (date: Date) => void;
  events: CalendarEvent[];
  locale: Locale;
  setEvents: (date: CalendarEvent[]) => void;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
  enableHotkeys?: boolean;
  today: Date;
};

const Context = createContext<ContextType>({} as ContextType);

export type CalendarEvent = {
  id: string;
  start: Date;
  end: Date;
  title: string;
  color?: string; // Hex color code (e.g., #3b82f6) or preset name
  description?: string;
  calendarId?: string;
};

function convertToFullEvent(calendarEvent: CalendarEvent): Event {
  return {
    id: calendarEvent.id,
    user_id: '',
    calendar_id: calendarEvent.calendarId || '',
    title: calendarEvent.title,
    start_time: calendarEvent.start,
    end_time: calendarEvent.end,
    description: calendarEvent.description,
    color: calendarEvent.color,
    is_all_day: false,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

type CalendarProps = {
  children: ReactNode;
  defaultDate?: Date;
  events?: CalendarEvent[];
  view?: View;
  locale?: Locale;
  enableHotkeys?: boolean;
  onChangeView?: (view: View) => void;
  onEventClick?: (event: CalendarEvent) => void;
};

const Calendar = ({
  children,
  defaultDate = new Date(),
  locale = enUS,
  enableHotkeys = true,
  view: _defaultMode = 'month',
  onEventClick,
  events: defaultEvents = [],
  onChangeView,
}: CalendarProps) => {
  const [view, setView] = useState<View>(_defaultMode);
  const [date, setDate] = useState(defaultDate);
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);
  
  const today = useMemo(() => new Date(), []);

  const changeView = (view: View) => {
    setView(view);
    onChangeView?.(view);
  };

  useHotkeys('m', () => changeView('month'), {
    enabled: enableHotkeys,
  });

  useHotkeys('w', () => changeView('week'), {
    enabled: enableHotkeys,
  });

  useHotkeys('y', () => changeView('year'), {
    enabled: enableHotkeys,
  });

  useHotkeys('d', () => changeView('day'), {
    enabled: enableHotkeys,
  });

  return (
    <Context.Provider
      value={{
        view,
        setView,
        date,
        setDate,
        events,
        setEvents,
        locale,
        enableHotkeys,
        onEventClick,
        onChangeView,
        today,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useCalendar = () => useContext(Context);

const CalendarViewTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & {
    view: View;
  }
>(({ children, view, ...props }, ref) => {
  const { view: currentView, setView, onChangeView } = useCalendar();

  return (
    <Button
      aria-current={currentView === view}
      size="sm"
      variant="ghost"
      ref={ref}
      {...props}
      onClick={() => {
        setView(view);
        onChangeView?.(view);
      }}
    >
      {children}
    </Button>
  );
});
CalendarViewTrigger.displayName = 'CalendarViewTrigger';

const HourEvents = ({
  events,
  hour,
}: {
  events: CalendarEvent[];
  hour: Date;
}) => {
  const { onEventClick } = useCalendar();
  // const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  // const handleMouseOver = (eventId: string) => setHoveredEventId(eventId);
  // const handleMouseLeave = () => setHoveredEventId(null);
  
  return (
    <div className="h-20 border-t last:border-b relative group hover:bg-accent/5 transition-colors">
      {events
        .filter((event) => isSameHour(event.start, hour))
        .map((event) => {
          const hoursDifference =
            differenceInMinutes(event.end, event.start) / 60;
          const startPosition = event.start.getMinutes() / 60;

          return (
            <EventHoverCard
              key={event.id}
              event={convertToFullEvent(event)}
              side="right"
              align="start"
              onEdit={() => onEventClick?.(event)}
              onDelete={() => {}}
            >
              <div
                className="absolute left-0 right-0 mx-1 font-medium rounded-md p-2.5 text-xs shadow-sm cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 backdrop-blur-sm"
                style={{
                  top: `${startPosition * 100}%`,
                  height: `${hoursDifference * 100}%`,
                  backgroundColor: event.color ? `${event.color}26` : 'rgba(59, 130, 246, 0.15)',
                  background: event.color 
                    ? `linear-gradient(to right, ${event.color}40, ${event.color}20)` 
                    : 'linear-gradient(to right, rgba(59, 130, 246, 0.25), rgba(59, 130, 246, 0.12))',
                  ...getEventZIndexStyle(event, events, { baseZIndex: 200 }),
                }}
                onClick={() => onEventClick?.(event)}
              >
                <div 
                  className="font-semibold truncate drop-shadow-sm" 
                  style={{ 
                    color: event.color || '#1e40af',
                    textShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
                  }}
                >
                  {event.title}
                </div>
                <div 
                  className="text-[10px] opacity-80 mt-0.5 drop-shadow-sm"
                  style={{ 
                    color: event.color || '#1e40af',
                    textShadow: '0 0 6px rgba(255, 255, 255, 0.7)'
                  }}
                >
                  {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                </div>
              </div>
            </EventHoverCard>
          );
        })}
    </div>
  );
};

const CalendarDayView = () => {
  const { view, events, date } = useCalendar();

  if (view !== 'day') return null;

  const hours = [...Array(24)].map((_, i) => setHours(date, i));

  return (
    <div className="flex relative overflow-hidden h-full rounded-lg border bg-card shadow-sm mb-10">
      <TimeTable />
      <div className="flex-1">
        {hours.map((hour) => (
          <HourEvents key={hour.toString()} hour={hour} events={events} />
        ))}
      </div>
    </div>
  );
};

const CalendarWeekView = () => {
  const { view, date, locale, events } = useCalendar();

  const weekDates = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const weekDates = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(start, i);
      const hours = [...Array(24)].map((_, i) => setHours(day, i));
      weekDates.push(hours);
    }

    return weekDates;
  }, [date]);

  const headerDays = useMemo(() => {
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const result = addDays(startOfWeek(date, { weekStartsOn: 0 }), i);
      daysOfWeek.push(result);
    }
    return daysOfWeek;
  }, [date]);

  if (view !== 'week') return null;

  return (
    <div className="flex flex-col relative overflow-hidden h-full rounded-lg border bg-card shadow-sm mb-10">
      <div className="flex sticky top-0 bg-card z-10 border-b">
        <div className="w-12"></div>
        {headerDays.map((date, i) => (
          <div
            key={date.toString()}
            className={cn(
              'text-center flex-1 gap-2 py-3 text-sm font-medium flex flex-col items-center justify-center transition-colors',
              [0, 6].includes(i) && 'bg-accent/5'
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
      <div className="flex flex-1">
        <div className="w-fit">
          <TimeTable />
        </div>
        <div className="grid grid-cols-7 flex-1">
          {weekDates.map((hours, i) => {
            return (
              <div
                className={cn(
                  'h-full text-sm text-muted-foreground border-l first:border-l-0',
                  [0, 6].includes(i) && 'bg-accent/5'
                )}
                key={hours[0].toString()}
              >
                {hours.map((hour) => (
                  <HourEvents
                    key={hour.toString()}
                    hour={hour}
                    events={events}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CalendarMonthView = () => {
  const { date, view, events, locale, onEventClick } = useCalendar();

  const monthDates = useMemo(() => getDaysInMonth(date), [date]);
  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

  if (view !== 'month') return null;

  return (
    <div className="h-full flex flex-col rounded-lg border bg-card shadow-sm overflow-hidden">
      <div className="grid grid-cols-7 gap-px sticky top-0 bg-card border-b z-10">
        {weekDays.map((day, i) => (
          <div
            key={day}
            className={cn(
              'py-3 text-center text-xs font-semibold uppercase tracking-wider',
              [0, 6].includes(i) ? 'text-muted-foreground/70 bg-accent/5' : 'text-muted-foreground'
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid overflow-auto flex-1 auto-rows-fr grid-cols-7 gap-px bg-border">
        {monthDates.map((_date) => {
          const currentEvents = events.filter((event) =>
            isSameDay(event.start, _date)
          );

          return (
            <div
              className={cn(
                'bg-card p-2 text-sm overflow-auto hover:bg-accent/5 transition-colors group cursor-pointer',
                !isSameMonth(date, _date) && 'bg-muted/30 text-muted-foreground/50'
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
                {currentEvents.slice(0, 3).map((event) => {
                  return (
                    <EventHoverCard
                      key={event.id}
                      event={convertToFullEvent(event)}
                      side="right"
                      align="start"
                      onEdit={() => onEventClick?.(event)}
                      onDelete={() => {}}
                    >
                      <div
                        className="px-2 py-1.5 rounded-md text-xs flex items-center gap-2 transition-all cursor-pointer hover:shadow-md hover:scale-[1.01] relative"
                        style={{
                          backgroundColor: event.color ? `${event.color}20` : 'rgba(59, 130, 246, 0.12)',
                          ...getEventZIndexStyle(event, currentEvents, { baseZIndex: 150 }),
                        }}
                        onClick={() => onEventClick?.(event)}
                      >
                        <div
                          className="shrink-0 size-2 rounded-full transition-transform hover:scale-125 shadow-sm"
                          style={{
                            backgroundColor: event.color || '#3b82f6',
                            boxShadow: `0 0 4px ${event.color || '#3b82f6'}`,
                          }}
                        ></div>
                        <span 
                          className="flex-1 truncate font-semibold"
                          style={{ color: event.color || '#1e40af' }}
                        >
                          {event.title}
                        </span>
                        <time 
                          className="tabular-nums text-[10px] font-medium" 
                          style={{ color: event.color || '#1e40af', opacity: 0.7 }}
                          suppressHydrationWarning
                        >
                          {format(event.start, 'HH:mm')}
                        </time>
                      </div>
                    </EventHoverCard>
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

const CalendarYearView = () => {
  const { view, date, today, locale } = useCalendar();

  const months = useMemo(() => {
    if (!view) {
      return [];
    }

    return Array.from({ length: 12 }).map((_, i) => {
      return getDaysInMonth(setMonth(date, i));
    });
  }, [date, view]);

  const weekDays = useMemo(() => generateWeekdays(locale), [locale]);

  if (view !== 'year') return null;

  return (
    <div className="grid grid-cols-3 xl:grid-cols-4 gap-8 p-6 overflow-auto h-full">
      {months.map((days, i) => (
        <div key={days[0].toString()} className="rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
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
                      'aspect-square grid place-content-center size-full tabular-nums rounded-md hover:bg-accent transition-all cursor-pointer',
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

const CalendarNextTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();

  const next = useCallback(() => {
    if (view === 'day') {
      setDate(addDays(date, 1));
    } else if (view === 'week') {
      setDate(addWeeks(date, 1));
    } else if (view === 'month') {
      setDate(addMonths(date, 1));
    } else if (view === 'year') {
      setDate(addYears(date, 1));
    }
  }, [date, view, setDate]);

  useHotkeys('ArrowRight', () => next(), {
    enabled: enableHotkeys,
  });

  return (
    <Button
      size="icon"
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        next();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarNextTrigger.displayName = 'CalendarNextTrigger';

const CalendarPrevTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { date, setDate, view, enableHotkeys } = useCalendar();

  const prev = useCallback(() => {
    if (view === 'day') {
      setDate(subDays(date, 1));
    } else if (view === 'week') {
      setDate(subWeeks(date, 1));
    } else if (view === 'month') {
      setDate(subMonths(date, 1));
    } else if (view === 'year') {
      setDate(subYears(date, 1));
    }
  }, [date, view, setDate]);

  useHotkeys('ArrowLeft', () => prev(), {
    enabled: enableHotkeys,
  });

  return (
    <Button
      size="icon"
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        prev();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarPrevTrigger.displayName = 'CalendarPrevTrigger';

const CalendarTodayTrigger = forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement>
>(({ children, onClick, ...props }, ref) => {
  const { setDate, enableHotkeys, today } = useCalendar();

  const jumpToToday = useCallback(() => {
    setDate(today);
  }, [today, setDate]);

  useHotkeys('t', () => jumpToToday(), {
    enabled: enableHotkeys,
  });

  return (
    <Button
      variant="outline"
      ref={ref}
      {...props}
      onClick={(e) => {
        jumpToToday();
        onClick?.(e);
      }}
    >
      {children}
    </Button>
  );
});
CalendarTodayTrigger.displayName = 'CalendarTodayTrigger';

const CalendarCurrentDate = () => {
  const { date, view } = useCalendar();

  return (
    <time dateTime={date.toISOString()} className="tabular-nums" suppressHydrationWarning>
      {format(date, view === 'day' ? 'dd MMMM yyyy' : 'MMMM yyyy')}
    </time>
  );
};

const TimeTable = () => {
  const now = new Date();

  return (
    <div className="pr-3 w-14 text-right pt-3">
      {Array.from(Array(25).keys()).map((hour) => {
        const isCurrentHour = now.getHours() === hour;
        return (
          <div
            className={cn(
              "relative text-xs h-20 last:h-0 transition-colors",
              isCurrentHour ? "text-primary font-semibold" : "text-muted-foreground/50"
            )}
            key={hour}
          >
            {isCurrentHour && (
              <div
                className="absolute z-20 left-full translate-x-3 w-dvw h-[2px] bg-primary shadow-lg animate-pulse"
                style={{
                  top: `${(now.getMinutes() / 60) * 100}%`,
                }}
              >
                <div className="size-2.5 rounded-full bg-primary absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md ring-2 ring-primary/20"></div>
              </div>
            )}
            <p className="top-0 -translate-y-1/2 bg-card px-1">
              {hour === 24 ? '00' : hour.toString().padStart(2, '0')}:00
            </p>
          </div>
        );
      })}
    </div>
  );
};

const getDaysInMonth = (date: Date) => {
  const startOfMonthDate = startOfMonth(date);
  const startOfWeekForMonth = startOfWeek(startOfMonthDate, {
    weekStartsOn: 0,
  });

  let currentDate = startOfWeekForMonth;
  const calendar = [];

  while (calendar.length < 42) {
    calendar.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return calendar;
};

const generateWeekdays = (locale: Locale) => {
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(startOfWeek(new Date(), { weekStartsOn: 0 }), i);
    daysOfWeek.push(format(date, 'EEEEEE', { locale }));
  }
  return daysOfWeek;
};

export {
  Calendar,
  CalendarCurrentDate,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  CalendarWeekView,
  CalendarYearView,
};
