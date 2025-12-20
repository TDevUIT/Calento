
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { DueEmailNotificationRow, PendingEmailNotificationRow } from './notification.interface';

@Injectable()
export class NotificationRepository {
    constructor(private readonly db: DatabaseService) {}

    async insertEmailNotificationIfNotExists(
        eventId: string,
        remindAtIso: string,
    ): Promise<boolean> {
        const insertQuery = `
        INSERT INTO notifications (event_id, channel, remind_at, is_sent)
        SELECT $1, $2, $3, false
        WHERE NOT EXISTS (
            SELECT 1 FROM notifications
            WHERE event_id = $1
            AND channel = $2
            AND remind_at = $3
        )
        `;

        const result = await this.db.query(insertQuery, [eventId, 'email', remindAtIso]);
        return (result as any)?.rowCount === 1;
    }

    async findDueEmailNotifications(limit: number = 50): Promise<DueEmailNotificationRow[]> {
        const query = `
        SELECT
            n.id as notification_id,
            n.event_id,
            n.channel,
            n.remind_at,
            e.title,
            e.start_time,
            e.location,
            e.description,
            e.organizer_id,
            u.email as user_email
        FROM notifications n
        INNER JOIN events e ON e.id = n.event_id
        LEFT JOIN users u ON u.id = e.organizer_id
        WHERE n.is_sent = false
            AND n.channel = 'email'
            AND n.remind_at IS NOT NULL
            AND n.remind_at <= NOW()
        ORDER BY n.remind_at ASC
        LIMIT $1
        `;

        const result = await this.db.query(query, [limit]);
        return result.rows;
    }

    async markNotificationSent(notificationId: string): Promise<void> {
        await this.db.query(
        `UPDATE notifications SET is_sent = true, updated_at = NOW() WHERE id = $1`,
        [notificationId],
        );
    }

    async findPendingEmailNotificationsForUser(
        userId: string,
        limit: number = 200,
    ): Promise<PendingEmailNotificationRow[]> {
        const query = `
        SELECT
            n.id as notification_id,
            n.event_id,
            n.remind_at,
            e.title,
            e.start_time
        FROM notifications n
        INNER JOIN events e ON e.id = n.event_id
        WHERE n.is_sent = false
            AND n.channel = 'email'
            AND e.organizer_id = $1
        ORDER BY n.remind_at ASC
        LIMIT $2
        `;

        const result = await this.db.query(query, [userId, limit]);
        return result.rows;
    }
}

