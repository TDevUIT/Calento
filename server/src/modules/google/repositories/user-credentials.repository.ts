import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import {
  UserCredentials,
  ProviderType,
} from '../interfaces/user-credentials.interface';

@Injectable()
export class UserCredentialsRepository {
  private readonly logger = new Logger(UserCredentialsRepository.name);
  private readonly tableName = 'user_credentials';

  constructor(private readonly databaseService: DatabaseService) {}

  async findByUserAndProvider(
    userId: string,
    provider: ProviderType,
  ): Promise<UserCredentials | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE user_id = $1 AND provider = $2 LIMIT 1`;

    try {
      const result = await this.databaseService.query<UserCredentials>(query, [
        userId,
        provider,
      ]);
      return result.rows[0] || null;
    } catch (error) {
      this.logger.error(
        `Failed to find credentials for user ${userId}:`,
        error,
      );
      return null;
    }
  }

  async create(data: Partial<UserCredentials>): Promise<UserCredentials> {
    const query = `
            INSERT INTO ${this.tableName} (
                user_id, provider, access_token, refresh_token, expires_at, scope
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

    try {
      const result = await this.databaseService.query<UserCredentials>(query, [
        data.user_id,
        data.provider,
        data.access_token,
        data.refresh_token,
        data.expires_at,
        data.scope,
      ]);

      this.logger.log(
        `Created credentials for user ${data.user_id} provider ${data.provider}`,
      );
      return result.rows[0];
    } catch (error) {
      this.logger.error('Failed to create user credentials:', error);
      throw new Error('Failed to save credentials');
    }
  }

  async update(
    userId: string,
    provider: ProviderType,
    data: Partial<UserCredentials>,
  ): Promise<UserCredentials> {
    const query = `
            UPDATE ${this.tableName}
            SET 
                access_token = $3,
                refresh_token = $4,
                expires_at = $5,
                scope = $6,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $1 AND provider = $2
            RETURNING *
        `;

    try {
      const result = await this.databaseService.query<UserCredentials>(query, [
        userId,
        provider,
        data.access_token,
        data.refresh_token,
        data.expires_at,
        data.scope,
      ]);

      if (result.rows.length === 0) {
        throw new Error('Credentials not found');
      }

      this.logger.log(
        `Updated credentials for user ${userId} provider ${provider}`,
      );
      return result.rows[0];
    } catch (error) {
      this.logger.error('Failed to update user credentials:', error);
      throw new Error('Failed to update credentials');
    }
  }

  async upsert(data: Partial<UserCredentials>): Promise<UserCredentials> {
    const existing = await this.findByUserAndProvider(
      data.user_id!,
      data.provider!,
    );

    if (existing) {
      return this.update(data.user_id!, data.provider!, data);
    } else {
      return this.create(data);
    }
  }

  async delete(userId: string, provider: ProviderType): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE user_id = $1 AND provider = $2`;

    try {
      const result = await this.databaseService.query(query, [
        userId,
        provider,
      ]);
      this.logger.log(
        `Deleted credentials for user ${userId} provider ${provider}`,
      );
      return (result.rowCount || 0) > 0;
    } catch (error) {
      this.logger.error('Failed to delete credentials:', error);
      return false;
    }
  }

  async isTokenExpired(
    userId: string,
    provider: ProviderType,
  ): Promise<boolean> {
    const credentials = await this.findByUserAndProvider(userId, provider);

    if (!credentials || !credentials.expires_at) {
      return true;
    }

    return new Date(credentials.expires_at) <= new Date();
  }

  async getAllProvidersByUser(userId: string): Promise<UserCredentials[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE user_id = $1`;

    try {
      const result = await this.databaseService.query<UserCredentials>(query, [
        userId,
      ]);
      return result.rows;
    } catch (error) {
      this.logger.error(
        `Failed to get all providers for user ${userId}:`,
        error,
      );
      return [];
    }
  }
}
