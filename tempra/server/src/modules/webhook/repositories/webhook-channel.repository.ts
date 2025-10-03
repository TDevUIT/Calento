import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';

export interface WebhookChannel {
    id: string;
    user_id: string;
    calendar_id: string;
    channel_id: string;
    resource_id: string;
    resource_uri: string;
    token?: string;
    expiration: Date;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

@Injectable()
export class WebhookChannelRepository {
    private readonly logger = new Logger(WebhookChannelRepository.name);

    constructor(private readonly db: DatabaseService) {}

    async create(channel: Omit<WebhookChannel, 'id' | 'created_at' | 'updated_at'>): Promise<WebhookChannel> {
        const query = `
            INSERT INTO webhook_channels (
                user_id, calendar_id, channel_id, resource_id, 
                resource_uri, token, expiration, is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;

        const result = await this.db.query(query, [
            channel.user_id,
            channel.calendar_id,
            channel.channel_id,
            channel.resource_id,
            channel.resource_uri,
            channel.token,
            channel.expiration,
            channel.is_active
        ]);

        this.logger.log(`Created webhook channel ${channel.channel_id} for user ${channel.user_id}`);
        return result.rows[0];
    }

    async findByChannelId(channelId: string): Promise<WebhookChannel | null> {
        const query = `
            SELECT * FROM webhook_channels 
            WHERE channel_id = $1
        `;

        const result = await this.db.query(query, [channelId]);
        return result.rows[0] || null;
    }

    async findActiveByUserId(userId: string): Promise<WebhookChannel[]> {
        const query = `
            SELECT * FROM webhook_channels 
            WHERE user_id = $1 AND is_active = true
            ORDER BY created_at DESC
        `;

        const result = await this.db.query(query, [userId]);
        return result.rows;
    }

    async findActiveByUserAndCalendar(userId: string, calendarId: string): Promise<WebhookChannel | null> {
        const query = `
            SELECT * FROM webhook_channels 
            WHERE user_id = $1 AND calendar_id = $2 AND is_active = true
            LIMIT 1
        `;

        const result = await this.db.query(query, [userId, calendarId]);
        return result.rows[0] || null;
    }

    async updateStatus(channelId: string, isActive: boolean): Promise<boolean> {
        const query = `
            UPDATE webhook_channels 
            SET is_active = $1, updated_at = NOW()
            WHERE channel_id = $2
            RETURNING id
        `;

        const result = await this.db.query(query, [isActive, channelId]);
        
        if (result.rows.length > 0) {
            this.logger.log(`Updated webhook channel ${channelId} status to ${isActive}`);
            return true;
        }
        
        return false;
    }

    async deactivate(channelId: string, resourceId: string): Promise<boolean> {
        const query = `
            UPDATE webhook_channels 
            SET is_active = false, updated_at = NOW()
            WHERE channel_id = $1 AND resource_id = $2
            RETURNING id
        `;

        const result = await this.db.query(query, [channelId, resourceId]);
        
        if (result.rows.length > 0) {
            this.logger.log(`Deactivated webhook channel ${channelId}`);
            return true;
        }
        
        return false;
    }

    async delete(channelId: string): Promise<boolean> {
        const query = `
            DELETE FROM webhook_channels 
            WHERE channel_id = $1
            RETURNING id
        `;

        const result = await this.db.query(query, [channelId]);
        
        if (result.rows.length > 0) {
            this.logger.log(`Deleted webhook channel ${channelId}`);
            return true;
        }
        
        return false;
    }

    async findExpired(): Promise<WebhookChannel[]> {
        const query = `
            SELECT * FROM webhook_channels 
            WHERE expiration < NOW() AND is_active = true
        `;

        const result = await this.db.query(query);
        return result.rows;
    }

    async cleanupExpired(): Promise<number> {
        const query = `
            UPDATE webhook_channels 
            SET is_active = false, updated_at = NOW()
            WHERE expiration < NOW() AND is_active = true
            RETURNING id
        `;

        const result = await this.db.query(query);
        const count = result.rows.length;
        
        if (count > 0) {
            this.logger.log(`Cleaned up ${count} expired webhook channels`);
        }
        
        return count;
    }
}
