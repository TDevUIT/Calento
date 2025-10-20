import { Injectable, Logger } from '@nestjs/common';
import { CalendarValidationService } from '../../../common/services/calendar-validation.service';

@Injectable()
export class SyncChecker {
  private readonly logger = new Logger(SyncChecker.name);

  constructor(
    private readonly calendarValidationService: CalendarValidationService,
  ) {}

  async canSyncToGoogle(userId: string): Promise<boolean> {
    const isConnected =
      await this.calendarValidationService.isUserConnectedToCalendar(userId);
    const isSyncEnabled =
      await this.calendarValidationService.isSyncEnabled(userId);

    return isConnected && isSyncEnabled;
  }

  async checkSyncability(
    userId: string,
    requireGoogleEventId?: boolean,
    googleEventId?: string,
  ): Promise<{
    canSync: boolean;
    reason?: string;
  }> {
    const isConnected =
      await this.calendarValidationService.isUserConnectedToCalendar(userId);

    if (!isConnected) {
      return {
        canSync: false,
        reason: 'Not connected to Google Calendar',
      };
    }

    const isSyncEnabled =
      await this.calendarValidationService.isSyncEnabled(userId);

    if (!isSyncEnabled) {
      return {
        canSync: false,
        reason: 'Sync is disabled',
      };
    }

    if (requireGoogleEventId && !googleEventId) {
      return {
        canSync: false,
        reason: 'Missing Google Event ID',
      };
    }

    return { canSync: true };
  }

  logSyncStatus(userId: string, canSync: boolean, reason?: string): void {
    if (canSync) {
      this.logger.log(`User ${userId} can sync to Google Calendar`);
    } else {
      this.logger.log(
        `User ${userId} cannot sync: ${reason || 'Unknown reason'}`,
      );
    }
  }
}
