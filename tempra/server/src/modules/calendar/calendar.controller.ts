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
    HttpCode 
} from "@nestjs/common";
import { CalendarService } from "./calendar.service";
import { CreateCalendarDto, UpdateCalendarDto, CalendarResponseDto } from "./dto/calendar.dto";
import { MessageService } from "../../common/message/message.service";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiCookieAuth, ApiExtraModels, ApiParam } from "@nestjs/swagger";
import { SuccessResponseDto, PaginatedResponseDto } from "../../common/dto/base-response.dto";
import { PaginationQueryDto } from "../../common/dto/pagination.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUserId } from "../../common/decorators/current-user.decorator";
import { CalendarNotFoundException } from "./exceptions/calendar.exceptions";

@ApiTags('Calendars')
@ApiExtraModels(CalendarResponseDto, CreateCalendarDto, UpdateCalendarDto, SuccessResponseDto, PaginatedResponseDto)
@Controller('calendars')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearer')
@ApiCookieAuth('cookie')
export class CalendarController {
    constructor(
        private readonly calendarService: CalendarService,
        private readonly messageService: MessageService
    ) {}

    @Get()
    @ApiOperation({ 
        summary: '📅 Get user calendars with pagination',
        description: 'Retrieve paginated list of calendars with filtering and search'
    })
    @ApiResponse({ 
        status: 200, 
        description: '✅ Calendars retrieved successfully',
        type: PaginatedResponseDto
    })
    @ApiResponse({ 
        status: 401, 
        description: '❌ Unauthorized - Invalid or expired token'
    })
    async getCalendars(
        @CurrentUserId() userId: string,
        @Query() query: PaginationQueryDto
    ): Promise<PaginatedResponseDto> {
        const result = await this.calendarService.getCalendars(userId, query);
        
        return new PaginatedResponseDto(
            this.messageService.get('success.retrieved'),
            result.data,
            result.meta
        );
    }

    @Get('primary')
    @ApiOperation({ 
        summary: '⭐ Get user primary calendar',
        description: 'Retrieve the primary calendar for the authenticated user'
    })
    @ApiResponse({ 
        status: 200, 
        description: '✅ Primary calendar retrieved successfully',
        type: SuccessResponseDto
    })
    @ApiResponse({ 
        status: 404, 
        description: '❌ Primary calendar not found'
    })
    async getPrimaryCalendar(
        @CurrentUserId() userId: string
    ): Promise<SuccessResponseDto> {
        const calendar = await this.calendarService.getPrimaryCalendar(userId);
        
        if (!calendar) {
            throw new CalendarNotFoundException();
        }

        return new SuccessResponseDto(
            this.messageService.get('success.retrieved'),
            calendar
        );
    }

    @Get('search')
    @ApiOperation({ 
        summary: '🔍 Search calendars',
        description: 'Search calendars by name or description'
    })
    @ApiResponse({ 
        status: 200, 
        description: '✅ Search results retrieved successfully',
        type: PaginatedResponseDto
    })
    async searchCalendars(
        @CurrentUserId() userId: string,
        @Query('q') searchTerm: string,
        @Query() query: PaginationQueryDto
    ): Promise<PaginatedResponseDto> {
        const result = await this.calendarService.searchCalendars(userId, searchTerm, query);
        
        return new PaginatedResponseDto(
            this.messageService.get('success.retrieved'),
            result.data,
            result.meta
        );
    }

    @Get(':id')
    @ApiOperation({ 
        summary: '📋 Get calendar by ID',
        description: 'Retrieve a specific calendar by its ID'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Calendar UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({ 
        status: 200, 
        description: '✅ Calendar retrieved successfully',
        type: SuccessResponseDto
    })
    @ApiResponse({ 
        status: 404, 
        description: '❌ Calendar not found'
    })
    async getCalendarById(
        @Param('id') calendarId: string,
        @CurrentUserId() userId: string
    ): Promise<SuccessResponseDto> {
        const calendar = await this.calendarService.getCalendarById(calendarId, userId);
        
        if (!calendar) {
            throw new CalendarNotFoundException(calendarId);
        }

        return new SuccessResponseDto(
            this.messageService.get('success.retrieved'),
            calendar
        );
    }

    @Post()
    @ApiOperation({ 
        summary: '➕ Create a new calendar',
        description: 'Create a new calendar with Google Calendar integration'
    })
    @ApiResponse({ 
        status: 201, 
        description: '✅ Calendar created successfully',
        type: SuccessResponseDto
    })
    @ApiResponse({ 
        status: 400, 
        description: '❌ Validation failed - Invalid input data'
    })
    @ApiResponse({ 
        status: 409, 
        description: '❌ Duplicate calendar - Google Calendar ID already exists'
    })
    async createCalendar(
        @Body() createCalendarDto: CreateCalendarDto,
        @CurrentUserId() userId: string
    ): Promise<SuccessResponseDto> {
        const calendar = await this.calendarService.createCalendar(createCalendarDto, userId);
        
        return new SuccessResponseDto(
            this.messageService.get('calendar.created'),
            calendar,
            HttpStatus.CREATED
        );
    }

    @Put(':id')
    @ApiOperation({ 
        summary: '✏️ Update calendar',
        description: 'Update an existing calendar'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Calendar UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({ 
        status: 200, 
        description: '✅ Calendar updated successfully',
        type: SuccessResponseDto
    })
    @ApiResponse({ 
        status: 404, 
        description: '❌ Calendar not found'
    })
    async updateCalendar(
        @Param('id') calendarId: string,
        @Body() updateCalendarDto: UpdateCalendarDto,
        @CurrentUserId() userId: string
    ): Promise<SuccessResponseDto> {
        const calendar = await this.calendarService.updateCalendar(calendarId, updateCalendarDto, userId);
        
        return new SuccessResponseDto(
            this.messageService.get('calendar.updated'),
            calendar
        );
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ 
        summary: '🗑️ Delete calendar',
        description: 'Delete a calendar permanently'
    })
    @ApiParam({ 
        name: 'id', 
        description: 'Calendar UUID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @ApiResponse({ 
        status: 200, 
        description: '✅ Calendar deleted successfully',
        type: SuccessResponseDto
    })
    @ApiResponse({ 
        status: 404, 
        description: '❌ Calendar not found'
    })
    async deleteCalendar(
        @Param('id') calendarId: string,
        @CurrentUserId() userId: string
    ): Promise<SuccessResponseDto> {
        const deleted = await this.calendarService.deleteCalendar(calendarId, userId);
        
        return new SuccessResponseDto(
            this.messageService.get('calendar.deleted'),
            { deleted, calendar_id: calendarId }
        );
    }
}
