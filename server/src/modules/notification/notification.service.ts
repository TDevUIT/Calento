import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { EventService } from "../event/event.service";
import { EmailService } from "../email/services/email.service";
import { NotificationRepository } from "./notification.repository";
import { PendingEmailNotificationRow } from "./notification.interface";

@Injectable() 
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        private notificationRepository: NotificationRepository,
        private eventService: EventService,
        private emailService: EmailService,
    ) { }   

    async scheduleEventReminderNotifications(
        userId: string,
        horizonDays: number = 30,
    ): Promise<{ scheduled: number }>{
        const now = new Date();
        const horizon = new Date(now);
        horizon.setDate(horizon.getDate() + horizonDays);

        const eventsResult = await this.eventService.getEvents(userId, {
            page: 1,
            limit: 1000,
            sortBy: 'start_time',
            sortOrder: 'ASC',
            start_date: now.toISOString(),
            end_date: horizon.toISOString(),
        } as any);

        let scheduled = 0;

        for (const event of eventsResult.data) {
            const reminders = (event as any).reminders as Array<{ method: string; minutes: number }> | undefined;
            if (!reminders || reminders.length === 0) continue;

            if (!event.start_time) continue;
            const eventStart = new Date(event.start_time as any);
            if (isNaN(eventStart.getTime())) continue;

            for (const reminder of reminders) {
                if (reminder?.method !== 'email') continue;
                const minutes = Number(reminder.minutes);
                if (!Number.isFinite(minutes) || minutes < 0) continue;

                const remindAt = new Date(eventStart);
                remindAt.setMinutes(remindAt.getMinutes() - minutes);

                if (remindAt <= now) continue;

                const inserted = await this.notificationRepository.insertEmailNotificationIfNotExists(
                    event.id,
                    remindAt.toISOString(),
                );

                if (inserted) {
                    scheduled++;
                }
            }
        }

        return { scheduled };
    }

    @Cron('*/1 * * * *', {
        name: 'notification-reminder-dispatcher',
        timeZone: 'UTC',
    })
    async processDueNotifications(): Promise<void> {
        const due = await this.notificationRepository.findDueEmailNotifications(50);
        if (due.length === 0) return;

        for (const row of due) {
            try {
                if (!row.organizer_id || !row.user_email) {
                    await this.notificationRepository.markNotificationSent(row.notification_id);
                    continue;
                }

                await this.emailService.sendEventReminderEmail(
                    row.organizer_id,
                    row.user_email,
                    {
                        title: row.title,
                        startTime: new Date(row.start_time),
                        location: row.location || undefined,
                        description: row.description || undefined,
                    },
                );

                await this.notificationRepository.markNotificationSent(row.notification_id);
            } catch (error) {
                this.logger.error(
                    `Failed to process notification ${row.notification_id}: ${error.message}`,
                    error.stack,
                );
            }
        }
    }

    async getPendingEmailNotifications(userId: string): Promise<PendingEmailNotificationRow[]> {
        return this.notificationRepository.findPendingEmailNotificationsForUser(userId, 200);
    }
}