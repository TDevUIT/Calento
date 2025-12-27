import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { AIConversation, AIMessage } from '../interfaces/ai.interface';

@Injectable()
export class AIConversationRepository {
  private readonly logger = new Logger(AIConversationRepository.name);

  constructor(private readonly db: DatabaseService) {}

  async create(
    userId: string,
    context?: Record<string, any>,
  ): Promise<AIConversation> {
    this.logger.log(`Creating new conversation for user: ${userId}`);

    const result = await this.db.query(
      `INSERT INTO ai_conversations (user_id, messages, context)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, JSON.stringify([]), context ? JSON.stringify(context) : null],
    );

    return this.normalizeConversation(result.rows[0]);
  }

  async findById(id: string): Promise<AIConversation | null> {
    const result = await this.db.query(
      `SELECT * FROM ai_conversations WHERE id = $1`,
      [id],
    );

    return result.rows[0] ? this.normalizeConversation(result.rows[0]) : null;
  }

  async findByUserId(userId: string, limit = 10): Promise<AIConversation[]> {
    const result = await this.db.query(
      `SELECT * FROM ai_conversations 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [userId, limit],
    );

    return result.rows.map((row) => this.normalizeConversation(row));
  }

  async addMessage(
    conversationId: string,
    message: AIMessage,
  ): Promise<AIConversation> {
    this.logger.log(`Adding message to conversation: ${conversationId}`);

    const result = await this.db.query(
      `UPDATE ai_conversations 
       SET messages = messages || $1::jsonb,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(message), conversationId],
    );

    return this.normalizeConversation(result.rows[0]);
  }

  async updateMessages(
    conversationId: string,
    messages: AIMessage[],
  ): Promise<AIConversation> {
    const result = await this.db.query(
      `UPDATE ai_conversations 
       SET messages = $1::jsonb,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(messages), conversationId],
    );

    return this.normalizeConversation(result.rows[0]);
  }

  async updateContext(
    conversationId: string,
    context: Record<string, any>,
  ): Promise<AIConversation> {
    const result = await this.db.query(
      `UPDATE ai_conversations 
       SET context = $1::jsonb,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(context), conversationId],
    );

    return this.normalizeConversation(result.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.query(
      `DELETE FROM ai_conversations WHERE id = $1`,
      [id],
    );

    return (result.rowCount ?? 0) > 0;
  }

  async deleteByUserId(userId: string): Promise<number> {
    const result = await this.db.query(
      `DELETE FROM ai_conversations WHERE user_id = $1`,
      [userId],
    );

    return result.rowCount ?? 0;
  }

  private normalizeConversation(row: any): AIConversation {
    return {
      id: row.id,
      user_id: row.user_id,
      messages: Array.isArray(row.messages) ? row.messages : [],
      context: row.context || {},
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
