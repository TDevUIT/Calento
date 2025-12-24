import { Injectable, Logger } from '@nestjs/common';
import { AIFunctionCall } from '../interfaces/ai.interface';
import { EventService } from '../../event/event.service';
import { TaskService } from '../../task/task.service';
import { CalendarService } from '../../calendar/calendar.service';
import { TaskPriority, TaskStatus } from '../../task/task.interface';
import { AIAnalysisService } from './analysis.service';
import { AI_CONSTANTS, ERROR_MESSAGES } from '../constants/ai.constants';

@Injectable()
export class AIFunctionCallingService {
  private readonly logger = new Logger(AIFunctionCallingService.name);


  constructor(
    private readonly eventService: EventService,
    private readonly taskService: TaskService,
    private readonly calendarService: CalendarService,
    private readonly aiAnalysisService: AIAnalysisService,
  ) { }

  async executeFunctionCall(
    functionCall: AIFunctionCall,
    userId: string
  ): Promise<{ success: boolean; result?: any; error?: string }> {
    this.logger.log(`Executing function: ${functionCall.name} for user: ${userId}`);

    try {
      switch (functionCall.name) {
        case 'createEvent':
          return await this.handleCreateEvent(functionCall.arguments, userId);

        case 'checkAvailability':
          return await this.handleCheckAvailability(functionCall.arguments, userId);

        case 'createTask':
          return await this.handleCreateTask(functionCall.arguments, userId);

        case 'searchEvents':
          return await this.handleSearchEvents(functionCall.arguments, userId);

        case 'updateEvent':
          return await this.handleUpdateEvent(functionCall.arguments, userId);

        case 'deleteEvent':
          return await this.handleDeleteEvent(functionCall.arguments, userId);

        case 'createLearningPlan':
          return await this.handleCreateLearningPlan(functionCall.arguments, userId);

        case 'analyzeTeamAvailability':
          return await this.handleAnalyzeTeamAvailability(functionCall.arguments, userId);

        default:
          this.logger.warn(`Invalid function call attempted: ${functionCall.name}`);
          return {
            success: false,
            error: `${ERROR_MESSAGES.INVALID_FUNCTION}: ${functionCall.name}`
          };
      }
    } catch (error) {
      this.logger.error(`Function execution failed: ${functionCall.name}`, error);
      return {
        success: false,
        error: `Failed to execute ${functionCall.name}: ${error.message}`
      };
    }
  }

  private async handleCreateEvent(args: any, userId: string) {
    try {
      const primaryCalendar = await this.calendarService.getPrimaryCalendar(userId);
      if (!primaryCalendar) {
        return {
          success: false,
          error: `Unable to create event: ${ERROR_MESSAGES.NO_PRIMARY_CALENDAR}`
        };
      }

      const event = await this.eventService.createEvent(
        {
          calendar_id: primaryCalendar.id,
          title: args.title,
          start_time: args.start_time,
          end_time: args.end_time,
          description: args.description,
          location: args.location,
          attendees: args.attendees?.map((email: string) => ({
            email,
            response_status: 'needsAction',
          })),
        },
        userId
      );

      return {
        success: true,
        result: {
          event_id: event.id,
          title: event.title,
          start_time: event.start_time,
          end_time: event.end_time,
          message: `Successfully created event "${event.title}"`,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Unable to create event: ${error.message}`
      };
    }
  }

  private async handleCheckAvailability(args: any, userId: string) {
    try {
      const eventsResult = await this.eventService.getEventsByDateRange(
        userId,
        new Date(args.start_date),
        new Date(args.end_date),
        { page: 1, limit: 1000 }
      );

      const freeSlots = this.calculateFreeSlots(
        eventsResult.data,
        new Date(args.start_date),
        new Date(args.end_date),
        args.duration_minutes || AI_CONSTANTS.EVENT.DEFAULT_DURATION
      );

      return {
        success: true,
        result: {
          free_slots: freeSlots,
          total_events: eventsResult.data.length,
          message: freeSlots.length > 0
            ? `Found ${freeSlots.length} free time slot(s)`
            : 'No free time slots in this time range',
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Unable to check availability: ${error.message}`
      };
    }
  }

  private async handleCreateTask(args: any, userId: string) {
    try {
      const dueDate = args.due_date || new Date().toISOString();
      const estimatedDuration = args.estimated_duration || AI_CONSTANTS.TASK.DEFAULT_DURATION;

      const task = await this.taskService.createTask(userId, {
        title: args.title,
        description: args.description,
        due_date: dueDate,
        estimated_duration: estimatedDuration,
        priority: args.priority ? (args.priority as TaskPriority) : TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
      });

      return {
        success: true,
        result: {
          task_id: task.id,
          title: task.title,
          due_date: task.due_date,
          estimated_duration: task.estimated_duration,
          priority: task.priority,
          message: `Successfully created task "${task.title}" (${estimatedDuration} minutes)`,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Unable to create task: ${error.message}`
      };
    }
  }

  private async handleSearchEvents(args: any, userId: string) {
    try {
      const now = new Date();

      let startDate: Date;
      if (args.start_date) {
        startDate = new Date(args.start_date);
      } else {
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
      }

      let endDate: Date;
      if (args.end_date) {
        endDate = new Date(args.end_date);
      } else if (args.query) {
        endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      } else {
        endDate = new Date(now);
        endDate.setHours(24, 0, 0, 0);
      }

      const query = args.query || '';

      this.logger.log(`Searching events for user ${userId}`);
      this.logger.log(`   Date range: ${startDate.toISOString()} to ${endDate.toISOString()}`);
      this.logger.log(`   Query: "${query}"`);

      const eventsResult = await this.eventService.searchEventsByDateRange(
        userId,
        startDate,
        endDate,
        query,
        { page: 1, limit: 100 }
      );

      this.logger.log(`   Found ${eventsResult.data.length} total events`);

      const events = eventsResult.data.slice(0, 20).map(e => ({
        id: e.id,
        title: e.title,
        start_time: e.start_time,
        end_time: e.end_time,
        location: e.location,
        description: e.description,
      }));

      const periodDescription = query
        ? `matching "${query}"`
        : `from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`;

      return {
        success: true,
        result: {
          events,
          total: eventsResult.data.length,
          date_range: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          },
          message: events.length > 0
            ? `Found ${events.length} event(s) ${periodDescription}`
            : `No events found ${periodDescription}`,
        },
      };
    } catch (error) {
      this.logger.error(`Error searching events: ${error.message}`, error.stack);
      return {
        success: false,
        error: `Unable to search events: ${error.message}`
      };
    }
  }

  private async handleUpdateEvent(args: any, userId: string) {
    try {
      const event = await this.eventService.updateEvent(
        args.event_id,
        args.updates,
        userId
      );

      return {
        success: true,
        result: {
          event_id: event.id,
          title: event.title,
          message: `Successfully updated event`,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Unable to update event: ${error.message}`
      };
    }
  }

  private async handleDeleteEvent(args: any, userId: string) {
    try {
      await this.eventService.deleteEvent(args.event_id, userId);

      return {
        success: true,
        result: {
          message: `Successfully deleted event`,
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Unable to delete event: ${error.message}`
      };
    }
  }

  private async handleCreateLearningPlan(args: any, userId: string) {
    try {
      const { topic, duration_weeks, hours_per_day = 2, start_date } = args;
      const startDate = start_date ? new Date(start_date) : new Date();

      const tasks: Array<{
        id: string;
        title: string;
        due_date?: Date | string;
      }> = [];
      const totalDays = duration_weeks * 7;
      const phases = Math.min(4, Math.ceil(duration_weeks / 2));

      for (let i = 0; i < phases; i++) {
        const phaseStartDay = Math.floor((totalDays / phases) * i);
        const dueDate = new Date(startDate);
        dueDate.setDate(dueDate.getDate() + phaseStartDay + Math.floor(totalDays / phases));

        const task = await this.taskService.createTask(userId, {
          title: `${topic} - Phase ${i + 1}/${phases}`,
          description: `Learn ${topic} - ${hours_per_day}h/day`,
          due_date: dueDate.toISOString(),
          priority: i === 0 ? TaskPriority.HIGH : TaskPriority.MEDIUM,
          status: TaskStatus.TODO,
        });

        tasks.push(task);
      }

      return {
        success: true,
        result: {
          plan_topic: topic,
          duration_weeks,
          tasks_created: tasks.length,
          tasks: tasks.map(t => ({
            id: t.id,
            title: t.title,
            due_date: t.due_date,
          })),
          message: `Created learning plan "${topic}" with ${tasks.length} phase(s)`,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Unable to create plan: ${error.message}`,
      };
    }
  }

  private async handleAnalyzeTeamAvailability(args: any, userId: string) {
    try {
      this.logger.log(`Analyzing team availability for ${args.member_ids?.length || 0} members`);

      const memberIds = args.member_ids || [];
      const startDate = new Date(args.start_date);
      const endDate = new Date(args.end_date);
      const meetingDuration = args.meeting_duration || 60;
      const preferredTimeRange = args.preferred_time_range;

      const analysis = await this.aiAnalysisService.analyzeTeamAvailability(
        memberIds,
        startDate,
        endDate,
        meetingDuration,
        preferredTimeRange
      );

      const bestMatch = analysis.best_match
        ? {
          day: analysis.best_match.day,
          time: analysis.best_match.time,
          date: analysis.best_match.start.toISOString(),
          available_members: analysis.best_match.available_members,
          total_members: analysis.best_match.total_members,
          availability: `${analysis.best_match.available_members}/${analysis.best_match.total_members} members available`,
          reason: this.getBestMatchReason(analysis.best_match),
        }
        : null;

      return {
        success: true,
        result: {
          analysis: {
            duration: `${analysis.duration_seconds.toFixed(1)}s`,
            calendars_checked: analysis.calendars_checked,
            windows_found: analysis.availability_windows.length,
            conflicts_found: analysis.conflicts.length,
          },
          conflicts: analysis.conflicts.slice(0, 5).map((c) => ({
            member: c.member_name,
            time: `${c.day} ${c.time}`,
            reason: c.reason,
          })),
          best_match: bestMatch,
          match_score: analysis.match_score,
          all_windows: analysis.availability_windows.slice(0, 10).map((w) => ({
            day: w.day,
            time: w.time,
            availability: w.availability_percentage,
          })),
          message: bestMatch
            ? `Perfect! Found an ideal time when ${bestMatch.available_members}/${bestMatch.total_members} members are available`
            : 'No suitable time slots found. Try adjusting the date range or duration.',
        },
      };
    } catch (error) {
      this.logger.error('Team availability analysis failed:', error);
      return {
        success: false,
        error: `Unable to analyze team calendar: ${error.message}`,
      };
    }
  }

  private getBestMatchReason(window: any): string {
    const hour = window.start.getHours();
    const reasons: string[] = [];
    const { MORNING, AFTERNOON } = AI_CONSTANTS.ANALYSIS.PRODUCTIVITY_HOURS;

    if (window.availability_percentage === 100) {
      reasons.push('Everyone is available');
    }

    if (hour >= MORNING.START && hour < MORNING.END) {
      reasons.push('Peak productivity time (morning)');
    } else if (hour >= AFTERNOON.START && hour < AFTERNOON.END) {
      reasons.push('Peak productivity time (afternoon)');
    }

    if (reasons.length === 0) {
      reasons.push('Good availability window');
    }

    return reasons.join(' - ');
  }

  private calculateFreeSlots(
    events: any[],
    startDate: Date,
    endDate: Date,
    durationMinutes: number
  ): Array<{ start: Date; end: Date }> {
    const freeSlots: Array<{ start: Date; end: Date }> = [];

    const sortedEvents = events
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      const dayStart = new Date(currentDate);
      dayStart.setHours(AI_CONSTANTS.WORK_HOURS.START, 0, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(AI_CONSTANTS.WORK_HOURS.END, 0, 0, 0);

      let currentTime = new Date(dayStart);

      while (currentTime.getTime() + durationMinutes * 60000 <= dayEnd.getTime()) {
        const slotEnd = new Date(currentTime.getTime() + durationMinutes * 60000);

        const hasConflict = sortedEvents.some(event => {
          const eventStart = new Date(event.start_time);
          const eventEnd = new Date(event.end_time);
          return (
            (currentTime >= eventStart && currentTime < eventEnd) ||
            (slotEnd > eventStart && slotEnd <= eventEnd) ||
            (currentTime <= eventStart && slotEnd >= eventEnd)
          );
        });

        if (!hasConflict) {
          freeSlots.push({
            start: new Date(currentTime),
            end: new Date(slotEnd),
          });
        }

        currentTime.setMinutes(currentTime.getMinutes() + AI_CONSTANTS.TIME_SLOTS.INTERVAL_MINUTES);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return freeSlots.slice(0, AI_CONSTANTS.ANALYSIS.MAX_FREE_SLOTS);
  }
}
