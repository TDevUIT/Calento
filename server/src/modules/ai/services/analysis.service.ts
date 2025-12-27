import { Injectable, Logger } from '@nestjs/common';
import { EventService } from '../../event/event.service';
import { AI_CONSTANTS } from '../constants/ai.constants';

export interface TimeWindow {
  start: Date;
  end: Date;
  day: string;
  time: string;
  available_members: number;
  total_members: number;
  availability_percentage: number;
}

export interface Conflict {
  member_id: string;
  member_name: string;
  day: string;
  time: string;
  reason: string;
  event_title?: string;
}

export interface AnalysisResult {
  duration_seconds: number;
  calendars_checked: number;
  availability_windows: TimeWindow[];
  conflicts: Conflict[];
  best_match: TimeWindow | null;
  match_score: number;
  analysis_completed_at: Date;
}

@Injectable()
export class AIAnalysisService {
  private readonly logger = new Logger(AIAnalysisService.name);

  constructor(private readonly eventService: EventService) {}

  async analyzeTeamAvailability(
    memberIds: string[],
    startDate: Date,
    endDate: Date,
    durationMinutes: number = 60,
    preferredTimeRange?: { start_hour: number; end_hour: number },
  ): Promise<AnalysisResult> {
    const analysisStartTime = Date.now();
    this.logger.log(
      `Starting team availability analysis for ${memberIds.length} members`,
    );

    const timeRange = preferredTimeRange || {
      start_hour: AI_CONSTANTS.WORK_HOURS.START,
      end_hour: AI_CONSTANTS.WORK_HOURS.END,
    };

    const memberCalendars = await this.fetchMemberCalendars(
      memberIds,
      startDate,
      endDate,
    );

    const availabilityWindows = this.findAvailabilityWindows(
      memberCalendars,
      startDate,
      endDate,
      durationMinutes,
      timeRange,
    );

    const conflicts = this.detectConflicts(
      memberCalendars,
      availabilityWindows,
    );

    const scoredWindows = this.scoreAvailabilityWindows(availabilityWindows);

    const bestMatch = scoredWindows.length > 0 ? scoredWindows[0] : null;
    const matchScore = bestMatch ? bestMatch.availability_percentage : 0;

    const duration = (Date.now() - analysisStartTime) / 1000;

    this.logger.log(
      `Analysis completed in ${duration}s. Found ${availabilityWindows.length} windows, best match: ${matchScore}%`,
    );

    return {
      duration_seconds: duration,
      calendars_checked: memberIds.length,
      availability_windows: scoredWindows,
      conflicts,
      best_match: bestMatch,
      match_score: matchScore,
      analysis_completed_at: new Date(),
    };
  }

  private async fetchMemberCalendars(
    memberIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<Map<string, any[]>> {
    const calendarMap = new Map<string, any[]>();

    const calendarPromises = memberIds.map(async (memberId) => {
      try {
        const events = await this.eventService.getEventsByDateRange(
          memberId,
          startDate,
          endDate,
          { page: 1, limit: AI_CONSTANTS.ANALYSIS.MAX_EVENTS_FETCH },
        );
        return { memberId, events: events.data };
      } catch (error) {
        this.logger.warn(
          `Failed to fetch calendar for member ${memberId}:`,
          error,
        );
        return { memberId, events: [] };
      }
    });

    const results = await Promise.all(calendarPromises);
    results.forEach(({ memberId, events }) => {
      calendarMap.set(memberId, events);
    });

    return calendarMap;
  }

  private findAvailabilityWindows(
    memberCalendars: Map<string, any[]>,
    startDate: Date,
    endDate: Date,
    durationMinutes: number,
    timeRange: { start_hour: number; end_hour: number },
  ): TimeWindow[] {
    const windows: TimeWindow[] = [];
    const totalMembers = memberCalendars.size;

    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        currentDate.setDate(currentDate.getDate() + 1);
        continue;
      }

      for (let hour = timeRange.start_hour; hour < timeRange.end_hour; hour++) {
        for (const minute of [0, 30]) {
          const slotStart = new Date(currentDate);
          slotStart.setHours(hour, minute, 0, 0);

          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + durationMinutes);

          if (slotEnd.getHours() >= timeRange.end_hour) {
            continue;
          }

          let availableMembers = 0;
          for (const [_memberId, events] of memberCalendars) {
            const hasConflict = events.some((event) => {
              const eventStart = new Date(event.start_time);
              const eventEnd = new Date(event.end_time);
              return (
                (slotStart >= eventStart && slotStart < eventEnd) ||
                (slotEnd > eventStart && slotEnd <= eventEnd) ||
                (slotStart <= eventStart && slotEnd >= eventEnd)
              );
            });

            if (!hasConflict) {
              availableMembers++;
            }
          }

          if (
            availableMembers >=
            totalMembers * AI_CONSTANTS.ANALYSIS.MIN_AVAILABILITY_THRESHOLD
          ) {
            windows.push({
              start: slotStart,
              end: slotEnd,
              day: slotStart.toLocaleDateString('en-US', { weekday: 'long' }),
              time: slotStart.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }),
              available_members: availableMembers,
              total_members: totalMembers,
              availability_percentage: Math.round(
                (availableMembers / totalMembers) * 100,
              ),
            });
          }
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return windows;
  }

  private detectConflicts(
    memberCalendars: Map<string, any[]>,
    windows: TimeWindow[],
  ): Conflict[] {
    const conflicts: Conflict[] = [];

    for (const [memberId, events] of memberCalendars) {
      for (const event of events) {
        const eventStart = new Date(event.start_time);
        const eventEnd = new Date(event.end_time);

        const conflictingWindow = windows.find((window) => {
          return (
            (window.start >= eventStart && window.start < eventEnd) ||
            (window.end > eventStart && window.end <= eventEnd)
          );
        });

        if (conflictingWindow) {
          conflicts.push({
            member_id: memberId,
            member_name: `Member ${memberId.substring(0, 8)}`,
            day: eventStart.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            }),
            time: eventStart.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }),
            reason: this.getConflictReason(event, eventStart),
            event_title: event.title,
          });
        }
      }
    }

    return conflicts;
  }

  private getConflictReason(event: any, eventStart: Date): string {
    const hour = eventStart.getHours();

    if (hour < 9) return 'Early morning conflict';
    if (hour >= 12 && hour < 13) return 'Lunch time conflict';
    if (hour >= 17) return 'End of day conflict';

    return event.title ? `Busy - ${event.title}` : 'Back-to-back meetings';
  }

  private scoreAvailabilityWindows(windows: TimeWindow[]): TimeWindow[] {
    return windows
      .map((window) => {
        let score = window.availability_percentage;

        const hour = window.start.getHours();
        const { MORNING, AFTERNOON } = AI_CONSTANTS.ANALYSIS.PRODUCTIVITY_HOURS;
        if (
          (hour >= MORNING.START && hour < MORNING.END) ||
          (hour >= AFTERNOON.START && hour < AFTERNOON.END)
        ) {
          score += 10;
        }

        if (hour >= 16) {
          score -= 5;
        }

        if (window.availability_percentage === 100) {
          score += 15;
        }

        return {
          ...window,
          availability_percentage: Math.min(score, 100),
        };
      })
      .sort((a, b) => b.availability_percentage - a.availability_percentage);
  }
}
