import { Injectable } from '@nestjs/common';
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
      message: `Đã tạo task "${task.title}"`,
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

  protected async run(args: any, context: AgentContext): Promise<any> {
    const { topic, duration_weeks, hours_per_day = 2, start_date } = args;

    const startDate = start_date ? new Date(start_date) : new Date();
    const tasks: any[] = [];

    // Create tasks for each week
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
          title: `${topic} - Giai đoạn ${i + 1}/${phases}`,
          description: `Học ${hours_per_day} giờ/ngày trong ${weeksPerPhase} tuần`,
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
      message: `Đã tạo kế hoạch học "${topic}" với ${tasks.length} giai đoạn`,
    };
  }
}
