import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../../common/decorators/current-user.decorator';
import { PriorityService } from '../services/priority.service';
import {
  UpdatePriorityDto,
  BulkUpdatePriorityDto,
} from '../dto/priority.dto';
import {
  ApiGetUserPriorities,
  ApiGetItemPriority,
  ApiGetPrioritiesByLevel,
  ApiGetPrioritiesByType,
  ApiUpdatePriority,
  ApiBulkUpdatePriorities,
  ApiDeletePriority,
  ApiResetPriorities,
} from './priority.swagger';

@ApiTags('priorities')
@Controller('priorities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
@ApiCookieAuth('cookie')
export class PriorityController {
  constructor(private readonly priorityService: PriorityService) { }

  @Get()
  @ApiGetUserPriorities()
  async getUserPriorities(@CurrentUserId() userId: string) {
    const priorities = await this.priorityService.getUserPriorities(userId);

    return {
      success: true,
      message: 'Priorities retrieved successfully',
      data: priorities,
    };
  }

  @Get('item/:itemId/:itemType')
  @ApiGetItemPriority()
  async getItemPriority(
    @CurrentUserId() userId: string,
    @Param('itemId') itemId: string,
    @Param('itemType') itemType: string,
  ) {
    const priority = await this.priorityService.getItemPriority(
      userId,
      itemId,
      itemType,
    );

    return {
      success: true,
      message: 'Priority retrieved successfully',
      data: priority,
    };
  }

  @Get('level/:priority')
  @ApiGetPrioritiesByLevel()
  async getPrioritiesByLevel(
    @CurrentUserId() userId: string,
    @Param('priority') priority: string,
  ) {
    const priorities = await this.priorityService.getPrioritiesByLevel(
      userId,
      priority,
    );

    return {
      success: true,
      message: 'Priorities retrieved successfully',
      data: priorities,
    };
  }

  @Get('type/:itemType')
  @ApiGetPrioritiesByType()
  async getPrioritiesByType(
    @CurrentUserId() userId: string,
    @Param('itemType') itemType: string,
  ) {
    const priorities = await this.priorityService.getPrioritiesByType(
      userId,
      itemType,
    );

    return {
      success: true,
      message: 'Priorities retrieved successfully',
      data: priorities,
    };
  }

  @Post('update')
  @ApiUpdatePriority()
  async updatePriority(
    @CurrentUserId() userId: string,
    @Body() updateDto: UpdatePriorityDto,
  ) {
    const priority = await this.priorityService.updatePriority(
      userId,
      updateDto,
    );

    return {
      success: true,
      message: 'Priority updated successfully',
      data: priority,
    };
  }

  @Post('bulk-update')
  @ApiBulkUpdatePriorities()
  async bulkUpdatePriorities(
    @CurrentUserId() userId: string,
    @Body() bulkUpdateDto: BulkUpdatePriorityDto,
  ) {
    const priorities = await this.priorityService.bulkUpdatePriorities(
      userId,
      bulkUpdateDto,
    );

    return {
      success: true,
      message: 'Priorities updated successfully',
      data: priorities,
    };
  }

  @Delete('item/:itemId/:itemType')
  @ApiDeletePriority()
  async deletePriority(
    @CurrentUserId() userId: string,
    @Param('itemId') itemId: string,
    @Param('itemType') itemType: string,
  ) {
    await this.priorityService.deletePriority(userId, itemId, itemType);

    return {
      success: true,
      message: 'Priority deleted successfully',
    };
  }

  @Delete('reset')
  @ApiResetPriorities()
  async resetPriorities(@CurrentUserId() userId: string) {
    await this.priorityService.resetUserPriorities(userId);

    return {
      success: true,
      message: 'All priorities reset successfully',
    };
  }
}
