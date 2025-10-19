import { UserOwnedEntity, SoftDeletableEntity } from '../../common/interfaces/base-entity.interface';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface Task extends UserOwnedEntity, SoftDeletableEntity {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: Date;
  completed_at?: Date;
  tags?: string[];
  project_id?: string;
  parent_task_id?: string;
  is_recurring?: boolean;
  recurrence_rule?: string;
  estimated_duration?: number;
  actual_duration?: number;
}
