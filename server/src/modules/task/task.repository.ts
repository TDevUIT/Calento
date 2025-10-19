import { Injectable } from '@nestjs/common';
import { UserOwnedRepository } from '../../common/repositories/base.repository';
import { Task, TaskStatus, TaskPriority } from './task.interface';
import { DatabaseService } from '../../database/database.service';
import { PaginationService } from '../../common/services/pagination.service';
import { MessageService } from '../../common/message/message.service';
import { PaginatedResult, PaginationOptions } from '../../common/interfaces/pagination.interface';

@Injectable()
export class TaskRepository extends UserOwnedRepository<Task> {
  constructor(
    databaseService: DatabaseService,
    paginationService: PaginationService,
    messageService: MessageService,
  ) {
    super(databaseService, paginationService, messageService, 'tasks');
  }

  protected getAllowedSortFields(): string[] {
    return [
      'id',
      'title',
      'status',
      'priority',
      'due_date',
      'created_at',
      'updated_at',
      'completed_at',
    ];
  }

  protected isSoftDeletable(): boolean {
    return true;
  }

  async findByStatus(
    userId: string,
    status: TaskStatus,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Task>> {
    const whereCondition = 'user_id = $1 AND status = $2';
    const whereParams = [userId, status];
    return this.search(whereCondition, whereParams, paginationOptions);
  }

  async findByPriority(
    userId: string,
    priority: TaskPriority,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Task>> {
    const whereCondition = 'user_id = $1 AND priority = $2';
    const whereParams = [userId, priority];
    return this.search(whereCondition, whereParams, paginationOptions);
  }

  async findByProject(
    userId: string,
    projectId: string,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Task>> {
    const whereCondition = 'user_id = $1 AND project_id = $2';
    const whereParams = [userId, projectId];
    return this.search(whereCondition, whereParams, paginationOptions);
  }

  async findOverdue(
    userId: string,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Task>> {
    const whereCondition = 
      'user_id = $1 AND due_date < NOW() AND status != $2 AND status != $3';
    const whereParams = [userId, TaskStatus.COMPLETED, TaskStatus.CANCELLED];
    return this.search(whereCondition, whereParams, paginationOptions);
  }

  async findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Task>> {
    const whereCondition = 
      'user_id = $1 AND due_date >= $2 AND due_date <= $3';
    const whereParams = [userId, startDate, endDate];
    return this.search(whereCondition, whereParams, paginationOptions);
  }

  async findByTags(
    userId: string,
    tags: string[],
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Task>> {
    const whereCondition = 'user_id = $1 AND tags && $2';
    const whereParams = [userId, tags];
    return this.search(whereCondition, whereParams, paginationOptions);
  }

  async searchTasks(
    userId: string,
    searchTerm: string,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Task>> {
    const whereCondition = 
      'user_id = $1 AND (title ILIKE $2 OR description ILIKE $2)';
    const whereParams = [userId, `%${searchTerm}%`];
    return this.search(whereCondition, whereParams, paginationOptions);
  }

  async updateStatus(
    taskId: string,
    status: TaskStatus,
  ): Promise<Task | null> {
    const updateData: Partial<Task> = { status };
    
    if (status === TaskStatus.COMPLETED) {
      updateData.completed_at = new Date();
    }
    
    return this.update(taskId, updateData);
  }

  async getTaskStatistics(userId: string): Promise<{
    total: number;
    by_status: Record<TaskStatus, number>;
    by_priority: Record<TaskPriority, number>;
    overdue: number;
    completed_today: number;
  }> {
    try {
      const query = `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN status = '${TaskStatus.TODO}' THEN 1 END) as todo,
          COUNT(CASE WHEN status = '${TaskStatus.IN_PROGRESS}' THEN 1 END) as in_progress,
          COUNT(CASE WHEN status = '${TaskStatus.COMPLETED}' THEN 1 END) as completed,
          COUNT(CASE WHEN status = '${TaskStatus.CANCELLED}' THEN 1 END) as cancelled,
          COUNT(CASE WHEN priority = '${TaskPriority.LOW}' THEN 1 END) as low_priority,
          COUNT(CASE WHEN priority = '${TaskPriority.MEDIUM}' THEN 1 END) as medium_priority,
          COUNT(CASE WHEN priority = '${TaskPriority.HIGH}' THEN 1 END) as high_priority,
          COUNT(CASE WHEN priority = '${TaskPriority.CRITICAL}' THEN 1 END) as critical_priority,
          COUNT(CASE WHEN due_date < NOW() AND status NOT IN ('${TaskStatus.COMPLETED}', '${TaskStatus.CANCELLED}') THEN 1 END) as overdue,
          COUNT(CASE WHEN DATE(completed_at) = CURRENT_DATE THEN 1 END) as completed_today
        FROM tasks 
        WHERE user_id = $1 AND deleted_at IS NULL
      `;

      const result = await this.databaseService.query(query, [userId]);
      const row = result.rows[0];

      return {
        total: parseInt(row.total),
        by_status: {
          [TaskStatus.TODO]: parseInt(row.todo),
          [TaskStatus.IN_PROGRESS]: parseInt(row.in_progress),
          [TaskStatus.COMPLETED]: parseInt(row.completed),
          [TaskStatus.CANCELLED]: parseInt(row.cancelled),
        },
        by_priority: {
          [TaskPriority.LOW]: parseInt(row.low_priority),
          [TaskPriority.MEDIUM]: parseInt(row.medium_priority),
          [TaskPriority.HIGH]: parseInt(row.high_priority),
          [TaskPriority.CRITICAL]: parseInt(row.critical_priority),
        },
        overdue: parseInt(row.overdue),
        completed_today: parseInt(row.completed_today),
      };
    } catch (error) {
      this.logger.error(`Failed to get task statistics for user ${userId}:`, error);
      throw new Error(this.messageService.get('error.internal_server_error'));
    }
  }
}
