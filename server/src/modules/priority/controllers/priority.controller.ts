import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PriorityService } from '../services/priority.service';
import {
  UpdatePriorityDto,
  BulkUpdatePriorityDto,
  PriorityResponseDto,
} from '../dto/priority.dto';

@ApiTags('priorities')
@ApiBearerAuth()
@Controller('priorities')
export class PriorityController {
  constructor(private readonly priorityService: PriorityService) {}

  // TODO: Replace with actual authenticated user ID from request
  private getUserId(): string {
    return '18b0ed75-56d6-40b4-aa5d-a9a17a9fe1d8'; // Temporary hardcoded user ID
  }

  @Get()
  @ApiOperation({ summary: 'Get all priorities for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns all user priorities',
    type: [PriorityResponseDto],
  })
  async getUserPriorities() {
    const userId = this.getUserId();
    const priorities = await this.priorityService.getUserPriorities(userId);

    return {
      success: true,
      message: 'Priorities retrieved successfully',
      data: priorities,
    };
  }

  @Get('item/:itemId/:itemType')
  @ApiOperation({ summary: 'Get priority for a specific item' })
  @ApiResponse({
    status: 200,
    description: 'Returns priority for the specified item',
    type: PriorityResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Priority not found' })
  async getItemPriority(
    @Param('itemId') itemId: string,
    @Param('itemType') itemType: string
  ) {
    const userId = this.getUserId();
    const priority = await this.priorityService.getItemPriority(
      userId,
      itemId,
      itemType
    );

    return {
      success: true,
      message: 'Priority retrieved successfully',
      data: priority,
    };
  }

  @Get('level/:priority')
  @ApiOperation({ summary: 'Get all items with a specific priority level' })
  @ApiResponse({
    status: 200,
    description: 'Returns all items with the specified priority',
    type: [PriorityResponseDto],
  })
  async getPrioritiesByLevel(@Param('priority') priority: string) {
    const userId = this.getUserId();
    const priorities = await this.priorityService.getPrioritiesByLevel(
      userId,
      priority
    );

    return {
      success: true,
      message: 'Priorities retrieved successfully',
      data: priorities,
    };
  }

  @Get('type/:itemType')
  @ApiOperation({ summary: 'Get all priorities for a specific item type' })
  @ApiResponse({
    status: 200,
    description: 'Returns all priorities for the specified item type',
    type: [PriorityResponseDto],
  })
  async getPrioritiesByType(@Param('itemType') itemType: string) {
    const userId = this.getUserId();
    const priorities = await this.priorityService.getPrioritiesByType(
      userId,
      itemType
    );

    return {
      success: true,
      message: 'Priorities retrieved successfully',
      data: priorities,
    };
  }

  @Post('update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update priority for a single item' })
  @ApiResponse({
    status: 200,
    description: 'Priority updated successfully',
    type: PriorityResponseDto,
  })
  async updatePriority(@Body() dto: UpdatePriorityDto) {
    const userId = this.getUserId();
    const priority = await this.priorityService.updatePriority(userId, dto);

    return {
      success: true,
      message: 'Priority updated successfully',
      data: priority,
    };
  }

  @Post('bulk-update')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bulk update priorities for multiple items' })
  @ApiResponse({
    status: 200,
    description: 'Priorities updated successfully',
    type: [PriorityResponseDto],
  })
  async bulkUpdatePriorities(@Body() dto: BulkUpdatePriorityDto) {
    const userId = this.getUserId();
    const priorities = await this.priorityService.bulkUpdatePriorities(
      userId,
      dto
    );

    return {
      success: true,
      message: 'Priorities updated successfully',
      data: priorities,
    };
  }

  @Delete('item/:itemId/:itemType')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete priority for a specific item' })
  @ApiResponse({ status: 200, description: 'Priority deleted successfully' })
  @ApiResponse({ status: 404, description: 'Priority not found' })
  async deletePriority(
    @Param('itemId') itemId: string,
    @Param('itemType') itemType: string
  ) {
    const userId = this.getUserId();
    await this.priorityService.deletePriority(userId, itemId, itemType);

    return {
      success: true,
      message: 'Priority deleted successfully',
    };
  }

  @Delete('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset all priorities for the current user' })
  @ApiResponse({
    status: 200,
    description: 'All priorities reset successfully',
  })
  async resetPriorities() {
    const userId = this.getUserId();
    await this.priorityService.resetUserPriorities(userId);

    return {
      success: true,
      message: 'All priorities reset successfully',
    };
  }
}
