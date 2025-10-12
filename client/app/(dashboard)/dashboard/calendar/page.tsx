'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Calendar,
  CalendarDayView,
  CalendarMonthView,
  CalendarNextTrigger,
  CalendarPrevTrigger,
  CalendarTodayTrigger,
  CalendarWeekView,
  CalendarYearView,
} from '@/components/calendar/views';
import { KeyboardShortcuts } from '@/components/calendar/KeyboardShortcuts';
import { DateDisplay, HeaderActions, ViewSelector, QuickActions, MonthProgress } from '@/components/calendar/header';
import { mockEvents } from './mockData';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { CalendarSidebar } from '@/components/calendar/sidebar/CalendarSidebar';
import { EventDialog } from '@/components/calendar/dialogs/EventDialog';
import { CalendarSettingsDialog } from '@/components/calendar/settings/CalendarSettingsDialog';
export default function Page() {
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useKeyboardShortcuts({
    onShowShortcuts: () => setShowShortcuts(true),
    onCreateEvent: () => setOpenEventDialog(true),
  });

  return (
    <>
    <Calendar events={mockEvents}>
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
          />
        </div>
      )}

      <EventDialog
        open={openEventDialog}
        onOpenChange={setOpenEventDialog}
        defaultDate={selectedDate}
      />

      <KeyboardShortcuts
        open={showShortcuts}
        onOpenChange={setShowShortcuts}
      />

      <CalendarSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
      />
    </Calendar>
    </>
  );
}