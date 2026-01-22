import { Injectable } from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import {
  PaginatedResult,
  PaginationOptions,
} from '../../common/interfaces/pagination.interface';
import { User } from '../users/user.entity';
import { AdminUpdateUserDto } from './dto/admin-user.dto';
import { BookingRepository } from '../booking/repositories/booking.repository';
import { BookingLinkRepository } from '../booking/repositories/booking-link.repository';
import { Booking, BookingLink, BookingStatus } from '../booking/interfaces/booking.interface';
import { EventRepository } from '../event/event.repository';
import { Event } from '../event/event';
import { TeamRepository } from '../team/repositories/team.repository';
import { Team } from '../team/interfaces/team.interface';

@Injectable()
export class AdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bookingRepository: BookingRepository,
    private readonly bookingLinkRepository: BookingLinkRepository,
    private readonly eventRepository: EventRepository,
    private readonly teamRepository: TeamRepository,
  ) {}

  async getUsers(
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<User>> {
    return this.userRepository.findAll(paginationOptions, {
      includeDeleted: true,
    });
  }

  async searchUsers(
    searchTerm: string,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<User>> {
    return this.userRepository.searchUsersAdmin(searchTerm, paginationOptions);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id, { includeDeleted: true });
  }

  async updateUser(id: string, dto: AdminUpdateUserDto): Promise<User | null> {
    return this.userRepository.update(id, dto as any, { includeDeleted: true });
  }

  async setUserActive(id: string, is_active: boolean): Promise<User | null> {
    return this.userRepository.update(id, { is_active } as any, {
      includeDeleted: true,
    });
  }

  async setUserAdmin(id: string, is_admin: boolean): Promise<User | null> {
    return this.userRepository.update(id, { is_admin } as any, {
      includeDeleted: true,
    });
  }

  async getBookingLinks(
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<BookingLink>> {
    return this.bookingLinkRepository.getAllBookingLinksAdmin(paginationOptions);
  }

  async searchBookingLinks(
    searchTerm: string,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<BookingLink>> {
    return this.bookingLinkRepository.searchBookingLinksAdmin(
      searchTerm,
      paginationOptions,
    );
  }

  async getBookingLinkById(id: string): Promise<BookingLink | null> {
    return this.bookingLinkRepository.findById(id);
  }

  async setBookingLinkActive(
    id: string,
    is_active: boolean,
  ): Promise<BookingLink> {
    return this.bookingLinkRepository.update(id, { is_active } as any);
  }

  async getBookings(
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Booking>> {
    return this.bookingRepository.findAll(paginationOptions);
  }

  async searchBookings(
    searchTerm: string,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Booking>> {
    return this.bookingRepository.searchBookingsAdmin(searchTerm, paginationOptions);
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return this.bookingRepository.findById(id);
  }

  async updateBookingStatus(
    id: string,
    status: BookingStatus,
    cancellationReason?: string,
  ): Promise<Booking> {
    return this.bookingRepository.updateStatus(id, status, cancellationReason);
  }

  async getEvents(
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Event>> {
    return this.eventRepository.findAll(paginationOptions);
  }

  async searchEvents(
    searchTerm: string,
    paginationOptions: Partial<PaginationOptions>,
  ): Promise<PaginatedResult<Event>> {
    return this.eventRepository.searchEventsAdmin(searchTerm, paginationOptions);
  }

  async getEventById(id: string): Promise<Event | null> {
    return this.eventRepository.findById(id);
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.eventRepository.delete(id);
  }

  async getTeams(): Promise<Team[]> {
    return this.teamRepository.findAll();
  }

  async getTeamById(id: string): Promise<Team | null> {
    return this.teamRepository.findById(id);
  }

  async setTeamActive(id: string, is_active: boolean): Promise<Team> {
    return this.teamRepository.update(id, { is_active } as any);
  }

  async deleteTeam(id: string): Promise<void> {
    return this.teamRepository.delete(id);
  }
}
