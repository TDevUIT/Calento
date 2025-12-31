import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import {
  CreateCalendarDto,
  UpdateCalendarDto,
} from './dto/calendar.dto';
import { MessageService } from '../../common/message/message.service';
import { ApiTags } from '@nestjs/swagger';
import {
  SuccessResponseDto,
  PaginatedResponseDto,
} from '../../common/dto/base-response.dto';
import {
  PaginationQueryDto,
  SearchPaginationQueryDto,
} from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import { CalendarNotFoundException } from './exceptions/calendar.exceptions';
import {
  ApiCalendarDocs,
  ApiGetCalendars,
  ApiGetPrimaryCalendar,
  ApiSearchCalendars,
  ApiGetCalendarById,
  ApiCreateCalendar,
  ApiUpdateCalendar,
  ApiDeleteCalendar,
} from './calendar.swagger';

@ApiTags('Calendars')
@ApiCalendarDocs()
@Controller('calendars')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(
    private readonly calendarService: CalendarService,
    private readonly messageService: MessageService,
  ) { }

  @Get()
  @ApiGetCalendars()
  async getCalendars(
    @CurrentUserId() userId: string,
    @Query() query: SearchPaginationQueryDto,
  ): Promise<PaginatedResponseDto> {
    const result = await this.calendarService.getCalendars(userId, query);

    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      result.data,
      result.meta,
    );
  }

  @Get('primary')
  @ApiGetPrimaryCalendar()
  async getPrimaryCalendar(
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const calendar = await this.calendarService.getPrimaryCalendar(userId);

    if (!calendar) {
      throw new CalendarNotFoundException();
    }

    return new SuccessResponseDto(
      this.messageService.get('success.retrieved'),
      calendar,
    );
  }

  @Get('search')
  @ApiSearchCalendars()
  async searchCalendars(
    @CurrentUserId() userId: string,
    @Query('q') searchTerm: string,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto> {
    const result = await this.calendarService.searchCalendars(
      userId,
      searchTerm,
      query,
    );

    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      result.data,
      result.meta,
    );
  }

  @Get(':id')
  @ApiGetCalendarById()
  async getCalendarById(
    @Param('id') calendarId: string,
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const calendar = await this.calendarService.getCalendarById(
      calendarId,
      userId,
    );

    if (!calendar) {
      throw new CalendarNotFoundException(calendarId);
    }

    return new SuccessResponseDto(
      this.messageService.get('success.retrieved'),
      calendar,
    );
  }

  @Post()
  @ApiCreateCalendar()
  async createCalendar(
    @Body() createCalendarDto: CreateCalendarDto,
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const calendar = await this.calendarService.createCalendar(
      createCalendarDto,
      userId,
    );

    return new SuccessResponseDto(
      this.messageService.get('calendar.created'),
      calendar,
      HttpStatus.CREATED,
    );
  }

  @Put(':id')
  @ApiUpdateCalendar()
  async updateCalendar(
    @Param('id') calendarId: string,
    @Body() updateCalendarDto: UpdateCalendarDto,
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const calendar = await this.calendarService.updateCalendar(
      calendarId,
      updateCalendarDto,
      userId,
    );

    return new SuccessResponseDto(
      this.messageService.get('calendar.updated'),
      calendar,
    );
  }

  @Delete(':id')
  @ApiDeleteCalendar()
  async deleteCalendar(
    @Param('id') calendarId: string,
    @CurrentUserId() userId: string,
  ): Promise<SuccessResponseDto> {
    const deleted = await this.calendarService.deleteCalendar(
      calendarId,
      userId,
    );

    return new SuccessResponseDto(this.messageService.get('calendar.deleted'), {
      deleted,
      calendar_id: calendarId,
    });
  }
}
