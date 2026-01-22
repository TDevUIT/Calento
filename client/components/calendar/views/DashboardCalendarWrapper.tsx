'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Locale } from 'date-fns/locale';

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
import { DateDisplay, HeaderActions, ViewSelector, QuickActions } from '@/components/calendar/header';
import { getCalendarStyles } from '@/utils';
import { CalendarSidebar } from '@/components/calendar/sidebar/CalendarSidebar';
import { CreateEventDialog, EditEventDialog, ViewEventDialog } from '@/components/calendar/dialogs';
import { EditTaskDialog } from '@/components/task/EditTaskDialog';
import { CalendarSettingsDialog } from '@/components/calendar/settings/CalendarSettingsDialog';
import { KeyboardShortcuts } from '@/components/calendar/KeyboardShortcuts';
import { CalendarSettingsProvider } from '@/components/calendar/shared/CalendarSettingsProvider';
import type { Task, Event } from '@/interface';
import { useDeleteEvent } from '@/hook/event/use-event-mutations';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export type DashboardCalendarWrapperProps = {
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
  showViewDialog: boolean;
  setShowViewDialog: (show: boolean) => void;
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  showTaskDialog: boolean;
  setShowTaskDialog: (show: boolean) => void;
  visibleCalendarIds: Set<string>;
  setVisibleCalendarIds: (ids: Set<string>) => void;
  visibleTeamIds: Set<string>;
  setVisibleTeamIds: (ids: Set<string>) => void;
  defaultView: 'day' | 'week' | 'month' | 'year';
  enableKeyboardShortcuts: boolean;
  calendarLocale: Locale;
  timeFormat: '12h' | '24h';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  showWeekNumbers: boolean;
  highlightWeekends: boolean;
  compactMode: boolean;
};

export function DashboardCalendarWrapper({
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
  showViewDialog,
  setShowViewDialog,
  selectedEvent,
  setSelectedEvent,
  selectedTask,
  setSelectedTask,
  showTaskDialog,
  setShowTaskDialog,
  visibleCalendarIds,
  setVisibleCalendarIds,
  visibleTeamIds,
  setVisibleTeamIds,
  defaultView,
  enableKeyboardShortcuts,
  calendarLocale,
  highlightWeekends,
  compactMode,
}: DashboardCalendarWrapperProps) {
  const calendarStyles = getCalendarStyles(compactMode, highlightWeekends);
  const deleteEventMutation = useDeleteEvent();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const handleDeleteClick = (eventId: string) => {
    setEventToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      deleteEventMutation.mutate(eventToDelete);
      setDeleteDialogOpen(false);
      setEventToDelete(null);
      // Close the view dialog if open
      if (showViewDialog) {
        setShowViewDialog(false);
        setSelectedEvent(null);
      }
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEventId(event.id);
    setShowEditDialog(true);
  };

  const handleEditFromView = () => {
    if (selectedEvent) {
      setShowViewDialog(false);
      setSelectedEventId(selectedEvent.id);
      setShowEditDialog(true);
      setSelectedEvent(null);
    }
  };

  const DashboardHeaderCalendarPortal = () => {
    const [slot, setSlot] = useState<HTMLElement | null>(null);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      setSlot(document.getElementById('dashboard-header-calendar-slot'));
    }, []);

    if (!slot) return null;

    return createPortal(
      <div className="flex items-center w-full min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          {/* <div className="hidden md:flex items-center gap-2 min-w-0">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold truncate">Calendar</span>
          </div> */}

          <div className="hidden sm:block h-6 w-px bg-border" />

          <CalendarTodayTrigger className="h-9 px-3 hover:bg-gray-100 hover:rounded-xl transition-colors">
            Today
          </CalendarTodayTrigger>
        </div>

        <div className="flex-1 flex items-center justify-center min-w-0 px-2">
          <div className="flex items-center gap-2 min-w-0">
            <CalendarPrevTrigger className="h-9 w-9 hover:bg-gray-100 hover:rounded-xl transition-colors">
              <ChevronLeft size={18} />
              <span className="sr-only">Previous</span>
            </CalendarPrevTrigger>

            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">
                <DateDisplay />
              </div>
            </div>

            <CalendarNextTrigger className="h-9 w-9 hover:bg-gray-100 hover:rounded-xl transition-colors">
              <ChevronRight size={18} />
              <span className="sr-only">Next</span>
            </CalendarNextTrigger>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ViewSelector />
          <div className="hidden sm:block h-6 w-px bg-border" />
          <QuickActions onCreateEvent={() => setOpenEventDialog(true)} />
          <div className="hidden md:block h-6 w-px bg-border" />
          <div className="hidden md:block">
            <HeaderActions
              showSidebar={expandedCalendarSidebar}
              onToggleSidebar={toggleCalendarSidebar}
              onOpenSettings={() => setShowSettings(true)}
              onOpenShortcuts={() => setShowShortcuts(true)}
            />
          </div>
        </div>
      </div>,
      slot
    );
  };

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
        onEditEvent={handleEditEvent}
        defaultDate={currentMonth}
        view={defaultView}
        enableHotkeys={enableKeyboardShortcuts}
        locale={calendarLocale}
      >
        <CalendarDateSync onDateChange={setCurrentMonth} />

        <DashboardHeaderCalendarPortal />

        <div className="relative h-full">
          <div
            className={`bg-[#F7F8FC] h-full overflow-hidden ${calendarStyles.container}`}
          >
            <div className="h-full overflow-hidden">
              <CalendarDayView />
              <CalendarWeekView />
              <CalendarMonthView />
              <CalendarYearView />
            </div>
          </div>

          {expandedCalendarSidebar && (
            <div className="absolute inset-y-0 right-0 z-[5000] w-[460px] animate-in slide-in-from-right duration-300">
              <CalendarSidebar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onCreateEvent={() => setOpenEventDialog(true)}
                onClose={toggleCalendarSidebar}
                visibleCalendarIds={visibleCalendarIds}
                onVisibleCalendarIdsChange={setVisibleCalendarIds}
                visibleTeamIds={visibleTeamIds}
                onVisibleTeamIdsChange={setVisibleTeamIds}
              />
            </div>
          )}
        </div>

        <CreateEventDialog
          open={openEventDialog}
          onOpenChange={setOpenEventDialog}
          defaultStartTime={selectedDate}
        />

        <KeyboardShortcuts open={showShortcuts} onOpenChange={setShowShortcuts} />

        <CalendarSettingsDialog open={showSettings} onOpenChange={setShowSettings} />

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

        <ViewEventDialog
          open={showViewDialog}
          onOpenChange={(open) => {
            setShowViewDialog(open);
            if (!open) setSelectedEvent(null);
          }}
          event={selectedEvent}
          onEdit={handleEditFromView}
          onDelete={() => selectedEvent && handleDeleteClick(selectedEvent.id)}
        />

        {selectedTask && (
          <EditTaskDialog
            task={selectedTask}
            open={showTaskDialog}
            onClose={() => {
              setShowTaskDialog(false);
              setSelectedTask(null);
            }}
          />
        )}
      </Calendar>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEventToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CalendarSettingsProvider>
  );
}
