import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class UserSettingsRepository {
  private readonly logger = new Logger(UserSettingsRepository.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async findSettingsByUserId(
    userId: string,
  ): Promise<Record<string, any> | null> {
    try {
      const result = await this.databaseService.query(
        'SELECT settings FROM user_settings WHERE user_id = $1',
        [userId],
      );

      if (!result.rows[0]) return null;

      const settings = result.rows[0].settings;
      return typeof settings === 'string' ? JSON.parse(settings) : settings;
    } catch (error) {
      this.logger.error(
        `Failed to fetch user settings for user ${userId}:`,
        error,
      );
      throw error;
    }
  }

  async upsertSettingsByUserId(
    userId: string,
    settings: Record<string, any>,
  ): Promise<Record<string, any>> {
    try {
      const result = await this.databaseService.query(
        `INSERT INTO user_settings (user_id, settings)
         VALUES ($1, $2)
         ON CONFLICT (user_id)
         DO UPDATE SET settings = EXCLUDED.settings, updated_at = NOW()
         RETURNING settings`,
        [userId, JSON.stringify(settings)],
      );

      const returned = result.rows[0]?.settings ?? settings;
      return typeof returned === 'string' ? JSON.parse(returned) : returned;
    } catch (error) {
      this.logger.error(
        `Failed to upsert user settings for user ${userId}:`,
        error,
      );
      throw error;
    }
  }
}
