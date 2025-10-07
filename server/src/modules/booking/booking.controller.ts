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
  ApiParam,
} from '@nestjs/swagger';
import { BookingService } from './booking.service';
import {
  CreateBookingLinkDto,
  UpdateBookingLinkDto,
  CreateBookingDto,
  CancelBookingDto,
  RescheduleBookingDto,
  GetAvailableSlotsDto,
  BookingLinkResponseDto,
  BookingResponseDto,
  BookingTimeSlotResponseDto,
} from './dto/booking.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MessageService } from '../../common/message/message.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Booking Links')
@ApiBearerAuth()
@Controller('booking-links')
@UseGuards(JwtAuthGuard)
export class BookingLinkController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly messageService: MessageService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create booking link',
    description: 'Create a new public booking link',
  })
  @ApiResponse({
    status: 201,
    description: 'Booking link created successfully',
    type: BookingLinkResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateBookingLinkDto,
  ) {
    const bookingLink = await this.bookingService.createBookingLink(userId, dto);

    return {
      success: true,
      message: this.messageService.get('booking.link_created'),
      data: bookingLink,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all booking links',
    description: 'Retrieve all booking links for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking links retrieved successfully',
    type: [BookingLinkResponseDto],
  })
  async findAll(@CurrentUser('id') userId: string) {
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
  @ApiOperation({
    summary: 'Get active booking links',
    description: 'Retrieve only active booking links',
  })
  @ApiResponse({
    status: 200,
    description: 'Active booking links retrieved successfully',
    type: [BookingLinkResponseDto],
  })
  async findActive(@CurrentUser('id') userId: string) {
    const bookingLinks = await this.bookingService.getActiveBookingLinks(userId);

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
  @ApiOperation({
    summary: 'Get booking link by ID',
    description: 'Retrieve a specific booking link',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking link retrieved successfully',
    type: BookingLinkResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Booking link not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    const bookingLink = await this.bookingService.getBookingLinkById(id, userId);

    return {
      success: true,
      message: this.messageService.get('booking.link_retrieved'),
      data: bookingLink,
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update booking link',
    description: 'Update an existing booking link',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking link updated successfully',
    type: BookingLinkResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Booking link not found' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateBookingLinkDto,
  ) {
    const bookingLink = await this.bookingService.updateBookingLink(id, userId, dto);

    return {
      success: true,
      message: this.messageService.get('booking.link_updated'),
      data: bookingLink,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete booking link',
    description: 'Delete a booking link',
  })
  @ApiResponse({ status: 204, description: 'Booking link deleted successfully' })
  @ApiResponse({ status: 404, description: 'Booking link not found' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    await this.bookingService.deleteBookingLink(id, userId);
  }

  @Get(':id/bookings')
  @ApiOperation({
    summary: 'Get bookings for link',
    description: 'Retrieve all bookings for a specific booking link',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved successfully',
    type: [BookingResponseDto],
  })
  async getBookingsByLink(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
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
  ) {}

  @Post(':slug')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create booking (Public)',
    description: 'Create a new booking for a public booking link',
  })
  @ApiParam({ name: 'slug', description: 'Booking link slug' })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid booking time' })
  @ApiResponse({ status: 404, description: 'Booking link not found' })
  async create(
    @Param('slug') slug: string,
    @Body() dto: CreateBookingDto,
  ) {
    const booking = await this.bookingService.createBooking(slug, dto);

    return {
      success: true,
      message: this.messageService.get('booking.created'),
      data: booking,
    };
  }

  @Get(':slug/slots')
  @Public()
  @ApiOperation({
    summary: 'Get available slots (Public)',
    description: 'Get available time slots for a booking link',
  })
  @ApiParam({ name: 'slug', description: 'Booking link slug' })
  @ApiResponse({
    status: 200,
    description: 'Available slots retrieved successfully',
    type: [BookingTimeSlotResponseDto],
  })
  async getAvailableSlots(
    @Param('slug') slug: string,
    @Body() dto: GetAvailableSlotsDto,
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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get my bookings',
    description: 'Retrieve all bookings for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Bookings retrieved successfully',
    type: [BookingResponseDto],
  })
  async findAll(@CurrentUser('id') userId: string) {
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get upcoming bookings',
    description: 'Retrieve upcoming bookings for the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'Upcoming bookings retrieved successfully',
    type: [BookingResponseDto],
  })
  async findUpcoming(@CurrentUser('id') userId: string) {
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get booking by ID',
    description: 'Retrieve a specific booking',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking retrieved successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    const booking = await this.bookingService.getBookingById(id, userId);

    return {
      success: true,
      message: this.messageService.get('booking.retrieved'),
      data: booking,
    };
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cancel booking',
    description: 'Cancel an existing booking',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async cancel(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
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
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reschedule booking',
    description: 'Reschedule an existing booking to a new time',
  })
  @ApiResponse({
    status: 200,
    description: 'Booking rescheduled successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async reschedule(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: RescheduleBookingDto,
  ) {
    const booking = await this.bookingService.rescheduleBooking(id, userId, dto);

    return {
      success: true,
      message: this.messageService.get('booking.rescheduled'),
      data: booking,
    };
  }
}
