'use client';

import React, { createContext, useContext } from 'react';
import { useCalendarSettingsStore } from '@/store/calendar-settings.store';

interface CalendarSettingsContextType {
  timeFormat: '12h' | '24h';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  showWeekNumbers: boolean;
  highlightWeekends: boolean;
  compactMode: boolean;
  weekStartsOn: 'sunday' | 'monday' | 'saturday';
}

const CalendarSettingsContext = createContext<CalendarSettingsContextType | null>(null);

interface CalendarSettingsProviderProps {
  children: React.ReactNode;
}

export function CalendarSettingsProvider({ children }: CalendarSettingsProviderProps) {
  const timeFormat = useCalendarSettingsStore((state) => state.timeFormat);
  const dateFormat = useCalendarSettingsStore((state) => state.dateFormat);
  const showWeekNumbers = useCalendarSettingsStore((state) => state.showWeekNumbers);
  const highlightWeekends = useCalendarSettingsStore((state) => state.highlightWeekends);
  const compactMode = useCalendarSettingsStore((state) => state.compactMode);
  const weekStartsOn = useCalendarSettingsStore((state) => state.weekStartsOn);

  const value = {
    timeFormat,
    dateFormat,
    showWeekNumbers,
    highlightWeekends,
    compactMode,
    weekStartsOn,
  };

  return (
    <CalendarSettingsContext.Provider value={value}>
      {children}
    </CalendarSettingsContext.Provider>
  );
}

export function useCalendarSettings() {
  const context = useContext(CalendarSettingsContext);
  if (!context) {
    throw new Error('useCalendarSettings must be used within CalendarSettingsProvider');
  }
  return context;
}
