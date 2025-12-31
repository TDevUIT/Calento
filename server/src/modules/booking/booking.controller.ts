import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import {
  CreateBookingLinkDto,
  UpdateBookingLinkDto,
  CreateBookingDto,
  CancelBookingDto,
  RescheduleBookingDto,
  GetBookingAvailableSlotsDto,
} from './dto/booking.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import { MessageService } from '../../common/message/message.service';
import { Public } from '../../common/decorators/public.decorator';
import {
  ApiCreateBookingLink,
  ApiGetBookingLinks,
  ApiGetActiveBookingLinks,
  ApiGetBookingLinkById,
  ApiUpdateBookingLink,
  ApiDeleteBookingLink,
  ApiGetBookingsByLink,
  ApiGetPublicBookingLink,
  ApiCreateBooking,
  ApiGetAvailableSlotsPublic,
  ApiGetBookingStats,
  ApiGetMyBookings,
  ApiGetUpcomingBookings,
  ApiGetBookingById,
  ApiCancelBooking,
  ApiRescheduleBooking,
} from './booking.swagger';

@ApiTags('Booking Links')
@ApiBearerAuth()
@Controller('booking-links')
@UseGuards(JwtAuthGuard)
export class BookingLinkController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly messageService: MessageService,
  ) { }

  @Post()
  @ApiCreateBookingLink()
  async create(
    @CurrentUserId() userId: string,
    @Body() dto: CreateBookingLinkDto,
  ) {
    const bookingLink = await this.bookingService.createBookingLink(
      userId,
      dto,
    );

    return {
      success: true,
      message: this.messageService.get('booking.link_created'),
      data: bookingLink,
    };
  }

  @Get()
  @ApiGetBookingLinks()
  async findAll(@CurrentUserId() userId: string) {
    const bookingLinks = await this.bookingService.getBookingLinks(userId);

    return {
      success: true,
      message: this.messageService.get('booking.links_retrieved'),
      data: bookingLinks,
      meta: {
        total: bookingLinks.length,
      },
    };
  }

  @Get('active')
  @ApiGetActiveBookingLinks()
  async findActive(@CurrentUserId() userId: string) {
    const bookingLinks =
      await this.bookingService.getActiveBookingLinks(userId);

    return {
      success: true,
      message: this.messageService.get('booking.links_retrieved'),
      data: bookingLinks,
      meta: {
        total: bookingLinks.length,
      },
    };
  }

  @Get(':id')
  @ApiGetBookingLinkById()
  async findOne(@Param('id') id: string, @CurrentUserId() userId: string) {
    const bookingLink = await this.bookingService.getBookingLinkById(
      id,
      userId,
    );

    return {
      success: true,
      message: this.messageService.get('booking.link_retrieved'),
      data: bookingLink,
    };
  }

  @Patch(':id')
  @ApiUpdateBookingLink()
  async update(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Body() dto: UpdateBookingLinkDto,
  ) {
    const bookingLink = await this.bookingService.updateBookingLink(
      id,
      userId,
      dto,
    );

    return {
      success: true,
      message: this.messageService.get('booking.link_updated'),
      data: bookingLink,
    };
  }

  @Delete(':id')
  @ApiDeleteBookingLink()
  async delete(@Param('id') id: string, @CurrentUserId() userId: string) {
    await this.bookingService.deleteBookingLink(id, userId);
  }

  @Get(':id/bookings')
  @ApiGetBookingsByLink()
  async getBookingsByLink(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
  ) {
    const bookings = await this.bookingService.getBookingsByLink(id, userId);

    return {
      success: true,
      message: this.messageService.get('booking.bookings_retrieved'),
      data: bookings,
      meta: {
        total: bookings.length,
      },
    };
  }
}

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly messageService: MessageService,
  ) { }

  @Get('public/:slug')
  @Public()
  @ApiGetPublicBookingLink()
  async getPublicBookingLink(@Param('slug') slug: string) {
    const bookingLink = await this.bookingService.getPublicBookingLink(slug);

    return {
      success: true,
      message: this.messageService.get('booking.link_retrieved'),
      data: bookingLink,
    };
  }

  @Post(':slug')
  @Public()
  @ApiCreateBooking()
  async create(@Param('slug') slug: string, @Body() dto: CreateBookingDto) {
    const booking = await this.bookingService.createBooking(slug, dto);

    return {
      success: true,
      message: this.messageService.get('booking.created'),
      data: booking,
    };
  }

  @Get('public/:slug/slots')
  @Public()
  @ApiGetAvailableSlotsPublic()
  async getAvailableSlots(
    @Param('slug') slug: string,
    @Query() dto: GetBookingAvailableSlotsDto,
  ) {
    const slots = await this.bookingService.getAvailableSlots(slug, dto);

    const availableSlots = slots.filter((slot) => slot.available);

    return {
      success: true,
      message: this.messageService.get('booking.slots_retrieved'),
      data: slots,
      meta: {
        total_slots: slots.length,
        available_slots: availableSlots.length,
        unavailable_slots: slots.length - availableSlots.length,
      },
    };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiGetBookingStats()
  async getStats(@CurrentUserId() userId: string) {
    const stats = await this.bookingService.getBookingStats(userId);

    return {
      success: true,
      message: this.messageService.get('booking.stats_retrieved'),
      data: stats,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiGetMyBookings()
  async findAll(@CurrentUserId() userId: string) {
    const bookings = await this.bookingService.getBookings(userId);

    return {
      success: true,
      message: this.messageService.get('booking.bookings_retrieved'),
      data: bookings,
      meta: {
        total: bookings.length,
      },
    };
  }

  @Get('me/upcoming')
  @UseGuards(JwtAuthGuard)
  @ApiGetUpcomingBookings()
  async findUpcoming(@CurrentUserId() userId: string) {
    const bookings = await this.bookingService.getUpcomingBookings(userId);

    return {
      success: true,
      message: this.messageService.get('booking.bookings_retrieved'),
      data: bookings,
      meta: {
        total: bookings.length,
      },
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiGetBookingById()
  async findOne(@Param('id') id: string, @CurrentUserId() userId: string) {
    const booking = await this.bookingService.getBookingById(id, userId);

    return {
      success: true,
      message: this.messageService.get('booking.retrieved'),
      data: booking,
    };
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiCancelBooking()
  async cancel(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Body() dto: CancelBookingDto,
  ) {
    const booking = await this.bookingService.cancelBooking(id, userId, dto);

    return {
      success: true,
      message: this.messageService.get('booking.cancelled'),
      data: booking,
    };
  }

  @Post(':id/reschedule')
  @UseGuards(JwtAuthGuard)
  @ApiRescheduleBooking()
  async reschedule(
    @Param('id') id: string,
    @CurrentUserId() userId: string,
    @Body() dto: RescheduleBookingDto,
  ) {
    const booking = await this.bookingService.rescheduleBooking(
      id,
      userId,
      dto,
    );

    return {
      success: true,
      message: this.messageService.get('booking.rescheduled'),
      data: booking,
    };
  }
}
