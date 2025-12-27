import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import { UserCredentialsRepository } from '../repositories/user-credentials.repository';
import {
  TIME_CONSTANTS,
  GOOGLE_API_CONSTANTS,
  OAUTH_CONSTANTS,
} from '../../../common/constants';

@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);
  private oauth2Client: Auth.OAuth2Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly credentialsRepo: UserCredentialsRepository,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.configService.get<string>('GOOGLE_REDIRECT_URI'),
    );
  }

  getAuthUrl(state?: string): string {
    const scopes = [...GOOGLE_API_CONSTANTS.SCOPE_SETS.FULL_CALENDAR_ACCESS];

    return this.oauth2Client.generateAuthUrl({
      access_type: OAUTH_CONSTANTS.GOOGLE.ACCESS_TYPE,
      scope: scopes,
      state: state,
      prompt: OAUTH_CONSTANTS.GOOGLE.PROMPT,
    });
  }

  async handleCallback(
    code: string,
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);

      if (!tokens.access_token) {
        throw new Error('No access token received');
      }

      const expiresAt = tokens.expiry_date
        ? new Date(tokens.expiry_date)
        : new Date(Date.now() + TIME_CONSTANTS.GOOGLE.TOKEN_DEFAULT_EXPIRY);

      await this.credentialsRepo.upsert({
        user_id: userId,
        provider: 'google',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || undefined,
        expires_at: expiresAt,
        scope: tokens.scope,
      });

      this.logger.log(
        `Successfully connected Google Calendar for user ${userId}`,
      );

      return {
        success: true,
        message: 'Google Calendar connected successfully',
      };
    } catch (error) {
      this.logger.error('Failed to handle OAuth callback:', error);
      return {
        success: false,
        message: 'Failed to connect Google Calendar',
      };
    }
  }

  async refreshAccessToken(userId: string): Promise<boolean> {
    try {
      const credentials = await this.credentialsRepo.findByUserAndProvider(
        userId,
        'google',
      );

      if (!credentials || !credentials.refresh_token) {
        this.logger.warn(`No refresh token found for user ${userId}`);
        return false;
      }

      this.oauth2Client.setCredentials({
        refresh_token: credentials.refresh_token,
      });

      const { credentials: newCredentials } =
        await this.oauth2Client.refreshAccessToken();

      if (!newCredentials.access_token) {
        throw new Error('No access token in refresh response');
      }

      const expiresAt = newCredentials.expiry_date
        ? new Date(newCredentials.expiry_date)
        : new Date(Date.now() + TIME_CONSTANTS.GOOGLE.TOKEN_DEFAULT_EXPIRY);

      await this.credentialsRepo.update(userId, 'google', {
        access_token: newCredentials.access_token,
        refresh_token:
          newCredentials.refresh_token || credentials.refresh_token,
        expires_at: expiresAt,
        scope: newCredentials.scope,
      });

      this.logger.log(`Refreshed access token for user ${userId}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to refresh token for user ${userId}:`, error);
      return false;
    }
  }

  async getValidAccessToken(userId: string): Promise<string | null> {
    const credentials = await this.credentialsRepo.findByUserAndProvider(
      userId,
      'google',
    );

    if (!credentials || !credentials.access_token) {
      return null;
    }

    const isExpired = await this.credentialsRepo.isTokenExpired(
      userId,
      'google',
    );

    if (isExpired) {
      const refreshed = await this.refreshAccessToken(userId);
      if (!refreshed) {
        return null;
      }

      const updatedCredentials =
        await this.credentialsRepo.findByUserAndProvider(userId, 'google');
      return updatedCredentials?.access_token || null;
    }

    return credentials.access_token;
  }

  async disconnect(userId: string): Promise<boolean> {
    try {
      const credentials = await this.credentialsRepo.findByUserAndProvider(
        userId,
        'google',
      );

      if (credentials?.access_token) {
        try {
          await this.oauth2Client.revokeToken(credentials.access_token);
        } catch (error) {
          this.logger.warn(`Failed to revoke token:`, error);
        }
      }

      const deleted = await this.credentialsRepo.delete(userId, 'google');

      if (deleted) {
        this.logger.log(`Disconnected Google Calendar for user ${userId}`);
      }

      return deleted;
    } catch (error) {
      this.logger.error(`Failed to disconnect for user ${userId}:`, error);
      return false;
    }
  }

  async isConnected(userId: string): Promise<boolean> {
    const credentials = await this.credentialsRepo.findByUserAndProvider(
      userId,
      'google',
    );
    return credentials !== null && !!credentials.access_token;
  }

  getOAuth2Client(): Auth.OAuth2Client {
    return this.oauth2Client;
  }
}
