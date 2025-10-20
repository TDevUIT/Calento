import { Injectable, Logger } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { Task, TaskStatus, TaskPriority } from './task.interface';
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto } from './dto/task.dto';
import {
  TaskCreationFailedException,
  TaskNotFoundException,
  TaskUpdateFailedException,
  TaskDeleteFailedException,
} from './exceptions/task.exceptions';
import { PaginatedResult } from '../../common/interfaces/pagination.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async createTask(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const taskData: Partial<Task> = {
        id: uuidv4(),
        user_id: userId,
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: createTaskDto.status || TaskStatus.TODO,
        priority: createTaskDto.priority || TaskPriority.MEDIUM,
        due_date: createTaskDto.due_date ? new Date(createTaskDto.due_date) : undefined,
        tags: createTaskDto.tags,
        project_id: createTaskDto.project_id,
        parent_task_id: createTaskDto.parent_task_id,
        estimated_duration: createTaskDto.estimated_duration,
      };

      const task = await this.taskRepository.create(taskData);
      this.logger.log(`Task created successfully: ${task.id}`);
      return task;
    } catch (error) {
      this.logger.error(`Failed to create task:`, error);
      throw new TaskCreationFailedException(error.message);
    }
  }

  async getTaskById(userId: string, taskId: string): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);
    
    if (!task || task.user_id !== userId) {
      throw new TaskNotFoundException(taskId);
    }

    return task;
  }

  async getUserTasks(
    userId: string,
    queryDto: TaskQueryDto,
  ): Promise<PaginatedResult<Task>> {
    try {
      const { status, priority, project_id, due_before, due_after, tags, search, ...paginationOptions } = queryDto;

      if (search) {
        return this.taskRepository.searchTasks(userId, search, paginationOptions);
      }

      if (status) {
        return this.taskRepository.findByStatus(userId, status, paginationOptions);
      }

      if (priority) {
        return this.taskRepository.findByPriority(userId, priority, paginationOptions);
      }

      if (project_id) {
        return this.taskRepository.findByProject(userId, project_id, paginationOptions);
      }

      if (due_before && due_after) {
        return this.taskRepository.findByDateRange(
          userId,
          new Date(due_after),
          new Date(due_before),
          paginationOptions,
        );
      }

      if (tags) {
        const tagArray = tags.split(',').map(tag => tag.trim());
        return this.taskRepository.findByTags(userId, tagArray, paginationOptions);
      }

      return this.taskRepository.findByUserId(userId, paginationOptions);
    } catch (error) {
      this.logger.error(`Failed to get user tasks:`, error);
      throw error;
    }
  }

  async getOverdueTasks(userId: string, queryDto: TaskQueryDto): Promise<PaginatedResult<Task>> {
    try {
      return this.taskRepository.findOverdue(userId, queryDto);
    } catch (error) {
      this.logger.error(`Failed to get overdue tasks:`, error);
      throw error;
    }
  }

  async updateTask(
    userId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const existingTask = await this.getTaskById(userId, taskId);

    try {
      const updateData: Partial<Task> = {};

      if (updateTaskDto.title !== undefined) updateData.title = updateTaskDto.title;
      if (updateTaskDto.description !== undefined) updateData.description = updateTaskDto.description;
      if (updateTaskDto.status !== undefined) {
        updateData.status = updateTaskDto.status;
        if (updateTaskDto.status === TaskStatus.COMPLETED && !existingTask.completed_at) {
          updateData.completed_at = new Date();
        }
      }
      if (updateTaskDto.priority !== undefined) updateData.priority = updateTaskDto.priority;
      if (updateTaskDto.due_date !== undefined) {
        updateData.due_date = updateTaskDto.due_date ? new Date(updateTaskDto.due_date) : undefined;
      }
      if (updateTaskDto.tags !== undefined) updateData.tags = updateTaskDto.tags;
      if (updateTaskDto.project_id !== undefined) updateData.project_id = updateTaskDto.project_id;
      if (updateTaskDto.parent_task_id !== undefined) updateData.parent_task_id = updateTaskDto.parent_task_id;
      if (updateTaskDto.estimated_duration !== undefined) updateData.estimated_duration = updateTaskDto.estimated_duration;
      if (updateTaskDto.actual_duration !== undefined) updateData.actual_duration = updateTaskDto.actual_duration;
      if (updateTaskDto.completed_at !== undefined) {
        updateData.completed_at = updateTaskDto.completed_at ? new Date(updateTaskDto.completed_at) : undefined;
      }

      const updatedTask = await this.taskRepository.update(taskId, updateData);
      
      if (!updatedTask) {
        throw new TaskNotFoundException(taskId);
      }

      this.logger.log(`Task updated successfully: ${taskId}`);
      return updatedTask;
    } catch (error) {
      this.logger.error(`Failed to update task ${taskId}:`, error);
      if (error instanceof TaskNotFoundException) {
        throw error;
      }
      throw new TaskUpdateFailedException(error.message);
    }
  }

  async updateTaskStatus(
    userId: string,
    taskId: string,
    status: TaskStatus,
  ): Promise<Task> {
    await this.getTaskById(userId, taskId);

    try {
      const updatedTask = await this.taskRepository.updateStatus(taskId, status);
      
      if (!updatedTask) {
        throw new TaskNotFoundException(taskId);
      }

      this.logger.log(`Task status updated successfully: ${taskId} to ${status}`);
      return updatedTask;
    } catch (error) {
      this.logger.error(`Failed to update task status ${taskId}:`, error);
      if (error instanceof TaskNotFoundException) {
        throw error;
      }
      throw new TaskUpdateFailedException(error.message);
    }
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    await this.getTaskById(userId, taskId);

    try {
      const deleted = await this.taskRepository.softDelete(taskId);
      
      if (!deleted) {
        throw new TaskNotFoundException(taskId);
      }

      this.logger.log(`Task soft deleted successfully: ${taskId}`);
    } catch (error) {
      this.logger.error(`Failed to delete task ${taskId}:`, error);
      if (error instanceof TaskNotFoundException) {
        throw error;
      }
      throw new TaskDeleteFailedException(error.message);
    }
  }

  async restoreTask(userId: string, taskId: string): Promise<Task> {
    const task = await this.taskRepository.findById(taskId, { includeDeleted: true });
    
    if (!task || task.user_id !== userId) {
      throw new TaskNotFoundException(taskId);
    }

    try {
      await this.taskRepository.restore(taskId);
      const restoredTask = await this.taskRepository.findById(taskId);
      
      if (!restoredTask) {
        throw new TaskNotFoundException(taskId);
      }
      
      this.logger.log(`Task restored successfully: ${taskId}`);
      return restoredTask;
    } catch (error) {
      this.logger.error(`Failed to restore task ${taskId}:`, error);
      throw new TaskUpdateFailedException(error.message);
    }
  }

  async getTaskStatistics(userId: string) {
    try {
      return await this.taskRepository.getTaskStatistics(userId);
    } catch (error) {
      this.logger.error(`Failed to get task statistics:`, error);
      throw error;
    }
  }
}
