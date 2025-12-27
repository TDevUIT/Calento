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
  isSameHour,
  setHours,
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
  type HTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { EventOrTaskCard } from '../shared/EventOrTaskCard';
import { useCalendarSettings } from '../shared/CalendarSettingsProvider';
import type { Event } from '@/interface';
import type { Task } from '@/interface';
import { calculateEventLayouts, getEventLayoutStyles, getEventTextClasses } from '@/utils';
import { getStoredCalendarView, saveCalendarView } from '@/utils';

const fixEmojiText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/\u00F0\u009F"\u008B/g, String.fromCodePoint(0x1f4cb)) // Clipboard
    .replace(/\u00F0\u009F"\u0085/g, String.fromCodePoint(0x1f4c5)) // Calendar
    .replace(/\u00E2\u009C\u0085/g, String.fromCodePoint(0x2705)) // Checkmark
    .replace(/\u00F0\u009F\u009A\u0080/g, String.fromCodePoint(0x1f680)) // Rocket
    .replace(/\u00F0\u009F\u008E\u0089/g, String.fromCodePoint(0x1f389)) // Party
    .replace(/\u00F0\u009F'\u00A1/g, String.fromCodePoint(0x1f4a1)) // Bulb
    .replace(/\u00E2\u00AD/g, String.fromCodePoint(0x2b50)); // Star
};

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
  color?: string;
  description?: string;
  calendarId?: string;
  teamId?: string;
  team?: {
    id: string;
    name?: string;
  };
  creator?: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
  type?: 'event' | 'task';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  taskData?: Task;
};

function convertToFullEvent(calendarEvent: CalendarEvent): Event {
  return {
    id: calendarEvent.id,
    user_id: '',
    calendar_id: calendarEvent.calendarId || '',
    team_id: calendarEvent.teamId,
    title: calendarEvent.title,
    start_time: calendarEvent.start,
    end_time: calendarEvent.end,
    description: calendarEvent.description,
    color: calendarEvent.color,
    is_all_day: false,
    created_at: new Date(),
    updated_at: new Date(),
    creator: calendarEvent.creator,
    team: calendarEvent.team,
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
  const [view, setView] = useState<View>(() => {
    if (typeof window !== 'undefined') {
      return getStoredCalendarView();
    }
    return _defaultMode || 'day';
  });

  const [date, setDate] = useState(defaultDate);
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);

  useEffect(() => {
    setEvents(defaultEvents);
  }, [defaultEvents]);

  const today = useMemo(() => new Date(), []);

  const changeView = (newView: View) => {
    setView(newView);
    saveCalendarView(newView);
    onChangeView?.(newView);
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
  HTMLAttributes<HTMLButtonElement> & {
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
        saveCalendarView(view);
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
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);

  const hourEvents = events.filter((event) => isSameHour(event.start, hour));

  const eventLayouts = calculateEventLayouts(hourEvents);

  const stackedEvents = eventLayouts.filter((l) => l.isStacked);
  const hasStackedEvents = stackedEvents.length > 0;

  return (
    <div className="h-20 last:border-b relative group hover:bg-accent/5 transition-colors">
      {eventLayouts.map((layout) => {
        const { event } = layout;
        const hoursDifference = differenceInMinutes(event.end, event.start) / 60;
        const startPosition = event.start.getMinutes() / 60;

        const layoutStyles = getEventLayoutStyles(layout);

        const eventColor = event.color || '#3b82f6';
        const { titleClass, timeClass } = getEventTextClasses(eventColor);

        const isHovered = hoveredEventId === event.id;
        const showStackBadge = layout.isStacked && layout.stackIndex === 0 && layout.totalStacked;

        return (
          <EventOrTaskCard
            key={event.id}
            event={event}
            fullEvent={event.type !== 'task' ? convertToFullEvent(event) : undefined}
            fullTask={event.taskData}
            side="right"
            align="start"
            onEdit={() => onEventClick?.(event)}
            onDelete={() => {}}
          >
            <div
              className={cn(
                'absolute mx-0.5 font-medium p-2 text-xs cursor-pointer transition-all border event-column',
                layout.isStacked && 'hover:z-[1000]',
                isHovered && 'shadow-xl z-[999]',
                !isHovered && 'shadow-sm hover:shadow-lg'
              )}
              style={{
                top: `${startPosition * 100}%`,
                height: `${hoursDifference * 100}%`,
                backgroundColor: event.type === 'task' ? 'white' : eventColor,
                borderColor: event.type === 'task' ? eventColor : 'rgba(0,0,0,0.1)',
                borderWidth: event.type === 'task' ? '2px' : '1px',
                borderLeftWidth: event.type === 'task' ? '4px' : '1px',
                borderStyle: event.type === 'task' ? 'dashed' : 'solid',
                ...layoutStyles,
                padding: layout.totalColumns > 2 ? '4px 6px' : '8px 10px',
                opacity: layout.isStacked && !isHovered ? 0.95 : 1,
              }}
              onClick={() => onEventClick?.(event)}
              onMouseEnter={() => setHoveredEventId(event.id)}
              onMouseLeave={() => setHoveredEventId(null)}
            >
              <div
                className={`font-bold truncate leading-tight ${
                  event.type === 'task' ? 'text-gray-900' : titleClass
                }`}
              >
                {fixEmojiText(event.title)}
              </div>
              {layout.width > 30 && (
                <div
                  className={`text-[10px] mt-0.5 font-medium leading-tight ${
                    event.type === 'task' ? 'text-gray-600' : timeClass
                  }`}
                >
                  {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                </div>
              )}
              {layout.width <= 30 && (
                <div
                  className={`text-[9px] mt-0.5 font-medium leading-tight ${
                    event.type === 'task' ? 'text-gray-600' : timeClass
                  }`}
                >
                  {format(event.start, 'HH:mm')}
                </div>
              )}

              {showStackBadge && (
                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[9px] font-bold shadow-md ring-2 ring-white z-10">
                  +{layout.totalStacked}
                </div>
              )}
            </div>
          </EventOrTaskCard>
        );
      })}

      {hasStackedEvents && (
        <div className="absolute bottom-1 right-1 text-[9px] text-muted-foreground bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-border shadow-sm">
          {eventLayouts.length} events
        </div>
      )}
    </div>
  );
};

const CalendarNextTrigger = forwardRef<
  HTMLButtonElement,
  HTMLAttributes<HTMLButtonElement>
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
  HTMLAttributes<HTMLButtonElement>
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
  HTMLAttributes<HTMLButtonElement>
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
  const { dateFormat } = useCalendarSettings();

  const getDateFormat = () => {
    if (view === 'day') {
      switch (dateFormat) {
        case 'DD/MM/YYYY':
          return 'EEEE, dd MMMM yyyy';
        case 'MM/DD/YYYY':
          return 'EEEE, MMMM dd, yyyy';
        case 'YYYY-MM-DD':
          return 'EEEE, yyyy MMMM dd';
        default:
          return 'EEEE, dd MMMM yyyy';
      }
    }
    return 'MMMM yyyy';
  };

  return (
    <time dateTime={date.toISOString()} className="tabular-nums" suppressHydrationWarning>
      {format(date, getDateFormat())}
    </time>
  );
};

const TimeTable = () => {
  const now = new Date();
  const { timeFormat } = useCalendarSettings();

  const formatHour = (hour: number) => {
    const actualHour = hour === 24 ? 0 : hour;
    const date = new Date();
    date.setHours(actualHour, 0, 0, 0);

    if (timeFormat === '12h') {
      return format(date, 'h a');
    }
    return `${actualHour.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="pr-3 w-14 text-right pt-3">
      {Array.from(Array(25).keys()).map((hour) => {
        const isCurrentHour = now.getHours() === hour;
        return (
          <div
            className={cn(
              'relative text-xs h-20 last:h-0 transition-colors',
              isCurrentHour ? 'text-primary font-semibold' : 'text-muted-foreground'
            )}
            key={hour}
          >
            {isCurrentHour && (
              <div
                className="absolute z-[1001] left-full translate-x-3 w-dvw h-[2px] bg-primary shadow-lg animate-pulse"
                style={{
                  top: `${(now.getMinutes() / 60) * 100}%`,
                }}
              >
                <div className="size-2.5 rounded-full bg-primary absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-md ring-2 ring-primary/20"></div>
              </div>
            )}
            <p className="top-0 -translate-y-1/2 bg-card px-1">{formatHour(hour)}</p>
          </div>
        );
      })}
    </div>
  );
};

const getDaysInMonth = (date: Date, weekStartsOnDay: 0 | 1 | 6 = 0) => {
  const startOfMonthDate = startOfMonth(date);
  const startOfWeekForMonth = startOfWeek(startOfMonthDate, {
    weekStartsOn: weekStartsOnDay,
  });

  let currentDate = startOfWeekForMonth;
  const calendar = [];

  while (calendar.length < 42) {
    calendar.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return calendar;
};

const generateWeekdays = (locale: Locale, weekStartsOnDay: 0 | 1 | 6 = 0) => {
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(startOfWeek(new Date(), { weekStartsOn: weekStartsOnDay }), i);
    daysOfWeek.push(format(date, 'EEEEEE', { locale }));
  }
  return daysOfWeek;
};

const getWeekendIndices = (weekStartsOnDay: 0 | 1 | 6) => {
  const weekendDays = [0, 6];
  return weekendDays.map((day) => {
    return (day - weekStartsOnDay + 7) % 7;
  });
};

export {
  Calendar,
  CalendarCurrentDate,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarViewTrigger,
  HourEvents,
  TimeTable,
  convertToFullEvent,
  fixEmojiText,
  generateWeekdays,
  getDaysInMonth,
  getWeekendIndices,
  setHours,
};
