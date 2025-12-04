import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { GoogleConnectionStatus, GoogleCalendar } from '../interface/google.interface';
import { 
  getAuthUrl, 
  getConnectionStatus, 
  disconnect, 
  refreshToken, 
  syncCalendars, 
  getCalendars 
} from '../service';

interface GoogleState {
  connectionStatus: GoogleConnectionStatus | null;
  isConnected: boolean;
  calendars: GoogleCalendar[];
  isLoading: boolean;
  error: string | null;
}

interface GoogleActions {
  setConnectionStatus: (status: GoogleConnectionStatus | null) => void;
  setCalendars: (calendars: GoogleCalendar[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  getAuthUrl: () => Promise<string>;
  checkConnectionStatus: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshToken: () => Promise<void>;
  syncCalendars: () => Promise<void>;
  getCalendars: () => Promise<GoogleCalendar[]>;
  
  reset: () => void;
}

interface GoogleStore extends GoogleState, GoogleActions {}

const initialState: GoogleState = {
  connectionStatus: null,
  isConnected: false,
  calendars: [],
  isLoading: false,
  error: null,
};

export const useGoogleStore = create<GoogleStore>()(
  immer((set, get) => ({
    ...initialState,

    setConnectionStatus: (status) =>
      set((state) => {
        state.connectionStatus = status;
        state.isConnected = !!status?.connected;
      }),

    setCalendars: (calendars) =>
      set((state) => {
        state.calendars = calendars;
      }),

    setLoading: (loading) =>
      set((state) => {
        state.isLoading = loading;
      }),

    setError: (error) =>
      set((state) => {
        state.error = error;
      }),

    clearError: () =>
      set((state) => {
        state.error = null;
      }),

    getAuthUrl: async () => {
      try {
        set((state) => {
          state.error = null;
        });

        const result = await getAuthUrl();
        return result.auth_url;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get auth URL';
        
        set((state) => {
          state.error = message;
        });
        
        throw new Error(message);
      }
    },

    checkConnectionStatus: async () => {
      try {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        const status = await getConnectionStatus();
        
        set((state) => {
          state.connectionStatus = status;
          state.isConnected = !!status.connected;
          state.isLoading = false;
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to check connection status';
        
        set((state) => {
          state.error = message;
          state.isLoading = false;
        });
        
        throw new Error(message);
      }
    },

    disconnect: async () => {
      try {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        await disconnect();
        
        set((state) => {
          state.connectionStatus = null;
          state.isConnected = false;
          state.calendars = [];
          state.isLoading = false;
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to disconnect';
        
        set((state) => {
          state.error = message;
          state.isLoading = false;
        });
        
        throw new Error(message);
      }
    },

    refreshToken: async () => {
      try {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        await refreshToken();
        await get().checkConnectionStatus();
        
        set((state) => {
          state.isLoading = false;
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to refresh token';
        
        set((state) => {
          state.error = message;
          state.isLoading = false;
        });
        
        throw new Error(message);
      }
    },

    syncCalendars: async () => {
      try {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        await syncCalendars();
        const calendars = await get().getCalendars();
        
        set((state) => {
          state.calendars = calendars;
          state.isLoading = false;
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to sync calendars';
        
        set((state) => {
          state.error = message;
          state.isLoading = false;
        });
        
        throw new Error(message);
      }
    },

    getCalendars: async () => {
      try {
        set((state) => {
          state.error = null;
        });

        const result = await getCalendars();
        const calendars = result.calendars;
        
        set((state) => {
          state.calendars = calendars;
        });
        
        return calendars;
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to get calendars';
        
        set((state) => {
          state.error = message;
        });
        
        throw new Error(message);
      }
    },

    reset: () => set(() => initialState),
  }))
);
