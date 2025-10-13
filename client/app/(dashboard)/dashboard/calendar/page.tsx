'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { startOfMonth, endOfMonth } from 'date-fns';
import {
  Calendar,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarWeekView,
  CalendarYearView,
  type CalendarEvent,
} from '@/components/calendar/views';
import { KeyboardShortcuts } from '@/components/calendar/KeyboardShortcuts';
import { DateDisplay, HeaderActions, ViewSelector, QuickActions, MonthProgress } from '@/components/calendar/header';
import { useEvents } from '@/hook/event';
import { useApiData } from '@/hook/use-api-data';
import type { Event } from '@/interface/event.interface';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { CalendarSidebar } from '@/components/calendar/sidebar/CalendarSidebar';
import { CreateEventDialog, EditEventDialog } from '@/components/calendar/dialogs';
import { CalendarSettingsDialog } from '@/components/calendar/settings/CalendarSettingsDialog';
export default function Page() {
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [visibleCalendarIds, setVisibleCalendarIds] = useState<Set<string>>(new Set());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useKeyboardShortcuts({
    onShowShortcuts: () => setShowShortcuts(true),
    onCreateEvent: () => setOpenEventDialog(true),
  });

  const queryResult = useEvents({
    page: 1,
    limit: 100,
    start_date: startOfMonth(currentMonth).toISOString(),
    end_date: endOfMonth(currentMonth).toISOString(),
  });
  
  const { items: apiEvents = [], isLoading, error } = useApiData<Event>(queryResult);

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return apiEvents.map((event: Event) => ({
      id: event.id,
      title: event.title,
      start: new Date(event.start_time),
      end: new Date(event.end_time),
      description: event.description,
      calendarId: event.calendar_id,
      color: mapCalendarIdToColor(event.calendar_id),
    }));
  }, [apiEvents]);

  const filteredEvents = calendarEvents.filter(event => 
    visibleCalendarIds.size === 0 || visibleCalendarIds.has(event.calendarId || '')
  );

  // Debug: Log filtering
  console.log('🔍 Event Filtering:', {
    totalCalendarEvents: calendarEvents.length,
    visibleCalendarIds: Array.from(visibleCalendarIds),
    filteredEventsCount: filteredEvents.length,
  });

  function mapCalendarIdToColor(calendarId: string): CalendarEvent['color'] {
    const colorMap: Record<string, CalendarEvent['color']> = {
      'personal-calendar': 'blue',
      'work-calendar': 'green',
      'team-calendar': 'purple',
    };
    return colorMap[calendarId] || 'default';
  }

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
    setSelectedEventId(event.id);
    setShowEditDialog(true);
  };

  return (
    <>
    <Calendar 
      events={filteredEvents}
      onEventClick={handleEventClick}
    >
      <div className="bg-background flex -mx-2">
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
                  showSidebar={showSidebar}
                  onToggleSidebar={() => setShowSidebar(!showSidebar)}
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

      {showSidebar && (
        <div 
          className="fixed right-0 top-14 w-[460px] animate-in slide-in-from-right duration-300 z-50"
          style={{ height: 'calc(100vh - 3.5rem)' }}
        >
          <CalendarSidebar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onCreateEvent={() => setOpenEventDialog(true)}
            onClose={() => setShowSidebar(false)}
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
    </Calendar>
    </>
  );
}