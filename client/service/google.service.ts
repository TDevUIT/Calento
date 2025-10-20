import { api, getErrorMessage } from '../config/axios';
import { 
  GoogleAuthUrl, 
  GoogleConnectionStatus, 
  SyncCalendarsResponse, 
  GoogleCalendarsListResponse, 
  RefreshTokenResponse,
  GoogleOAuthCallbackParams,
  CreateGoogleMeetRequest,
  GoogleMeetResponse,
} from '../interface/google.interface';
import { API_ROUTES } from '../constants/routes';

export const getAuthUrl = async (): Promise<GoogleAuthUrl> => {
  try {
    const response = await api.get<{ status: number; message: string; data: GoogleAuthUrl }>(API_ROUTES.GOOGLE_AUTH_URL);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getConnectionStatus = async (): Promise<GoogleConnectionStatus> => {
  try {
    const response = await api.get<{ status: number; message: string; data: GoogleConnectionStatus }>(API_ROUTES.GOOGLE_STATUS);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));  
  }
};

export const disconnect = async (): Promise<{ disconnected: boolean }> => {
  try {
    const response = await api.delete<{ status: number; message: string; data: { disconnected: boolean } }>(API_ROUTES.GOOGLE_DISCONNECT);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const syncCalendars = async (): Promise<SyncCalendarsResponse> => {
  try {
    const response = await api.post<{ status: number; message: string; data: SyncCalendarsResponse }>(API_ROUTES.GOOGLE_CALENDARS_SYNC);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getCalendars = async (): Promise<GoogleCalendarsListResponse> => {
  try {
    const response = await api.get<{ status: number; message: string; data: GoogleCalendarsListResponse }>(API_ROUTES.GOOGLE_CALENDARS_LIST);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  try {
    const response = await api.post<{ status: number; message: string; data: RefreshTokenResponse }>(API_ROUTES.GOOGLE_TOKEN_REFRESH);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const openAuthPopup = async (): Promise<GoogleOAuthCallbackParams> => {
  try {
    const { auth_url } = await getAuthUrl();
    
    const popup = window.open(
      auth_url,
      'google-auth',
      'width=600,height=700,scrollbars=yes,resizable=yes,left=' + 
      (window.screen.width / 2 - 300) + ',top=' + 
      (window.screen.height / 2 - 350)
    );

    if (!popup) {
      throw new Error('Failed to open popup window. Please allow popups for this site.');
    }

    return new Promise((resolve, reject) => {
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          resolve({ error: 'Authentication cancelled' });
        }
      }, 1000);

      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          popup.close();
          window.removeEventListener('message', messageHandler);
          resolve({ success: 'google_connected' });
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          clearInterval(checkClosed);
          popup.close();
          window.removeEventListener('message', messageHandler);
          resolve({ error: event.data.error || 'Authentication failed' });
        }
      };

      window.addEventListener('message', messageHandler);

      const timeout = setTimeout(() => {
        clearInterval(checkClosed);
        popup.close();
        window.removeEventListener('message', messageHandler);
        reject(new Error('Authentication timeout'));
      }, 5 * 60 * 1000);

      const originalResolve = resolve;
      const originalReject = reject;
      
      resolve = (value) => {
        clearTimeout(timeout);
        originalResolve(value);
      };
      
      reject = (reason) => {
        clearTimeout(timeout);
        originalReject(reason);
      };
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const handleOAuthCallback = (params: URLSearchParams): GoogleOAuthCallbackParams => {
  const result: GoogleOAuthCallbackParams = {};
  
  if (params.has('code')) result.code = params.get('code')!;
  if (params.has('state')) result.state = params.get('state')!;
  if (params.has('error')) result.error = params.get('error')!;
  if (params.has('success')) result.success = params.get('success')!;
  
  return result;
};

export const isConnected = async (): Promise<boolean> => {
  try {
    const status = await getConnectionStatus();
    return status.connected;
  } catch (error) {
    return false;
  }
};

export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const status = await getConnectionStatus();
    if (!status.connected || !status.expires_at) return true;
    
    const expiresAt = new Date(status.expires_at);
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return expiresAt <= fiveMinutesFromNow;
  } catch (error) {
    return true;
  }
};

export const ensureValidToken = async (): Promise<boolean> => {
  try {
    const isExpired = await isTokenExpired();
    if (isExpired) {
      const result = await refreshToken();
      return result.refreshed;
    }
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to refresh Google token:', getErrorMessage(error));
    }
    return false;
  }
};

export const loginWithGoogle = async (): Promise<void> => {
  try {
    console.log('[loginWithGoogle] ========== STARTING GOOGLE LOGIN ==========');
    
    const { auth_url } = await getAuthUrl();
    console.log('[loginWithGoogle] Auth URL received');

    console.log('[loginWithGoogle] Redirecting to Google OAuth...');
    window.location.href = auth_url;
    
  } catch (error) {
    console.error('[loginWithGoogle] âŒ Error:', error);
    throw new Error(getErrorMessage(error));
  }
};

export const createGoogleMeet = async (data: CreateGoogleMeetRequest): Promise<GoogleMeetResponse> => {
  try {
    const response = await api.post<{ status: number; message: string; data: GoogleMeetResponse }>(
      API_ROUTES.GOOGLE_MEET_CREATE,
      data
    );
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const googleService = {
  getAuthUrl,
  getConnectionStatus,
  disconnect,
  syncCalendars,
  getCalendars,
  refreshToken,
  openAuthPopup,
  handleOAuthCallback,
  isConnected,
  isTokenExpired,
  ensureValidToken,
  loginWithGoogle,
  createGoogleMeet,
};

export default googleService;
