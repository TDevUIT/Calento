import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { AIAction } from '../interfaces/ai.interface';

@Injectable()
export class AIActionRepository {
  private readonly logger = new Logger(AIActionRepository.name);

  constructor(private readonly db: DatabaseService) {}

  async create(
    conversationId: string,
    actionType: string,
    parameters: Record<string, any>,
  ): Promise<AIAction> {
    this.logger.log(
      `Creating action: ${actionType} for conversation: ${conversationId}`,
    );

    const result = await this.db.query(
      `INSERT INTO ai_actions (conversation_id, action_type, parameters, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [conversationId, actionType, JSON.stringify(parameters), 'pending'],
    );

    return this.normalizeAction(result.rows[0]);
  }

  async findById(id: string): Promise<AIAction | null> {
    const result = await this.db.query(
      `SELECT * FROM ai_actions WHERE id = $1`,
      [id],
    );

    return result.rows[0] ? this.normalizeAction(result.rows[0]) : null;
  }

  async findByConversationId(conversationId: string): Promise<AIAction[]> {
    const result = await this.db.query(
      `SELECT * FROM ai_actions 
       WHERE conversation_id = $1 
       ORDER BY created_at ASC`,
      [conversationId],
    );

    return result.rows.map((row) => this.normalizeAction(row));
  }

  async updateStatus(
    id: string,
    status: 'pending' | 'completed' | 'failed',
    result?: Record<string, any>,
    error?: string,
  ): Promise<AIAction> {
    this.logger.log(`Updating action ${id} status to: ${status}`);

    const query = `
      UPDATE ai_actions 
      SET status = $1,
          result = $2,
          error = $3,
          updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;

    const queryResult = await this.db.query(query, [
      status,
      result ? JSON.stringify(result) : null,
      error || null,
      id,
    ]);

    return this.normalizeAction(queryResult.rows[0]);
  }

  async findPendingActions(limit = 50): Promise<AIAction[]> {
    const result = await this.db.query(
      `SELECT * FROM ai_actions 
       WHERE status = 'pending' 
       ORDER BY created_at ASC 
       LIMIT $1`,
      [limit],
    );

    return result.rows.map((row) => this.normalizeAction(row));
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.query(`DELETE FROM ai_actions WHERE id = $1`, [
      id,
    ]);

    return (result.rowCount ?? 0) > 0;
  }

  private normalizeAction(row: any): AIAction {
    return {
      id: row.id,
      conversation_id: row.conversation_id,
      action_type: row.action_type,
      parameters: row.parameters || {},
      result: row.result || null,
      status: row.status,
      error: row.error || null,
      created_at: row.created_at,
    };
  }
}
