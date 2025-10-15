import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CalendarSettings {
  // General Settings
  defaultView: 'day' | 'week' | 'month' | 'year';
  weekStartsOn: 'sunday' | 'monday' | 'saturday';
  timeFormat: '12h' | '24h';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  
  // Appearance Settings
  compactMode: boolean;
  showWeekNumbers: boolean;
  highlightWeekends: boolean;
  
  // Notification Settings
  enableNotifications: boolean;
  eventReminders: boolean;
  reminderTime: string;
  soundEnabled: boolean;
  
  // Behavior Settings
  autoSync: boolean;
  showDeclinedEvents: boolean;
  defaultEventDuration: string;
  enableKeyboardShortcuts: boolean;
}

interface CalendarSettingsActions {
  updateSetting: <K extends keyof CalendarSettings>(
    key: K,
    value: CalendarSettings[K]
  ) => void;
  updateSettings: (settings: Partial<CalendarSettings>) => void;
  resetSettings: () => void;
}

interface CalendarSettingsStore extends CalendarSettings, CalendarSettingsActions {}

const initialSettings: CalendarSettings = {
  // General
  defaultView: 'week',
  weekStartsOn: 'monday',
  timeFormat: '24h',
  dateFormat: 'DD/MM/YYYY',
  
  // Appearance
  compactMode: false,
  showWeekNumbers: true,
  highlightWeekends: true,
  
  // Notifications
  enableNotifications: true,
  eventReminders: true,
  reminderTime: '15',
  soundEnabled: false,
  
  // Behavior
  autoSync: true,
  showDeclinedEvents: false,
  defaultEventDuration: '60',
  enableKeyboardShortcuts: true,
};

export const useCalendarSettingsStore = create<CalendarSettingsStore>()(
  persist(
    (set) => ({
      ...initialSettings,

      updateSetting: (key, value) =>
        set((state) => ({ ...state, [key]: value })),

      updateSettings: (settings) =>
        set((state) => ({ ...state, ...settings })),

      resetSettings: () => set(initialSettings),
    }),
    {
      name: 'tempra-calendar-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        defaultView: state.defaultView,
        weekStartsOn: state.weekStartsOn,
        timeFormat: state.timeFormat,
        dateFormat: state.dateFormat,
        compactMode: state.compactMode,
        showWeekNumbers: state.showWeekNumbers,
        highlightWeekends: state.highlightWeekends,
        enableNotifications: state.enableNotifications,
        eventReminders: state.eventReminders,
        reminderTime: state.reminderTime,
        soundEnabled: state.soundEnabled,
        autoSync: state.autoSync,
        showDeclinedEvents: state.showDeclinedEvents,
        defaultEventDuration: state.defaultEventDuration,
        enableKeyboardShortcuts: state.enableKeyboardShortcuts,
      }),
    }
  )
);
