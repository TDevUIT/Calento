'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { startOfMonth, endOfMonth } from 'date-fns';
import { enUS, type Locale } from 'date-fns/locale';
import {
  Calendar,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarWeekView,
  CalendarYearView,
  useCalendar,
  type CalendarEvent,
} from '@/components/calendar/views';
import { KeyboardShortcuts } from '@/components/calendar/KeyboardShortcuts';
import { DateDisplay, HeaderActions, ViewSelector, QuickActions, MonthProgress } from '@/components/calendar/header';
import { useEvents, useRecurringEvents } from '@/hook/event';
import { useTasks } from '@/hook/task';
import { useApiData } from '@/hook/use-api-data';
import type { Event } from '@/interface/event.interface';
import type { Task } from '@/interface/task.interface';
import { useQueryClient } from '@tanstack/react-query';
import { EVENT_QUERY_KEYS } from '@/hook/event/query-keys';
import { getColorHex } from '@/utils/colors';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { getWeekStartDay } from '@/utils/calendar-format';
import { getCalendarStyles } from '@/utils/calendar-styles';
import { CalendarSidebar } from '@/components/calendar/sidebar/CalendarSidebar';
import { CreateEventDialog, EditEventDialog } from '@/components/calendar/dialogs';
import { TaskDetailDialog } from '@/components/calendar/dialogs/TaskDetailDialog';
import { CalendarSettingsDialog } from '@/components/calendar/settings/CalendarSettingsDialog';
import { CalendarSettingsProvider } from '@/components/calendar/shared/CalendarSettingsProvider';
import { useControllerStore } from '@/store/controller.store';
import { useCalendarSettingsStore } from '@/store/calendar-settings.store';

export default function Page() {
  const queryClient = useQueryClient();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const { expandedCalendarSidebar, toggleCalendarSidebar } = useControllerStore();
  
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
  const [openEventDialog, setOpenEventDialog] = useState(false);
  
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  
  useKeyboardShortcuts({
    onShowShortcuts: () => setShowShortcuts(true),
    onCreateEvent: () => setOpenEventDialog(true),
    enabled: enableKeyboardShortcuts,
  });

  const startDate = useMemo(() => startOfMonth(currentMonth).toISOString(), [currentMonth]);
  const endDate = useMemo(() => endOfMonth(currentMonth).toISOString(), [currentMonth]);

  console.log('📅 Current Month Range:', {
    currentMonth: currentMonth,
    startDate,
    endDate,
  });

  const queryParams = useMemo(() => ({
    page: 1,
    limit: 100,
    start_date: startDate,
    end_date: endDate,
  }), [startDate, endDate]);

  const recurringQueryParams = useMemo(() => ({
    start_date: startDate,
    end_date: endDate,
    max_occurrences: 100,
    page: 1,
    limit: 100,
  }), [startDate, endDate]);

  const regularEventsQuery = useEvents(queryParams);
  const recurringEventsQuery = useRecurringEvents(recurringQueryParams);
  const tasksQuery = useTasks({ page: 1, limit: 100 });

  useEffect(() => {
    queryClient.invalidateQueries({ 
      queryKey: EVENT_QUERY_KEYS.all,
      refetchType: 'active',
    });
    
    Promise.all([
      regularEventsQuery.refetch(),
      recurringEventsQuery.refetch(),
      tasksQuery.refetch(),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, startDate, endDate]);
  
  const { items: regularEvents = [] } = useApiData<Event>(regularEventsQuery);
  const { items: recurringEvents = [] } = useApiData<Event>(recurringEventsQuery);
  const { items: tasks = [] } = useApiData<Task>(tasksQuery);

  console.log('🔎 Tasks Query Debug:', {
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    data: tasksQuery.data,
    extractedTasks: tasks,
  });
  
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
      color: getColorHex(event.color),
      creator: event.creator,
      type: 'event' as const,
    }));

    const taskItems = tasks
      .filter((task: Task) => task.due_date && !task.is_deleted)
      .map((task: Task) => {
        const dueDate = new Date(task.due_date!);
        const priorityColors = {
          low: '#94a3b8',
          medium: '#3b82f6',
          high: '#f59e0b',
          critical: '#ef4444',
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
        };
      });

    console.log('📊 Calendar Debug:', {
      totalTasks: tasks.length,
      tasksWithDueDate: tasks.filter((t: Task) => t.due_date && !t.is_deleted).length,
      taskItemsCount: taskItems.length,
      rawTasks: tasks,
      convertedTaskItems: taskItems,
    });

    return [...eventItems, ...taskItems];
  }, [apiEvents, tasks]);

  const filteredEvents = calendarEvents.filter(event => {
    // Always show tasks regardless of calendar filters
    if (event.type === 'task') return true;
    // Filter events by calendar visibility
    return visibleCalendarIds.size === 0 || visibleCalendarIds.has(event.calendarId || '');
  });

  console.log('🔍 Filtered Events:', {
    totalCalendarEvents: calendarEvents.length,
    filteredEventsCount: filteredEvents.length,
    tasksInFiltered: filteredEvents.filter(e => e.type === 'task').length,
    eventsInFiltered: filteredEvents.filter(e => e.type === 'event').length,
    visibleCalendarIds: Array.from(visibleCalendarIds),
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
    if (event.type === 'task') {
      setSelectedTaskId(event.id);
      setShowTaskDialog(true);
    } else {
      setSelectedEventId(event.id);
      setShowEditDialog(true);
    }
  };
  
  return (
    <CalendarWrapper
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
      selectedTaskId={selectedTaskId}
      setSelectedTaskId={setSelectedTaskId}
      showTaskDialog={showTaskDialog}
      setShowTaskDialog={setShowTaskDialog}
      visibleCalendarIds={visibleCalendarIds}
      setVisibleCalendarIds={setVisibleCalendarIds}
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

function CalendarWrapper({
  currentMonth,
  setCurrentMonth,
  filteredEvents,
  handleEventClick,
  expandedCalendarSidebar,
  toggleCalendarSidebar,
  selectedDate,
  setSelectedDate,
  openEventDialog,
  setOpenEventDialog,
  showShortcuts,
  setShowShortcuts,
  showSettings,
  setShowSettings,
  selectedEventId,
  setSelectedEventId,
  showEditDialog,
  setShowEditDialog,
  selectedTaskId,
  setSelectedTaskId,
  showTaskDialog,
  setShowTaskDialog,
  visibleCalendarIds,
  setVisibleCalendarIds,
  defaultView,
  enableKeyboardShortcuts,
  calendarLocale,
  // timeFormat,
  // dateFormat, 
  // showWeekNumbers,
  highlightWeekends,
  compactMode,
}: {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  filteredEvents: CalendarEvent[];
  handleEventClick: (event: CalendarEvent) => void;
  expandedCalendarSidebar: boolean;
  toggleCalendarSidebar: () => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  openEventDialog: boolean;
  setOpenEventDialog: (open: boolean) => void;
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  selectedEventId: string | null;
  setSelectedEventId: (id: string | null) => void;
  showEditDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  showTaskDialog: boolean;
  setShowTaskDialog: (show: boolean) => void;
  visibleCalendarIds: Set<string>;
  setVisibleCalendarIds: (ids: Set<string>) => void;
  defaultView: 'day' | 'week' | 'month' | 'year';
  enableKeyboardShortcuts: boolean;
  calendarLocale: Locale;
  timeFormat: '12h' | '24h';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  showWeekNumbers: boolean;
  highlightWeekends: boolean;
  compactMode: boolean;
}) {
  
  const calendarStyles = getCalendarStyles(compactMode, highlightWeekends);
  
  const CalendarDateSync = ({ onDateChange }: { onDateChange: (date: Date) => void }) => {
    const { date } = useCalendar();
    
    useEffect(() => {
      onDateChange(date);
    }, [date, onDateChange]);
    
    return null;
  };

  return (
    <CalendarSettingsProvider>
      <Calendar 
        events={filteredEvents}
        onEventClick={handleEventClick}
        defaultDate={currentMonth}
        view={defaultView}
        enableHotkeys={enableKeyboardShortcuts}
        locale={calendarLocale}
      >
      <CalendarDateSync onDateChange={setCurrentMonth} />
      
      <div className={`bg-background flex -mx-2 ${calendarStyles.container}`}>
        <div className="flex-1 flex flex-col min-h-screen">
          <div className="px-4 md:px-6">
            <div className="flex flex-wrap items-center gap-3 mb-4 pt-2">
              <div className="flex items-center gap-3">
                <DateDisplay />

                <div className="flex items-center gap-2">
                  <CalendarPrevTrigger className="hover:bg-accent hover:scale-105 transition-all">
                    <ChevronLeft size={18} />
                    <span className="sr-only">Previous</span>
                  </CalendarPrevTrigger>

                  <CalendarTodayTrigger className="font-medium hover:scale-105 transition-all">
                    Today
                  </CalendarTodayTrigger>

                  <CalendarNextTrigger className="hover:bg-accent hover:scale-105 transition-all">
                    <ChevronRight size={18} />
                    <span className="sr-only">Next</span>
                  </CalendarNextTrigger>
                </div>
              </div>

              <span className="flex-1" />

              <div className="flex items-center gap-3">
                <ViewSelector />
                <div className="h-6 w-px bg-border" />
                <QuickActions onCreateEvent={() => setOpenEventDialog(true)} />
                <div className="h-6 w-px bg-border" />
                <HeaderActions 
                  showSidebar={expandedCalendarSidebar}
                  onToggleSidebar={toggleCalendarSidebar}
                  onOpenSettings={() => setShowSettings(true)}
                  onOpenShortcuts={() => setShowShortcuts(true)}
                />
              </div>
            </div>

            <div className="mb-4">
              <MonthProgress />
            </div>
          </div>

          <div className="flex-1 overflow-hidden px-4 md:px-6">
            <CalendarDayView />
            <CalendarWeekView />
            <CalendarMonthView />
            <CalendarYearView />
          </div>
        </div>
      </div>

      {expandedCalendarSidebar && (
        <div 
          className="fixed right-0 top-14 w-[460px] animate-in slide-in-from-right duration-300"
          style={{ height: 'calc(100vh - 3.5rem)', zIndex: 2500 }}
        >
          <CalendarSidebar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onCreateEvent={() => setOpenEventDialog(true)}
            onClose={toggleCalendarSidebar}
            visibleCalendarIds={visibleCalendarIds}
            onVisibleCalendarIdsChange={setVisibleCalendarIds}
          />
        </div>
      )}

      <CreateEventDialog
        open={openEventDialog}
        onOpenChange={setOpenEventDialog}
        defaultStartTime={selectedDate}
      />

      <KeyboardShortcuts
        open={showShortcuts}
        onOpenChange={setShowShortcuts}
      />

      <CalendarSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
      />

      {selectedEventId && (
        <EditEventDialog
          open={showEditDialog}
          onOpenChange={(open) => {
            setShowEditDialog(open);
            if (!open) setSelectedEventId(null);
          }}
          eventId={selectedEventId}
        />
      )}

      <TaskDetailDialog
        taskId={selectedTaskId}
        open={showTaskDialog}
        onClose={() => {
          setShowTaskDialog(false);
          setSelectedTaskId(null);
        }}
      />
      </Calendar>
    </CalendarSettingsProvider>
  );
}