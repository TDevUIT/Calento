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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../../common/decorators/current-user.decorator';
import { PriorityService } from '../services/priority.service';
import {
  UpdatePriorityDto,
  BulkUpdatePriorityDto,
  PriorityResponseDto,
} from '../dto/priority.dto';

@ApiTags('priorities')
@Controller('priorities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
@ApiCookieAuth('cookie')
export class PriorityController {
  constructor(private readonly priorityService: PriorityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all priorities for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns all user priorities',
    type: [PriorityResponseDto],
  })
  async getUserPriorities(@CurrentUserId() userId: string) {
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
    @CurrentUserId() userId: string,
    @Param('itemId') itemId: string,
    @Param('itemType') itemType: string
  ) {
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
  async getPrioritiesByLevel(
    @CurrentUserId() userId: string,
    @Param('priority') priority: string
  ) {
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
  async getPrioritiesByType(
    @CurrentUserId() userId: string,
    @Param('itemType') itemType: string
  ) {
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
  async updatePriority(
    @CurrentUserId() userId: string,
    @Body() updateDto: UpdatePriorityDto
  ) {
    const priority = await this.priorityService.updatePriority(userId, updateDto);

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
  async bulkUpdatePriorities(
    @CurrentUserId() userId: string,
    @Body() bulkUpdateDto: BulkUpdatePriorityDto
  ) {
    const priorities = await this.priorityService.bulkUpdatePriorities(
      userId,
      bulkUpdateDto
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
    @CurrentUserId() userId: string,
    @Param('itemId') itemId: string,
    @Param('itemType') itemType: string
  ) {
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
  async resetPriorities(@CurrentUserId() userId: string) {
    await this.priorityService.resetUserPriorities(userId);

    return {
      success: true,
      message: 'All priorities reset successfully',
    };
  }
}
