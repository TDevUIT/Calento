export interface GoogleAuthUrl {
  auth_url: string;
}

export interface GoogleConnectionStatus {
  connected: boolean;
  expires_at?: Date;
  scope?: string;
}

export interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
  backgroundColor?: string;
  foregroundColor?: string;
  accessRole?: string;
  timeZone?: string;
}

export interface SyncCalendarsResponse {
  success: boolean;
  count: number;
  calendar_ids?: string[];
}

export interface GoogleCalendarsListResponse {
  calendars: GoogleCalendar[];
  count: number;
}

export interface RefreshTokenResponse {
  refreshed: boolean;
}

export interface UseGoogleAuthReturn {
  connectionStatus: GoogleConnectionStatus | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  getAuthUrl: () => Promise<string>;
  disconnect: () => Promise<void>;
  refreshToken: () => Promise<void>;
  syncCalendars: () => Promise<void>;
  getCalendars: () => Promise<GoogleCalendar[]>;
  checkConnectionStatus: () => Promise<void>;
  clearError: () => void;
}

export interface UseGoogleCalendarsReturn {
  calendars: GoogleCalendar[];
  isLoading: boolean;
  error: string | null;
  syncCalendars: () => Promise<void>;
  refetch: () => Promise<void>;
}

export interface GoogleOAuthCallbackParams {
  code?: string;
  state?: string;
  error?: string;
  success?: string;
}

export interface GoogleServiceConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  responseType: 'code';
  accessType: 'offline';
  prompt: 'consent' | 'select_account' | 'none';
}

export interface CreateGoogleMeetRequest {
  summary: string;
  description?: string;
  start_time: string;
  end_time: string;
}

export interface GoogleMeetResponse {
  url: string;
  id?: string;
  entry_points?: any[];
}
