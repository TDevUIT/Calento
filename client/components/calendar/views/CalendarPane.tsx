'use client';

import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { enUS } from 'date-fns/locale';

import type { CalendarEvent } from '@/components/calendar/views';
import { DashboardCalendarWrapper } from '@/components/calendar/views/DashboardCalendarWrapper';
import { useEvents, useRecurringEvents } from '@/hook/event';
import { useTasks } from '@/hook/task';
import { useApiData } from '@/hook';
import type { Event, Task } from '@/interface';
import { getColorHex } from '@/utils';
import { getWeekStartDay } from '@/utils';
import { useControllerStore } from '@/store/controller.store';
import { useCalendarSettingsStore } from '@/store/calendar-settings.store';
import { COLORS } from '@/constants/theme.constants';
import { useKeyboardShortcuts } from '@/components/calendar/useKeyboardShortcuts';

export default function CalendarPane() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const expandedCalendarSidebar = useControllerStore((state) => state.expandedCalendarSidebar);
  const toggleCalendarSidebar = useControllerStore((state) => state.toggleCalendarSidebar);

  const defaultView = useCalendarSettingsStore((state) => state.defaultView);
  const enableKeyboardShortcuts = useCalendarSettingsStore((state) => state.enableKeyboardShortcuts);
  const weekStartsOn = useCalendarSettingsStore((state) => state.weekStartsOn);
  const timeFormat = useCalendarSettingsStore((state) => state.timeFormat);
  const dateFormat = useCalendarSettingsStore((state) => state.dateFormat);
  const showWeekNumbers = useCalendarSettingsStore((state) => state.showWeekNumbers);
  const highlightWeekends = useCalendarSettingsStore((state) => state.highlightWeekends);
  const compactMode = useCalendarSettingsStore((state) => state.compactMode);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [visibleCalendarIds, setVisibleCalendarIds] = useState<Set<string>>(new Set());
  const [visibleTeamIds, setVisibleTeamIds] = useState<Set<string>>(new Set());
  const [openEventDialog, setOpenEventDialog] = useState(false);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);

  useKeyboardShortcuts({
    onShowShortcuts: () => setShowShortcuts(true),
    onCreateEvent: () => setOpenEventDialog(true),
    enabled: enableKeyboardShortcuts,
  });

  const startDate = useMemo(() => startOfMonth(currentMonth).toISOString(), [currentMonth]);
  const endDate = useMemo(() => endOfMonth(currentMonth).toISOString(), [currentMonth]);

  const queryParams = useMemo(
    () => ({
      page: 1,
      limit: 100,
      start_date: startDate,
      end_date: endDate,
    }),
    [startDate, endDate]
  );

  const recurringQueryParams = useMemo(
    () => ({
      start_date: startDate,
      end_date: endDate,
      max_occurrences: 100,
      page: 1,
      limit: 100,
    }),
    [startDate, endDate]
  );

  const regularEventsQuery = useEvents(queryParams);
  const recurringEventsQuery = useRecurringEvents(recurringQueryParams);
  const tasksQuery = useTasks({ page: 1, limit: 100 });

  const { items: regularEvents = [] } = useApiData<Event>(regularEventsQuery);
  const { items: recurringEvents = [] } = useApiData<Event>(recurringEventsQuery);
  const { items: tasks = [] } = useApiData<Task>(tasksQuery);

  const apiEvents = useMemo(() => {
    return [...regularEvents, ...recurringEvents];
  }, [regularEvents, recurringEvents]);

  const calendarLocale = useMemo(() => {
    const weekStartsOnDay = getWeekStartDay(weekStartsOn);
    return {
      ...enUS,
      options: {
        ...enUS.options,
        weekStartsOn: weekStartsOnDay,
      },
    };
  }, [weekStartsOn]);

  const isLoading = regularEventsQuery.isLoading || recurringEventsQuery.isLoading || tasksQuery.isLoading;
  const error = regularEventsQuery.error || recurringEventsQuery.error || tasksQuery.error;

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const eventItems = apiEvents.map((event: Event) => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      description: event.description,
      calendarId: event.calendar_id,
      teamId: event.team_id,
      team: event.team,
      color: getColorHex(event.color),
      creator: event.creator,
      type: 'event' as const,
    }));

    const taskItems = tasks
      .filter((task: Task) => task.due_date && !task.is_deleted)
      .map((task: Task) => {
        const dueDate = new Date(task.due_date!);
        const priorityColors = {
          low: COLORS.PRIORITY_LOW,
          medium: COLORS.PRIORITY_MEDIUM,
          high: COLORS.PRIORITY_HIGH,
          critical: COLORS.PRIORITY_CRITICAL,
        };
        return {
          id: task.id,
          title: `📋 ${task.title}`,
          start: dueDate,
          end: new Date(dueDate.getTime() + 30 * 60000),
          description: task.description,
          color: priorityColors[task.priority],
          type: 'task' as const,
          priority: task.priority,
          status: task.status,
          taskData: task,
        };
      });

    return [...eventItems, ...taskItems];
  }, [apiEvents, tasks]);

  const filteredEvents = calendarEvents.filter((event) => {
    if (event.type === 'task') return true;

    const calendarOk = visibleCalendarIds.size === 0 || visibleCalendarIds.has(event.calendarId || '');
    const teamOk = visibleTeamIds.size === 0 || !event.teamId || visibleTeamIds.has(event.teamId);

    return calendarOk && teamOk;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading calendar events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load events</p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const handleEventClick = (event: CalendarEvent) => {
    if (event.type === 'task' && event.taskData) {
      setSelectedTask(event.taskData);
      setShowTaskDialog(true);
    } else {
      setSelectedEventId(event.id);
      setShowEditDialog(true);
    }
  };

  return (
    <DashboardCalendarWrapper
      currentMonth={currentMonth}
      setCurrentMonth={setCurrentMonth}
      filteredEvents={filteredEvents}
      handleEventClick={handleEventClick}
      expandedCalendarSidebar={expandedCalendarSidebar}
      toggleCalendarSidebar={toggleCalendarSidebar}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      openEventDialog={openEventDialog}
      setOpenEventDialog={setOpenEventDialog}
      showShortcuts={showShortcuts}
      setShowShortcuts={setShowShortcuts}
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      selectedEventId={selectedEventId}
      setSelectedEventId={setSelectedEventId}
      showEditDialog={showEditDialog}
      setShowEditDialog={setShowEditDialog}
      selectedTask={selectedTask}
      setSelectedTask={setSelectedTask}
      showTaskDialog={showTaskDialog}
      setShowTaskDialog={setShowTaskDialog}
      visibleCalendarIds={visibleCalendarIds}
      setVisibleCalendarIds={setVisibleCalendarIds}
      visibleTeamIds={visibleTeamIds}
      setVisibleTeamIds={setVisibleTeamIds}
      defaultView={defaultView}
      enableKeyboardShortcuts={enableKeyboardShortcuts}
      calendarLocale={calendarLocale}
      timeFormat={timeFormat}
      dateFormat={dateFormat}
      showWeekNumbers={showWeekNumbers}
      highlightWeekends={highlightWeekends}
      compactMode={compactMode}
    />
  );
}
