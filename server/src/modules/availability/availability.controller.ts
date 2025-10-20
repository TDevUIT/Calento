import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AvailabilityService } from './services/availability.service';
import {
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
  CheckAvailabilityDto,
  GetAvailableSlotsDto,
  BulkCreateAvailabilityDto,
  AvailabilityResponseDto,
  TimeSlotResponseDto,
  CheckAvailabilityResponseDto,
} from './dto/availability.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MessageService } from '../../common/message/message.service';

@ApiTags('Availability')
@ApiBearerAuth()
@Controller('availability')
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
    private readonly messageService: MessageService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create availability rule',
    description: 'Create a new availability rule for the current user',
  })
  @ApiResponse({
    status: 201,
    description: 'Availability rule created successfully',
    type: AvailabilityResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or overlapping time',
  })
  @ApiResponse({ status: 409, description: 'Overlapping availability rule' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateAvailabilityDto,
  ) {
    const availability = await this.availabilityService.create(userId, dto);

    return {
      success: true,
      message: this.messageService.get('availability.created'),
      data: availability,
    };
  }

  @Post('bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Bulk create availability rules',
    description: 'Create multiple availability rules at once',
  })
  @ApiResponse({
    status: 201,
    description: 'Availability rules created successfully',
    type: [AvailabilityResponseDto],
  })
  async bulkCreate(
    @CurrentUser('id') userId: string,
    @Body() dto: BulkCreateAvailabilityDto,
  ) {
    const availabilities = await this.availabilityService.bulkCreate(
      userId,
      dto.availabilities,
    );

    return {
      success: true,
      message: this.messageService.get('availability.bulk_created', undefined, {
        count: availabilities.length.toString(),
      }),
      data: availabilities,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all availability rules',
    description: 'Retrieve all availability rules for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Availability rules retrieved successfully',
    type: [AvailabilityResponseDto],
  })
  async findAll(@CurrentUser('id') userId: string) {
    const availabilities = await this.availabilityService.findAll(userId);

    return {
      success: true,
      message: this.messageService.get('availability.retrieved'),
      data: availabilities,
      meta: {
        total: availabilities.length,
      },
    };
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get active availability rules',
    description: 'Retrieve only active availability rules',
  })
  @ApiResponse({
    status: 200,
    description: 'Active availability rules retrieved successfully',
    type: [AvailabilityResponseDto],
  })
  async findActive(@CurrentUser('id') userId: string) {
    const availabilities = await this.availabilityService.findActive(userId);

    return {
      success: true,
      message: this.messageService.get('availability.retrieved'),
      data: availabilities,
      meta: {
        total: availabilities.length,
      },
    };
  }

  @Get('schedule')
  @ApiOperation({
    summary: 'Get weekly schedule',
    description: 'Get availability rules organized by day of week',
  })
  @ApiResponse({
    status: 200,
    description: 'Weekly schedule retrieved successfully',
  })
  async getWeeklySchedule(@CurrentUser('id') userId: string) {
    const schedule = await this.availabilityService.getWeeklySchedule(userId);

    return {
      success: true,
      message: this.messageService.get('availability.retrieved'),
      data: schedule,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get availability rule by ID',
    description: 'Retrieve a specific availability rule',
  })
  @ApiResponse({
    status: 200,
    description: 'Availability rule retrieved successfully',
    type: AvailabilityResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Availability rule not found' })
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const availability = await this.availabilityService.findById(id, userId);

    return {
      success: true,
      message: this.messageService.get('availability.retrieved'),
      data: availability,
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update availability rule',
    description: 'Update an existing availability rule',
  })
  @ApiResponse({
    status: 200,
    description: 'Availability rule updated successfully',
    type: AvailabilityResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Availability rule not found' })
  @ApiResponse({ status: 409, description: 'Overlapping availability rule' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    const availability = await this.availabilityService.update(id, userId, dto);

    return {
      success: true,
      message: this.messageService.get('availability.updated'),
      data: availability,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete availability rule',
    description: 'Delete a specific availability rule',
  })
  @ApiResponse({
    status: 204,
    description: 'Availability rule deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Availability rule not found' })
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    await this.availabilityService.delete(id, userId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete all availability rules',
    description: 'Delete all availability rules for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'All availability rules deleted successfully',
  })
  async deleteAll(@CurrentUser('id') userId: string) {
    const count = await this.availabilityService.deleteAll(userId);

    return {
      success: true,
      message: this.messageService.get('availability.bulk_deleted', undefined, {
        count: count.toString(),
      }),
      data: { deleted_count: count },
    };
  }

  @Post('check')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check availability',
    description: 'Check if a user is available at a specific time',
  })
  @ApiResponse({
    status: 200,
    description: 'Availability check completed',
    type: CheckAvailabilityResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid date range' })
  async checkAvailability(
    @CurrentUser('id') userId: string,
    @Body() dto: CheckAvailabilityDto,
  ) {
    const checkUserId = dto.user_id || userId;
    const result = await this.availabilityService.checkAvailability(
      checkUserId,
      dto,
    );

    return {
      success: true,
      message: this.messageService.get('availability.check_success'),
      data: result,
    };
  }

  @Post('initialize-defaults')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Initialize default availability rules',
    description: 'Create default availability rules (Mon-Fri, 9 AM - 5 PM) for the current user',
  })
  @ApiResponse({
    status: 201,
    description: 'Default availability rules created successfully',
  })
  @ApiResponse({ status: 409, description: 'User already has availability rules' })
  async initializeDefaultRules(@CurrentUser('id') userId: string) {
    const existingRules = await this.availabilityService.findActive(userId);
    
    if (existingRules.length > 0) {
      return {
        success: false,
        message: 'User already has availability rules configured',
        data: { existing_rules_count: existingRules.length },
      };
    }

    await this.availabilityService.createDefaultAvailabilityRules(userId);
    const newRules = await this.availabilityService.findActive(userId);

    return {
      success: true,
      message: this.messageService.get('availability.default_rules_created'),
      data: newRules,
      meta: { created_rules_count: newRules.length },
    };
  }

  @Post('slots')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get available time slots',
    description: 'Get all available time slots in a date range',
  })
  @ApiResponse({
    status: 200,
    description: 'Available slots retrieved successfully',
    type: [TimeSlotResponseDto],
  })
  @ApiResponse({ status: 400, description: 'Invalid date range' })
  @ApiResponse({ status: 404, description: 'No availability rules found' })
  async getAvailableSlots(
    @CurrentUser('id') userId: string,
    @Body() dto: GetAvailableSlotsDto,
  ) {
    const checkUserId = dto.user_id || userId;
    const slots = await this.availabilityService.getAvailableSlots(
      checkUserId,
      dto,
    );

    const availableSlots = slots.filter((slot) => slot.available);

    return {
      success: true,
      message: this.messageService.get('availability.slots_retrieved'),
      data: slots,
      meta: {
        total_slots: slots.length,
        available_slots: availableSlots.length,
        unavailable_slots: slots.length - availableSlots.length,
      },
    };
  }
}
