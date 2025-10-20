import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PriorityRepository } from '../repositories/priority.repository';
import { UserPriority, PriorityUpdatePayload } from '../interfaces/priority.interface';
import { UpdatePriorityDto, BulkUpdatePriorityDto } from '../dto/priority.dto';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class PriorityService {
  private readonly logger = new Logger(PriorityService.name);

  constructor(
    private readonly priorityRepository: PriorityRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * Get all priorities for a user
   */
  async getUserPriorities(userId: string): Promise<UserPriority[]> {
    return this.priorityRepository.findByUserId(userId);
  }

  /**
   * Get priority for a specific item
   */
  async getItemPriority(
    userId: string,
    itemId: string,
    itemType: string
  ): Promise<UserPriority> {
    const priority = await this.priorityRepository.findByUserIdAndItem(
      userId,
      itemId,
      itemType
    );

    if (!priority) {
      throw new NotFoundException(
        `Priority not found for item ${itemId} of type ${itemType}`
      );
    }

    return priority;
  }

  /**
   * Update priority for an item
   */
  async updatePriority(
    userId: string,
    dto: UpdatePriorityDto
  ): Promise<UserPriority> {
    const payload: PriorityUpdatePayload = {
      item_id: dto.item_id,
      item_type: dto.item_type,
      priority: dto.priority,
      position: dto.position,
    };

    return this.priorityRepository.upsertPriority(userId, payload);
  }

  /**
   * Bulk update priorities
   */
  async bulkUpdatePriorities(
    userId: string,
    dto: BulkUpdatePriorityDto
  ): Promise<UserPriority[]> {
    const payloads: PriorityUpdatePayload[] = dto.updates.map(update => ({
      item_id: update.item_id,
      item_type: update.item_type,
      priority: update.priority,
      position: update.position,
    }));

    return this.priorityRepository.bulkUpsertPriorities(userId, payloads);
  }

  /**
   * Delete priority for an item
   */
  async deletePriority(
    userId: string,
    itemId: string,
    itemType: string
  ): Promise<void> {
    const deleted = await this.priorityRepository.deletePriority(
      userId,
      itemId,
      itemType
    );

    if (!deleted) {
      throw new NotFoundException(
        `Priority not found for item ${itemId} of type ${itemType}`
      );
    }
  }

  /**
   * Get priorities by priority level
   */
  async getPrioritiesByLevel(
    userId: string,
    priority: string
  ): Promise<UserPriority[]> {
    return this.priorityRepository.findByUserIdAndPriority(userId, priority);
  }

  /**
   * Get priorities by item type
   */
  async getPrioritiesByType(
    userId: string,
    itemType: string
  ): Promise<UserPriority[]> {
    return this.priorityRepository.findByUserIdAndItemType(userId, itemType);
  }

  /**
   * Reset all priorities for a user (delete all)
   */
  async resetUserPriorities(userId: string): Promise<void> {
    const priorities = await this.priorityRepository.findByUserId(userId);
    
    for (const priority of priorities) {
      await this.priorityRepository.deletePriority(
        userId,
        priority.item_id,
        priority.item_type
      );
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async autoDisableExpiredItems(): Promise<void> {
    try {
      this.logger.log('Starting auto-disable for expired items...');
      
      const expiredTasks = await this.findExpiredTasks();
      const expiredBookings = await this.findExpiredBookingLinks();
      
      let disabledCount = 0;
      
      for (const task of expiredTasks) {
        await this.priorityRepository.upsertPriority(task.user_id, {
          item_id: task.id,
          item_type: 'task' as any,
          priority: 'disabled' as any,
        });
        disabledCount++;
      }
      
      for (const booking of expiredBookings) {
        await this.priorityRepository.upsertPriority(booking.user_id, {
          item_id: booking.id,
          item_type: 'booking_link' as any,
          priority: 'disabled' as any,
        });
        disabledCount++;
      }
      
      this.logger.log(`Auto-disabled ${disabledCount} expired items (${expiredTasks.length} tasks, ${expiredBookings.length} bookings)`);
    } catch (error) {
      this.logger.error('Failed to auto-disable expired items:', error);
    }
  }

  private async findExpiredTasks(): Promise<any[]> {
    try {
      const query = `
        SELECT DISTINCT t.id, t.user_id, t.due_date
        FROM tasks t
        LEFT JOIN user_priorities up ON up.item_id = t.id::text AND up.item_type = 'task' AND up.user_id = t.user_id
        WHERE t.due_date < NOW()
        AND t.status NOT IN ('completed', 'cancelled')
        AND t.deleted_at IS NULL
        AND (up.priority IS NULL OR up.priority != 'disabled')
      `;
      
      const result = await this.databaseService.query(query);
      return result.rows;
    } catch (error) {
      this.logger.error('Failed to find expired tasks:', error);
      return [];
    }
  }

  private async findExpiredBookingLinks(): Promise<any[]> {
    try {
      const query = `
        SELECT DISTINCT bl.id, bl.user_id, bl.expires_at
        FROM booking_links bl
        LEFT JOIN user_priorities up ON up.item_id = bl.id::text AND up.item_type = 'booking_link' AND up.user_id = bl.user_id
        WHERE bl.expires_at IS NOT NULL
        AND bl.expires_at < NOW()
        AND bl.is_active = true
        AND (up.priority IS NULL OR up.priority != 'disabled')
      `;
      
      const result = await this.databaseService.query(query);
      return result.rows;
    } catch (error) {
      this.logger.error('Failed to find expired booking links:', error);
      return [];
    }
  }
}
