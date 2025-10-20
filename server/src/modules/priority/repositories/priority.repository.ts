import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { DatabaseService } from '../../../database/database.service';
import { PaginationService } from '../../../common/services/pagination.service';
import { MessageService } from '../../../common/message/message.service';
import { UserPriority, PriorityUpdatePayload } from '../interfaces/priority.interface';

@Injectable()
export class PriorityRepository extends BaseRepository<UserPriority> {
  constructor(
    databaseService: DatabaseService,
    paginationService: PaginationService,
    messageService: MessageService,
  ) {
    super(databaseService, paginationService, messageService, 'user_priorities');
  }

  protected getAllowedSortFields(): string[] {
    return ['id', 'priority', 'position', 'created_at', 'updated_at'];
  }

  /**
   * Get all priorities for a user
   */
  async findByUserId(userId: string): Promise<UserPriority[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE user_id = $1
      ORDER BY priority, position
    `;
    
    try {
      const result = await this.databaseService.query<UserPriority>(query, [userId]);
      return result.rows;
    } catch (error) {
      this.logger.error(`Failed to find priorities by user ID ${userId}:`, error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  /**
   * Get priority for a specific item
   */
  async findByUserIdAndItem(
    userId: string, 
    itemId: string, 
    itemType: string
  ): Promise<UserPriority | null> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE user_id = $1 AND item_id = $2 AND item_type = $3
    `;
    
    try {
      const result = await this.databaseService.query<UserPriority>(query, [userId, itemId, itemType]);
      return result.rows[0] || null;
    } catch (error) {
      this.logger.error(`Failed to find priority for item ${itemId}:`, error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  /**
   * Upsert (insert or update) priority for an item
   */
  async upsertPriority(
    userId: string,
    payload: PriorityUpdatePayload
  ): Promise<UserPriority> {
    const position = payload.position ?? 0;
    
    const query = `
      INSERT INTO ${this.tableName} 
        (user_id, item_id, item_type, priority, position)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, item_id, item_type)
      DO UPDATE SET
        priority = EXCLUDED.priority,
        position = EXCLUDED.position,
        updated_at = NOW()
      RETURNING *
    `;
    
    try {
      const result = await this.databaseService.query<UserPriority>(
        query,
        [userId, payload.item_id, payload.item_type, payload.priority, position]
      );
      
      this.logger.log(`Upserted priority for item ${payload.item_id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Failed to upsert priority for item ${payload.item_id}:`, error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  /**
   * Bulk upsert priorities
   */
  async bulkUpsertPriorities(
    userId: string,
    updates: PriorityUpdatePayload[]
  ): Promise<UserPriority[]> {
    if (updates.length === 0) {
      return [];
    }

    try {
      const results: UserPriority[] = [];
      
      for (const update of updates) {
        const result = await this.upsertPriority(userId, update);
        results.push(result);
      }

      this.logger.log(`Bulk upserted ${results.length} priorities for user ${userId}`);
      return results;
    } catch (error) {
      this.logger.error(`Failed to bulk upsert priorities:`, error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  /**
   * Delete priority for an item
   */
  async deletePriority(
    userId: string,
    itemId: string,
    itemType: string
  ): Promise<boolean> {
    const query = `
      DELETE FROM ${this.tableName}
      WHERE user_id = $1 AND item_id = $2 AND item_type = $3
    `;
    
    try {
      const result = await this.databaseService.query(query, [userId, itemId, itemType]);
      const deleted = (result.rowCount ?? 0) > 0;
      if (deleted) {
        this.logger.log(`Deleted priority for item ${itemId}`);
      }
      return deleted;
    } catch (error) {
      this.logger.error(`Failed to delete priority for item ${itemId}:`, error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  /**
   * Get priorities by priority level
   */
  async findByUserIdAndPriority(
    userId: string,
    priority: string
  ): Promise<UserPriority[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE user_id = $1 AND priority = $2
      ORDER BY position
    `;
    
    try {
      const result = await this.databaseService.query<UserPriority>(query, [userId, priority]);
      return result.rows;
    } catch (error) {
      this.logger.error(`Failed to find priorities by level ${priority}:`, error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }

  /**
   * Get priorities by item type
   */
  async findByUserIdAndItemType(
    userId: string,
    itemType: string
  ): Promise<UserPriority[]> {
    const query = `
      SELECT * FROM ${this.tableName}
      WHERE user_id = $1 AND item_type = $2
      ORDER BY priority, position
    `;
    
    try {
      const result = await this.databaseService.query<UserPriority>(query, [userId, itemType]);
      return result.rows;
    } catch (error) {
      this.logger.error(`Failed to find priorities by type ${itemType}:`, error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }
}
