import { api, getErrorMessage } from '../../config/axios';
import { API_ROUTES } from '../../constants/routes';

export interface PendingEmailNotification {
  notification_id: string;
  event_id: string;
  remind_at: string | null;
  title: string | null;
  start_time: string | null;
}

export const getPendingNotifications = async (): Promise<PendingEmailNotification[]> => {
  try {
    const response = await api.get<any>(
      API_ROUTES.NOTIFICATIONS_PENDING,
      { withCredentials: true }
    );

    const payload = response.data;

    if (Array.isArray(payload)) {
      return payload as PendingEmailNotification[];
    }

    if (Array.isArray(payload?.data)) {
      return payload.data as PendingEmailNotification[];
    }

    if (Array.isArray(payload?.data?.items)) {
      return payload.data.items as PendingEmailNotification[];
    }

    return [];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const scheduleNotificationReminders = async (horizonDays?: number): Promise<{ scheduled: number }> => {
  try {
    const response = await api.post<{ scheduled: number }>(
      API_ROUTES.NOTIFICATIONS_SCHEDULE_REMINDERS,
      undefined,
      {
        params: horizonDays ? { horizonDays } : undefined,
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const notificationService = {
  getPendingNotifications,
  scheduleNotificationReminders,
};

export default notificationService;
