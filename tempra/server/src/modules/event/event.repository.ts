import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResult, PaginationOptions } from '../../common/interfaces/pagination.interface';
import { Event } from './event';
import { CreateEventDto } from './dto/events.dto';
import { UserValidationService } from '../../common/services/user-validation.service';
import { CalendarValidationService } from '../../common/services/calendar-validation.service';
import { EventValidationService } from '../../common/services/event-validation.service';
import { RecurringEventsService, ExpandedEvent } from '../../common/services/recurring-events.service';
import { MessageService } from '../../common/message/message.service';
import { EventCreationFailedException } from './exceptions/event.exceptions';
import { UserOwnedRepository } from '../../common/repositories/base.repository';

@Injectable()
export class EventRepository extends UserOwnedRepository<Event> {
    constructor(
        databaseService: DatabaseService,
        paginationService: PaginationService,
        messageService: MessageService,
        private userValidationService: UserValidationService,
        private calendarValidationService: CalendarValidationService,
        private eventValidationService: EventValidationService,
        private recurringEventsService: RecurringEventsService
    ) {
        super(databaseService, paginationService, messageService, 'events');
    }

    protected getAllowedSortFields(): string[] {
        return ['created_at', 'updated_at', 'start_time', 'end_time', 'title'];
    }

    async createEvent(eventDto: CreateEventDto, userId: string): Promise<Event> {
        await this.userValidationService.validateUserExists(userId);
        await this.calendarValidationService.validateCalendarExists(userId);
        
        await this.eventValidationService.validateEvent(
            userId,
            eventDto.title,
            new Date(eventDto.start_time),
            new Date(eventDto.end_time),
            eventDto.description,
            eventDto.recurrence_rule
        );

        const eventData: Partial<Event> = {
            user_id: userId,
            title: eventDto.title,
            description: eventDto.description,
            start_time: new Date(eventDto.start_time),
            end_time: new Date(eventDto.end_time),
            location: eventDto.location,
            is_all_day: eventDto.is_all_day || false,
            recurrence_rule: eventDto.recurrence_rule
        };
        
        try {
            return await this.create(eventData);
        } catch (error) {
            throw new EventCreationFailedException(this.messageService.get('error.internal_server_error'));
        }
    }

    async getEvents(
        userId: string,
        options: Partial<PaginationOptions>
    ): Promise<PaginatedResult<Event>> {
        await this.userValidationService.validateUserExists(userId);
        
        try {
            return await this.findByUserId(userId, options);
        } catch (error) {
            throw new EventCreationFailedException(this.messageService.get('error.internal_server_error'));
        }
    }

    async searchEvents(
        userId: string, 
        searchTerm: string, 
        paginationOptions: Partial<PaginationOptions>
    ): Promise<PaginatedResult<Event>> {
        await this.userValidationService.validateUserExists(userId);
        
        const searchPattern = `%${searchTerm}%`;
        const whereCondition = 'user_id = $1 AND (title ILIKE $2 OR description ILIKE $2)';
        const whereParams = [userId, searchPattern];

        try {
            return await this.search(whereCondition, whereParams, paginationOptions);
        } catch (error) {
            this.logger.error('Failed to search events:', error);
            throw new EventCreationFailedException(this.messageService.get('error.internal_server_error'));
        }
    }

    async getEventById(eventId: string, userId: string): Promise<Event | null> {
        await this.userValidationService.validateUserExists(userId);
        
        try {
            const event = await this.findById(eventId);
            if (event && event.user_id === userId) {
                return event;
            }
            return null;
        } catch (error) {
            this.logger.error(`Failed to get event ${eventId}:`, error);
            throw new EventCreationFailedException(this.messageService.get('error.internal_server_error'));
        }
    }

    async updateEvent(eventId: string, eventDto: CreateEventDto, userId: string): Promise<Event> {
        await this.userValidationService.validateUserExists(userId);
        
        const existingEvent = await this.getEventById(eventId, userId);
        if (!existingEvent) {
            throw new EventCreationFailedException(this.messageService.get('error.event_not_found'));
        }

        await this.eventValidationService.validateEvent(
            userId,
            eventDto.title,
            new Date(eventDto.start_time),
            new Date(eventDto.end_time),
            eventDto.description,
            eventDto.recurrence_rule,
            eventId
        );

        const eventData: Partial<Event> = {
            title: eventDto.title,
            description: eventDto.description,
            start_time: new Date(eventDto.start_time),
            end_time: new Date(eventDto.end_time),
            location: eventDto.location,
            is_all_day: eventDto.is_all_day || false,
            recurrence_rule: eventDto.recurrence_rule
        };
        
        try {
            const updatedEvent = await this.update(eventId, eventData);
            if (!updatedEvent) {
                throw new EventCreationFailedException(this.messageService.get('error.event_not_found'));
            }
            return updatedEvent;
        } catch (error) {
            this.logger.error(`Failed to update event ${eventId}:`, error);
            throw new EventCreationFailedException(this.messageService.get('error.internal_server_error'));
        }
    }

    async deleteEvent(eventId: string, userId: string): Promise<boolean> {
        await this.userValidationService.validateUserExists(userId);
        
        const existingEvent = await this.getEventById(eventId, userId);
        if (!existingEvent) {
            throw new EventCreationFailedException(this.messageService.get('error.event_not_found'));
        }
        
        try {
            const result = await this.delete(eventId);
            return result !== null;
        } catch (error) {
            this.logger.error(`Failed to delete event ${eventId}:`, error);
            throw new EventCreationFailedException(this.messageService.get('error.internal_server_error'));
        }
    }

    async findByUserIdAndDateRange(
        userId: string, 
        startDate: Date, 
        endDate: Date, 
        options: Partial<PaginationOptions>
    ): Promise<PaginatedResult<Event>> {
        await this.userValidationService.validateUserExists(userId);
        
        const whereCondition = 'user_id = $1 AND start_time <= $3 AND end_time >= $2';
        const whereParams = [userId, startDate, endDate];

        try {
            return await this.search(whereCondition, whereParams, options);
        } catch (error) {
            this.logger.error('Failed to get events by user ID and date range:', error);
            throw new EventCreationFailedException(this.messageService.get('error.internal_server_error'));
        }
    }
    async searchEventsByDateRange(
        userId: string, 
        startDate: Date, 
        endDate: Date, 
        searchTerm: string, 
        options: Partial<PaginationOptions>
    ): Promise<PaginatedResult<Event>> {
        await this.userValidationService.validateUserExists(userId);
        
        const searchPattern = `%${searchTerm}%`;
        const whereCondition = `
            user_id = $1 
            AND start_time <= $4 
            AND end_time >= $3 
            AND (title ILIKE $2 OR description ILIKE $2)
        `;
        const whereParams = [userId, searchPattern, startDate, endDate];

        try {
            return await this.search(whereCondition, whereParams, options);
        } catch (error) {
            this.logger.error('Failed to search events by date range:', error);
            throw new EventCreationFailedException(this.messageService.get('error.internal_server_error'));
        }
    }

    async findRecurringEventsForExpansion(
        userId: string,
        startDate: Date,
        endDate: Date
    ): Promise<Event[]> {
        await this.userValidationService.validateUserExists(userId);
        
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE user_id = $1 
                AND recurrence_rule IS NOT NULL 
                AND recurrence_rule != ''
                AND start_time <= $3
            ORDER BY start_time ASC
        `;

        try {
            const result = await this.databaseService.query(query, [userId, startDate, endDate]);
            return result.rows;
        } catch (error) {
            this.logger.error('Failed to find recurring events for expansion:', error);
            throw new EventCreationFailedException(this.messageService.get('error.internal_server_error'));
        }
    }

    async expandRecurringEvents(
        userId: string,
        startDate: Date,
        endDate: Date,
        maxOccurrences: number,
        options: Partial<PaginationOptions>
    ): Promise<PaginatedResult<ExpandedEvent>> {
        await this.userValidationService.validateUserExists(userId);

        try {
            const recurringEvents = await this.findRecurringEventsForExpansion(userId, startDate, endDate);
            const expandedEvents = this.recurringEventsService.expandRecurringEvents(
                recurringEvents,
                startDate,
                endDate,
                maxOccurrences
            );

            return this.paginateExpandedEvents(expandedEvents, options);
        } catch (error) {
            this.logger.error('Failed to expand recurring events:', error);
            throw new EventCreationFailedException(this.messageService.get('error.internal_server_error'));
        }
    }

    private paginateExpandedEvents(
        expandedEvents: ExpandedEvent[],
        options: Partial<PaginationOptions>
    ): PaginatedResult<ExpandedEvent> {
        const validatedOptions = this.paginationService.validatePaginationOptions(options);
        const { page, limit } = validatedOptions;
        
        const startIndex = (page - 1) * limit;
        const paginatedItems = expandedEvents.slice(startIndex, startIndex + limit);

        return this.paginationService.createPaginatedResult(
            paginatedItems,
            page,
            limit,
            expandedEvents.length
        );
    }
}
