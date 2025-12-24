import { Injectable } from '@nestjs/common';
import { z, ZodObject, ZodRawShape } from 'zod';
import { BaseTool } from './base-tool';
import { AgentContext } from '../agents/base/agent.interface';
import { TaskService } from '../../task/task.service';
import { TaskPriority, TaskStatus } from '../../task/task.interface';
import { FUNCTION_DESCRIPTIONS } from '../prompts/function-prompts';

/**
 * Create Task Tool
 */
@Injectable()
export class CreateTaskTool extends BaseTool {
  constructor(private readonly taskService: TaskService) {
    const funcDef = FUNCTION_DESCRIPTIONS.CREATE_TASK;
    super(funcDef.name, funcDef.description, funcDef.category, funcDef.parameters);
  }

  getZodSchema(): ZodObject<ZodRawShape> {
    return z.object({
      title: z.string().describe('Task title'),
      description: z.string().optional().describe('Task description'),
      due_date: z.string().optional().describe('Due date in ISO format'),
      priority: z.enum(['low', 'medium', 'high', 'critical']).optional().describe('Task priority'),
    });
  }

  protected async run(args: any, context: AgentContext): Promise<any> {
    const priorityMap: Record<string, TaskPriority> = {
      low: TaskPriority.LOW,
      medium: TaskPriority.MEDIUM,
      high: TaskPriority.HIGH,
      critical: TaskPriority.CRITICAL,
    };

    const task = await this.taskService.createTask(
      context.userId,
      {
        title: args.title,
        description: args.description,
        due_date: args.due_date,
        priority: args.priority ? priorityMap[args.priority] : TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
      }
    );

    return {
      task_id: task.id,
      title: task.title,
      priority: task.priority,
      due_date: task.due_date,
      message: `Created task "${task.title}"`,
    };
  }
}

/**
 * Create Learning Plan Tool
 */
@Injectable()
export class CreateLearningPlanTool extends BaseTool {
  constructor(private readonly taskService: TaskService) {
    const funcDef = FUNCTION_DESCRIPTIONS.CREATE_LEARNING_PLAN;
    super(funcDef.name, funcDef.description, funcDef.category, funcDef.parameters);
  }

  getZodSchema(): ZodObject<ZodRawShape> {
    return z.object({
      topic: z.string().describe('Learning topic'),
      duration_weeks: z.number().describe('Duration in weeks'),
      hours_per_day: z.number().optional().describe('Hours per day'),
      start_date: z.string().optional().describe('Start date in ISO format'),
    });
  }

  protected async run(args: any, context: AgentContext): Promise<any> {
    const { topic, duration_weeks, hours_per_day = 2, start_date } = args;

    const startDate = start_date ? new Date(start_date) : new Date();
    const tasks: any[] = [];

    const weeksPerPhase = Math.ceil(duration_weeks / 4);
    const phases = Math.min(4, duration_weeks);

    for (let i = 0; i < phases; i++) {
      const phaseStart = new Date(startDate);
      phaseStart.setDate(phaseStart.getDate() + i * weeksPerPhase * 7);

      const phaseEnd = new Date(phaseStart);
      phaseEnd.setDate(phaseEnd.getDate() + weeksPerPhase * 7);

      const task = await this.taskService.createTask(
        context.userId,
        {
          title: `${topic} - Phase ${i + 1}/${phases}`,
          description: `Study ${hours_per_day} hours/day for ${weeksPerPhase} weeks`,
          due_date: phaseEnd.toISOString(),
          priority: TaskPriority.HIGH,
          status: TaskStatus.TODO,
        }
      );

      tasks.push({
        id: task.id,
        title: task.title,
        due_date: task.due_date,
      });
    }

    return {
      plan_topic: topic,
      duration_weeks,
      hours_per_day,
      tasks_created: tasks.length,
      tasks,
      message: `Created learning plan "${topic}" with ${tasks.length} phases`,
    };
  }
}
