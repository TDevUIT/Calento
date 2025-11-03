import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserSettings {
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  eventReminders: boolean;
  weeklyDigest: boolean;
  newFeatures: boolean;
  marketingEmails: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: string;
  loginAlerts: boolean;
  theme: string;
  compactMode: boolean;
  showWeekNumbers: boolean;
}

interface UserSettingsActions {
  updateSetting: <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  resetSettings: () => void;
  setSettings: (settings: UserSettings) => void;
}

interface UserSettingsStore extends UserSettings, UserSettingsActions {}

const initialSettings: UserSettings = {
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  emailNotifications: true,
  pushNotifications: false,
  eventReminders: true,
  weeklyDigest: true,
  newFeatures: false,
  marketingEmails: false,
  twoFactorAuth: false,
  sessionTimeout: '30',
  loginAlerts: true,
  theme: 'system',
  compactMode: false,
  showWeekNumbers: false,
};

export const useUserSettingsStore = create<UserSettingsStore>()(
  persist(
    (set) => ({
      ...initialSettings,

      updateSetting: (key, value) =>
        set((state) => ({ ...state, [key]: value })),

      updateSettings: (settings) =>
        set((state) => ({ ...state, ...settings })),

      setSettings: (settings) => set(settings),

      resetSettings: () => set(initialSettings),
    }),
    {
      name: 'tempra-user-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
        timezone: state.timezone,
        dateFormat: state.dateFormat,
        timeFormat: state.timeFormat,
        emailNotifications: state.emailNotifications,
        pushNotifications: state.pushNotifications,
        eventReminders: state.eventReminders,
        weeklyDigest: state.weeklyDigest,
        newFeatures: state.newFeatures,
        marketingEmails: state.marketingEmails,
        twoFactorAuth: state.twoFactorAuth,
        sessionTimeout: state.sessionTimeout,
        loginAlerts: state.loginAlerts,
        theme: state.theme,
        compactMode: state.compactMode,
        showWeekNumbers: state.showWeekNumbers,
      }),
    }
  )
);
