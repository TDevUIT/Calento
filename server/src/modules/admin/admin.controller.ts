import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SystemAdminGuard } from '../../common/guards/system-admin.guard';
import {
  PaginatedResponseDto,
  SuccessResponseDto,
} from '../../common/dto/base-response.dto';
import { MessageService } from '../../common/message/message.service';
import {
  PaginationQueryDto,
  SearchPaginationQueryDto,
} from '../../common/dto/pagination.dto';
import { AdminService } from './admin.service';
import {
  AdminUpdateUserDto,
  AdminUserResponseDto,
  SetUserActiveDto,
  SetUserAdminDto,
} from './dto/admin-user.dto';
import {
  AdminSetActiveDto,
  AdminUpdateBookingStatusDto,
} from './dto/admin-management.dto';
import { BookingStatus } from '../booking/interfaces/booking.interface';

@ApiTags('System Admin')
@ApiExtraModels(
  AdminUserResponseDto,
  AdminUpdateUserDto,
  SetUserActiveDto,
  SetUserAdminDto,
  AdminSetActiveDto,
  AdminUpdateBookingStatusDto,
  SuccessResponseDto,
  PaginatedResponseDto,
)
@Controller('system-admin')
@ApiBearerAuth('bearer')
@ApiCookieAuth('cookie')
@UseGuards(JwtAuthGuard, SystemAdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly messageService: MessageService,
  ) {}

  @Get('users')
  async getUsers(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<AdminUserResponseDto>> {
    const result = await this.adminService.getUsers(query);

    const usersWithoutPassword = result.data.map((user: any) => {
      const { password_hash, ...userResponse } = user;
      return userResponse as AdminUserResponseDto;
    });

    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      usersWithoutPassword,
      result.meta,
    );
  }

  @Get('users/search')
  async searchUsers(
    @Query() query: SearchPaginationQueryDto,
  ): Promise<PaginatedResponseDto<AdminUserResponseDto>> {
    if (!query.search) {
      return this.getUsers(query);
    }

    const result = await this.adminService.searchUsers(query.search, query);

    const usersWithoutPassword = result.data.map((user: any) => {
      const { password_hash, ...userResponse } = user;
      return userResponse as AdminUserResponseDto;
    });

    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      usersWithoutPassword,
      result.meta,
    );
  }

  @Get('users/:id')
  async getUserById(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto<AdminUserResponseDto | null>> {
    const user = await this.adminService.getUserById(id);

    if (!user) {
      return new SuccessResponseDto(
        this.messageService.get('user.not_found'),
        null,
        HttpStatus.NOT_FOUND,
      );
    }

    const { password_hash, ...userResponse } = user as any;

    return new SuccessResponseDto(
      this.messageService.get('success.retrieved'),
      userResponse as AdminUserResponseDto,
    );
  }

  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: AdminUpdateUserDto,
  ): Promise<SuccessResponseDto<AdminUserResponseDto | null>> {
    const user = await this.adminService.updateUser(id, dto);

    if (!user) {
      return new SuccessResponseDto(
        this.messageService.get('user.not_found'),
        null,
        HttpStatus.NOT_FOUND,
      );
    }

    const { password_hash, ...userResponse } = user as any;

    return new SuccessResponseDto(
      this.messageService.get('success.updated'),
      userResponse as AdminUserResponseDto,
    );
  }

  @Patch('users/:id/active')
  async setUserActive(
    @Param('id') id: string,
    @Body() dto: SetUserActiveDto,
  ): Promise<SuccessResponseDto<AdminUserResponseDto | null>> {
    const user = await this.adminService.setUserActive(id, dto.is_active ?? true);

    if (!user) {
      return new SuccessResponseDto(
        this.messageService.get('user.not_found'),
        null,
        HttpStatus.NOT_FOUND,
      );
    }

    const { password_hash, ...userResponse } = user as any;

    return new SuccessResponseDto(
      this.messageService.get('success.updated'),
      userResponse as AdminUserResponseDto,
    );
  }

  @Patch('users/:id/admin')
  async setUserAdmin(
    @Param('id') id: string,
    @Body() dto: SetUserAdminDto,
  ): Promise<SuccessResponseDto<AdminUserResponseDto | null>> {
    const user = await this.adminService.setUserAdmin(id, dto.is_admin ?? false);

    if (!user) {
      return new SuccessResponseDto(
        this.messageService.get('user.not_found'),
        null,
        HttpStatus.NOT_FOUND,
      );
    }

    const { password_hash, ...userResponse } = user as any;

    return new SuccessResponseDto(
      this.messageService.get('success.updated'),
      userResponse as AdminUserResponseDto,
    );
  }

  @Get('booking-links')
  async getBookingLinks(@Query() query: PaginationQueryDto) {
    const result = await this.adminService.getBookingLinks(query);
    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      result.data,
      result.meta,
    );
  }

  @Get('booking-links/search')
  async searchBookingLinks(@Query() query: SearchPaginationQueryDto) {
    if (!query.search) {
      return this.getBookingLinks(query);
    }

    const result = await this.adminService.searchBookingLinks(query.search, query);
    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      result.data,
      result.meta,
    );
  }

  @Get('booking-links/:id')
  async getBookingLinkById(@Param('id') id: string) {
    const link = await this.adminService.getBookingLinkById(id);
    if (!link) {
      return new SuccessResponseDto(
        this.messageService.get('booking.link_not_found', undefined, { id }),
        null,
        HttpStatus.NOT_FOUND,
      );
    }

    return new SuccessResponseDto(this.messageService.get('success.retrieved'), link);
  }

  @Patch('booking-links/:id/active')
  async setBookingLinkActive(
    @Param('id') id: string,
    @Body() dto: AdminSetActiveDto,
  ) {
    const updated = await this.adminService.setBookingLinkActive(
      id,
      dto.is_active ?? true,
    );

    return new SuccessResponseDto(
      this.messageService.get('success.updated'),
      updated,
    );
  }

  @Get('bookings')
  async getBookings(@Query() query: PaginationQueryDto) {
    const result = await this.adminService.getBookings(query);
    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      result.data,
      result.meta,
    );
  }

  @Get('bookings/search')
  async searchBookings(@Query() query: SearchPaginationQueryDto) {
    if (!query.search) {
      return this.getBookings(query);
    }

    const result = await this.adminService.searchBookings(query.search, query);
    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      result.data,
      result.meta,
    );
  }

  @Get('bookings/:id')
  async getBookingById(@Param('id') id: string) {
    const booking = await this.adminService.getBookingById(id);
    if (!booking) {
      return new SuccessResponseDto(
        this.messageService.get('booking.not_found', undefined, { id }),
        null,
        HttpStatus.NOT_FOUND,
      );
    }
    return new SuccessResponseDto(
      this.messageService.get('success.retrieved'),
      booking,
    );
  }

  @Patch('bookings/:id/status')
  async updateBookingStatus(
    @Param('id') id: string,
    @Body() dto: AdminUpdateBookingStatusDto,
  ) {
    const updated = await this.adminService.updateBookingStatus(
      id,
      dto.status ?? BookingStatus.CONFIRMED,
      dto.cancellation_reason,
    );

    return new SuccessResponseDto(
      this.messageService.get('success.updated'),
      updated,
    );
  }

  @Get('events')
  async getEvents(@Query() query: PaginationQueryDto) {
    const result = await this.adminService.getEvents(query);
    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      result.data,
      result.meta,
    );
  }

  @Get('events/search')
  async searchEvents(@Query() query: SearchPaginationQueryDto) {
    if (!query.search) {
      return this.getEvents(query);
    }

    const result = await this.adminService.searchEvents(query.search, query);
    return new PaginatedResponseDto(
      this.messageService.get('success.retrieved'),
      result.data,
      result.meta,
    );
  }

  @Get('events/:id')
  async getEventById(@Param('id') id: string) {
    const event = await this.adminService.getEventById(id);
    if (!event) {
      return new SuccessResponseDto(
        this.messageService.get('calendar.event_not_found'),
        null,
        HttpStatus.NOT_FOUND,
      );
    }
    return new SuccessResponseDto(this.messageService.get('success.retrieved'), event);
  }

  @Delete('events/:id')
  async deleteEvent(@Param('id') id: string) {
    const result = await this.adminService.deleteEvent(id);
    return new SuccessResponseDto(
      result
        ? this.messageService.get('success.deleted')
        : this.messageService.get('calendar.event_not_found'),
      result,
      result ? HttpStatus.OK : HttpStatus.NOT_FOUND,
    );
  }

  @Get('teams')
  async getTeams() {
    const teams = await this.adminService.getTeams();
    return new SuccessResponseDto(
      this.messageService.get('success.retrieved'),
      teams,
    );
  }

  @Get('teams/:id')
  async getTeamById(@Param('id') id: string) {
    const team = await this.adminService.getTeamById(id);
    if (!team) {
      return new SuccessResponseDto(
        this.messageService.get('error.not_found'),
        null,
        HttpStatus.NOT_FOUND,
      );
    }
    return new SuccessResponseDto(this.messageService.get('success.retrieved'), team);
  }

  @Patch('teams/:id/active')
  async setTeamActive(@Param('id') id: string, @Body() dto: AdminSetActiveDto) {
    const team = await this.adminService.setTeamActive(id, dto.is_active ?? true);
    return new SuccessResponseDto(this.messageService.get('success.updated'), team);
  }

  @Delete('teams/:id')
  async deleteTeam(@Param('id') id: string) {
    await this.adminService.deleteTeam(id);
    return new SuccessResponseDto(this.messageService.get('success.deleted'), true);
  }
}
