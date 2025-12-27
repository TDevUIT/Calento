export type NotificationChannel = 'email' | 'slack' | 'zalo' | 'push';

export type DueEmailNotificationRow = {
  notification_id: string;
  event_id: string;
  channel: NotificationChannel;
  remind_at: string;
  title: string;
  start_time: string;
  location: string | null;
  description: string | null;
  organizer_id: string | null;
  user_email: string | null;
};

export type PendingEmailNotificationRow = {
  notification_id: string;
  event_id: string;
  remind_at: string;
  title: string;
  start_time: string;
};
