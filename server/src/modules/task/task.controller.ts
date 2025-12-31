import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TaskService } from './task.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskQueryDto,
  TaskResponseDto,
} from './dto/task.dto';
import { TaskStatus } from './task.interface';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import {
  SuccessResponseDto,
  PaginatedResponseDto,
} from '../../common/dto/base-response.dto';
import { MessageService } from '../../common/message/message.service';
import {
  ApiCreateTask,
  ApiGetUserTasks,
  ApiGetOverdueTasks,
  ApiGetTaskStatistics,
  ApiGetTaskById,
  ApiUpdateTask,
  ApiPartialUpdateTask,
  ApiUpdateTaskStatus,
  ApiDeleteTask,
  ApiRestoreTask,
} from './task.swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly messageService: MessageService,
  ) { }

  @Post()
  @ApiCreateTask()
  async createTask(
    @CurrentUserId() userId: string,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<SuccessResponseDto<TaskResponseDto>> {
    const task = await this.taskService.createTask(userId, createTaskDto);
    return new SuccessResponseDto(
      this.messageService.get('success.created'),
      task as TaskResponseDto,
      HttpStatus.CREATED,
    );
  }

  @Get()
  @ApiGetUserTasks()
  async getUserTasks(
    @CurrentUserId() userId: string,
    @Query() queryDto: TaskQueryDto,
  ): Promise<PaginatedResponseDto<TaskResponseDto>> {
    const result = await this.taskService.getUserTasks(userId, queryDto);
    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      result.data as TaskResponseDto[],
      result.meta,
    );
  }

  @Get('overdue')
  @ApiGetOverdueTasks()
  async getOverdueTasks(
    @CurrentUserId() userId: string,
    @Query() queryDto: TaskQueryDto,
  ): Promise<PaginatedResponseDto<TaskResponseDto>> {
    const result = await this.taskService.getOverdueTasks(userId, queryDto);
    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      result.data as TaskResponseDto[],
      result.meta,
    );
  }

  @Get('statistics')
  @ApiGetTaskStatistics()
  async getTaskStatistics(
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto<any>> {
    const statistics = await this.taskService.getTaskStatistics(userId);
    return new SuccessResponseDto(
      this.messageService.get('success.retrieved'),
      statistics,
    );
  }

  @Get(':id')
  @ApiGetTaskById()
  async getTaskById(
    @CurrentUserId() userId: string,
    @Param('id') taskId: string,
  ): Promise<SuccessResponseDto<TaskResponseDto>> {
    const task = await this.taskService.getTaskById(userId, taskId);
    return new SuccessResponseDto(
      this.messageService.get('success.retrieved'),
      task as TaskResponseDto,
    );
  }

  @Put(':id')
  @ApiUpdateTask()
  async updateTask(
    @CurrentUserId() userId: string,
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<SuccessResponseDto<TaskResponseDto>> {
    const task = await this.taskService.updateTask(
      userId,
      taskId,
      updateTaskDto,
    );
    return new SuccessResponseDto(
      this.messageService.get('success.updated'),
      task as TaskResponseDto,
    );
  }

  @Patch(':id')
  @ApiPartialUpdateTask()
  async partialUpdateTask(
    @CurrentUserId() userId: string,
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<SuccessResponseDto<TaskResponseDto>> {
    const task = await this.taskService.updateTask(
      userId,
      taskId,
      updateTaskDto,
    );
    return new SuccessResponseDto(
      this.messageService.get('success.updated'),
      task as TaskResponseDto,
    );
  }

  @Patch(':id/status')
  @ApiUpdateTaskStatus()
  async updateTaskStatus(
    @CurrentUserId() userId: string,
    @Param('id') taskId: string,
    @Body('status') status: TaskStatus,
  ): Promise<SuccessResponseDto<TaskResponseDto>> {
    const task = await this.taskService.updateTaskStatus(
      userId,
      taskId,
      status,
    );
    return new SuccessResponseDto(
      this.messageService.get('success.updated'),
      task as TaskResponseDto,
    );
  }

  @Delete(':id')
  @ApiDeleteTask()
  async deleteTask(
    @CurrentUserId() userId: string,
    @Param('id') taskId: string,
  ): Promise<SuccessResponseDto<null>> {
    await this.taskService.deleteTask(userId, taskId);
    return new SuccessResponseDto(
      this.messageService.get('success.deleted'),
      null,
    );
  }

  @Post(':id/restore')
  @ApiRestoreTask()
  async restoreTask(
    @CurrentUserId() userId: string,
    @Param('id') taskId: string,
  ): Promise<SuccessResponseDto<TaskResponseDto>> {
    const task = await this.taskService.restoreTask(userId, taskId);
    return new SuccessResponseDto(
      this.messageService.get('success.updated'),
      task as TaskResponseDto,
    );
  }
}
