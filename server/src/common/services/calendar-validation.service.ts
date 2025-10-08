import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { MessageService } from '../message/message.service';
import { CalendarSyncException } from '../../modules/event/exceptions/event.exceptions';

export interface CalendarConnectionStatus {
  isConnected: boolean;
  isSyncEnabled: boolean;
  lastSyncAt?: Date;
  connectionEstablishedAt?: Date;
}

@Injectable()
export class CalendarValidationService {
  private readonly logger = new Logger(CalendarValidationService.name);

  constructor(
    private databaseService: DatabaseService,
    private messageService: MessageService,
  ) {}

  async validateCalendarExists(userId: string): Promise<void> {
    const calendarQuery =
      'SELECT * FROM user_credentials WHERE user_id = $1 AND provider = $2';
    const calendarParams = [userId, 'google'];

    try {
      const calendarResult = await this.databaseService.query(
        calendarQuery,
        calendarParams,
      );

      if (calendarResult.rows.length === 0) {
        this.logger.log(
          `User ${userId} not connected to Google Calendar - allowing local event creation`,
        );
        return;
      }

      const connection = calendarResult.rows[0];

      if (
        connection.expires_at &&
        new Date(connection.expires_at) < new Date()
      ) {
        this.logger.warn(
          `Google Calendar token expired for user ${userId} - auto-refresh will be attempted`,
        );
        return;
      }

      this.logger.log(`User ${userId} has valid Google Calendar connection`);
    } catch (error) {
      if (error instanceof CalendarSyncException) {
        throw error;
      }
      this.logger.warn(
        `Calendar validation warning for user ${userId}: ${error.message}`,
      );
    }
  }

  private async checkSyncConflicts(
    userId: string,
    connection: any,
  ): Promise<void> {
    const syncLogQuery = `
            SELECT * FROM sync_log 
            WHERE user_id = $1 
            AND provider = $2 
            AND status = 'pending'
            ORDER BY created_at DESC
            LIMIT 10
        `;
    const syncLogParams = [userId, 'google'];

    try {
      const syncResult = await this.databaseService.query(
        syncLogQuery,
        syncLogParams,
      );

      if (syncResult.rows.length > 0) {
        this.logger.warn(
          `Potential sync conflicts detected for user ${userId}`,
        );
      }
    } catch (error) {
      this.logger.warn(
        `Sync log check failed for user ${userId}: ${error.message}`,
      );
    }
  }

  async isUserConnectedToCalendar(userId: string): Promise<boolean> {
    const query =
      'SELECT 1 FROM user_credentials WHERE user_id = $1 AND provider = $2 AND is_active = true LIMIT 1';
    const params = [userId, 'google'];

    try {
      const result = await this.databaseService.query(query, params);
      return result.rows.length > 0;
    } catch (error) {
      return false;
    }
  }

  async isSyncEnabled(userId: string): Promise<boolean> {
    const query = `
            SELECT sync_enabled 
            FROM user_credentials 
            WHERE user_id = $1 AND provider = $2 AND is_active = true
            LIMIT 1
        `;
    const params = [userId, 'google'];

    try {
      const result = await this.databaseService.query(query, params);
      return result.rows.length > 0 && result.rows[0].sync_enabled === true;
    } catch (error) {
      return false;
    }
  }

  async getConnectionStatus(userId: string): Promise<CalendarConnectionStatus> {
    const query = `
            SELECT 
                is_active as is_connected,
                sync_enabled,
                last_sync_at,
                created_at as connection_established_at
            FROM user_credentials
            WHERE user_id = $1 AND provider = $2
            LIMIT 1
        `;
    const params = [userId, 'google'];

    try {
      const result = await this.databaseService.query(query, params);

      if (result.rows.length === 0) {
        return {
          isConnected: false,
          isSyncEnabled: false,
        };
      }

      const row = result.rows[0];
      return {
        isConnected: row.is_connected,
        isSyncEnabled: row.sync_enabled,
        lastSyncAt: row.last_sync_at,
        connectionEstablishedAt: row.connection_established_at,
      };
    } catch (error) {
      this.logger.error(
        `Failed to get connection status for user ${userId}:`,
        error,
      );
      return {
        isConnected: false,
        isSyncEnabled: false,
      };
    }
  }

  async setSyncEnabled(userId: string, enabled: boolean): Promise<void> {
    this.logger.log(
      `${enabled ? 'Enabling' : 'Disabling'} Google Calendar sync for user ${userId}`,
    );

    const query = `
            UPDATE user_credentials
            SET sync_enabled = $1, updated_at = NOW()
            WHERE user_id = $2 AND provider = $3
        `;
    const params = [enabled, userId, 'google'];

    try {
      await this.databaseService.query(query, params);
      this.logger.log(
        `Google Calendar sync ${enabled ? 'enabled' : 'disabled'} for user ${userId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to set sync status for user ${userId}:`, error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  async updateLastSyncTime(userId: string): Promise<void> {
    const query = `
            UPDATE user_credentials
            SET last_sync_at = NOW(), updated_at = NOW()
            WHERE user_id = $1 AND provider = $2
        `;
    await this.databaseService.query(query, [userId, 'google']);
  }

  async getCalendarConnection(userId: string): Promise<any> {
    const query =
      'SELECT * FROM user_credentials WHERE user_id = $1 AND provider = $2';
    const params = [userId, 'google'];

    try {
      const result = await this.databaseService.query(query, params);
      return result.rows[0] || null;
    } catch (error) {
      this.logger.error(
        `Failed to get calendar connection for user ${userId}:`,
        error,
      );
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }
}
