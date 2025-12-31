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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AvailabilityService } from './services/availability.service';
import {
  CreateAvailabilityDto,
  UpdateAvailabilityDto,
  CheckAvailabilityDto,
  GetAvailableSlotsDto,
  BulkCreateAvailabilityDto,
} from './dto/availability.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import { MessageService } from '../../common/message/message.service';
import {
  ApiCreateAvailability,
  ApiBulkCreateAvailability,
  ApiGetAvailabilities,
  ApiGetActiveAvailabilities,
  ApiGetWeeklySchedule,
  ApiGetAvailabilityById,
  ApiUpdateAvailability,
  ApiDeleteAvailability,
  ApiDeleteAllAvailabilities,
  ApiCheckAvailability,
  ApiInitializeDefaultRules,
  ApiGetAvailableSlots,
} from './availability.swagger';

@ApiTags('Availability')
@ApiBearerAuth()
@Controller('availability')
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
    private readonly messageService: MessageService,
  ) { }

  @Post()
  @ApiCreateAvailability()
  async create(
    @CurrentUserId() userId: string,
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
  @ApiBulkCreateAvailability()
  async bulkCreate(
    @CurrentUserId() userId: string,
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
  @ApiGetAvailabilities()
  async findAll(@CurrentUserId() userId: string) {
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
  @ApiGetActiveAvailabilities()
  async findActive(@CurrentUserId() userId: string) {
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
  @ApiGetWeeklySchedule()
  async getWeeklySchedule(@CurrentUserId() userId: string) {
    const schedule = await this.availabilityService.getWeeklySchedule(userId);

    return {
      success: true,
      message: this.messageService.get('availability.retrieved'),
      data: schedule,
    };
  }

  @Get(':id')
  @ApiGetAvailabilityById()
  async findOne(@Param('id') id: string, @CurrentUserId() userId: string) {
    const availability = await this.availabilityService.findById(id, userId);

    return {
      success: true,
      message: this.messageService.get('availability.retrieved'),
      data: availability,
    };
  }

  @Patch(':id')
  @ApiUpdateAvailability()
  async update(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
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
  @ApiDeleteAvailability()
  async delete(@Param('id') id: string, @CurrentUserId() userId: string) {
    await this.availabilityService.delete(id, userId);
  }

  @Delete()
  @ApiDeleteAllAvailabilities()
  async deleteAll(@CurrentUserId() userId: string) {
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
  @ApiCheckAvailability()
  async checkAvailability(
    @CurrentUserId() userId: string,
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
  @ApiInitializeDefaultRules()
  async initializeDefaultRules(@CurrentUserId() userId: string) {
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
  @ApiGetAvailableSlots()
  async getAvailableSlots(
    @CurrentUserId() userId: string,
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
