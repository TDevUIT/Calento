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

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: Date | string;
  completed_at?: Date | string;
  tags?: string[];
  project_id?: string;
  parent_task_id?: string;
  is_recurring?: boolean;
  recurrence_rule?: string;
  estimated_duration?: number;
  actual_duration?: number;
  is_deleted?: boolean;
  deleted_at?: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
  creator?: {
    id: string;
    name?: string;
    email?: string;
    avatar?: string;
  };
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  tags?: string[];
  project_id?: string;
  parent_task_id?: string;
  estimated_duration?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
  tags?: string[];
  project_id?: string;
  parent_task_id?: string;
  estimated_duration?: number;
  actual_duration?: number;
  completed_at?: string;
}

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: string;
  due_before?: string;
  due_after?: string;
  tags?: string;
  search?: string;
}

export interface TaskStatistics {
  total: number;
  by_status: Record<TaskStatus, number>;
  by_priority: Record<TaskPriority, number>;
  overdue: number;
  completed_today: number;
}

export interface TaskResponse {
  status: number;
  message: string;
  data: Task;
  timestamp: Date;
}

export interface PaginatedTasksResponse {
  status: number;
  message: string;
  data: {
    items: Task[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  timestamp: Date;
}

export interface TaskStatisticsResponse {
  status: number;
  message: string;
  data: TaskStatistics;
  timestamp: Date;
}
