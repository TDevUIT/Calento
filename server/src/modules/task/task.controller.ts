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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto, TaskQueryDto, TaskResponseDto } from './dto/task.dto';
import { TaskStatus } from './task.interface';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import { SuccessResponseDto, PaginatedResponseDto } from '../../common/dto/base-response.dto';
import { MessageService } from '../../common/message/message.service';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly messageService: MessageService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Task created successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid task data',
  })
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
  @ApiOperation({ summary: 'Get all tasks for the current user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tasks retrieved successfully',
    type: PaginatedResponseDto,
  })
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
  @ApiOperation({ summary: 'Get overdue tasks' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Overdue tasks retrieved successfully',
    type: PaginatedResponseDto,
  })
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
  @ApiOperation({ summary: 'Get task statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task statistics retrieved successfully',
  })
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
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task retrieved successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
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
  @ApiOperation({ summary: 'Update task (full replacement)' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task updated successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
  async updateTask(
    @CurrentUserId() userId: string,
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<SuccessResponseDto<TaskResponseDto>> {
    const task = await this.taskService.updateTask(userId, taskId, updateTaskDto);
    return new SuccessResponseDto(
      this.messageService.get('success.updated'),
      task as TaskResponseDto,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task (partial update)' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task updated successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
  async partialUpdateTask(
    @CurrentUserId() userId: string,
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<SuccessResponseDto<TaskResponseDto>> {
    const task = await this.taskService.updateTask(userId, taskId, updateTaskDto);
    return new SuccessResponseDto(
      this.messageService.get('success.updated'),
      task as TaskResponseDto,
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task status updated successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
  async updateTaskStatus(
    @CurrentUserId() userId: string,
    @Param('id') taskId: string,
    @Body('status') status: TaskStatus,
  ): Promise<SuccessResponseDto<TaskResponseDto>> {
    const task = await this.taskService.updateTaskStatus(userId, taskId, status);
    return new SuccessResponseDto(
      this.messageService.get('success.updated'),
      task as TaskResponseDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete task (soft delete)' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
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
  @ApiOperation({ summary: 'Restore a soft-deleted task' })
  @ApiParam({
    name: 'id',
    description: 'Task ID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task restored successfully',
    type: TaskResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Task not found',
  })
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
