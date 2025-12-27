import { Injectable, Logger } from '@nestjs/common';
import { TeamAvailabilityRepository } from '../repositories/team-availability.repository';
import { TeamMemberRepository } from '../repositories/team-member.repository';
import { TeamRepository } from '../repositories/team.repository';
import { EventService } from '../../event/event.service';
import {
  TeamAvailabilityHeatmap,
  HeatmapSlot,
  OptimalMeetingTime,
} from '../interfaces/team.interface';
import { TEAM_CONSTANTS } from '../constants/team.constants';
import { UserService } from '../../users/user.service';

@Injectable()
export class TeamAvailabilityService {
  private readonly logger = new Logger(TeamAvailabilityService.name);

  constructor(
    private readonly availabilityRepo: TeamAvailabilityRepository,
    private readonly memberRepo: TeamMemberRepository,
    private readonly teamRepo: TeamRepository,
    private readonly eventService: EventService,
    private readonly userService: UserService,
  ) {}

  private async resolveTimezone(
    teamId: string,
    requesterUserId: string,
    timezone?: string,
  ): Promise<string> {
    if (timezone && timezone.trim().length > 0) return timezone;
    const team = await this.teamRepo.findById(teamId);
    const teamTz =
      team?.timezone && team.timezone.trim().length > 0 ? team.timezone : '';
    if (teamTz) return teamTz;
    return (await this.userService.getUserTimezone(requesterUserId)) || 'UTC';
  }

  async generateHeatmap(
    teamId: string,
    requesterUserId: string,
    startDate: Date,
    endDate: Date,
    timezone?: string,
  ): Promise<TeamAvailabilityHeatmap> {
    const resolvedTimezone = await this.resolveTimezone(
      teamId,
      requesterUserId,
      timezone,
    );
    const members = await this.memberRepo.getMemberIds(teamId);
    const slots: HeatmapSlot[] = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        for (
          let hour = TEAM_CONSTANTS.HEATMAP.WORK_HOURS_START;
          hour < TEAM_CONSTANTS.HEATMAP.WORK_HOURS_END;
          hour++
        ) {
          for (
            let minute = 0;
            minute < 60;
            minute += TEAM_CONSTANTS.HEATMAP.SLOT_DURATION_MINUTES
          ) {
            const slotStart = new Date(currentDate);
            slotStart.setHours(hour, minute, 0, 0);

            const slotEnd = new Date(slotStart);
            slotEnd.setMinutes(
              slotEnd.getMinutes() +
                TEAM_CONSTANTS.HEATMAP.SLOT_DURATION_MINUTES,
            );

            const availableMembers = await this.getAvailableMembersForSlot(
              teamId,
              members,
              slotStart,
              slotEnd,
            );

            slots.push({
              datetime: slotStart.toISOString(),
              day: slotStart.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              }),
              time: slotStart.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }),
              available_count: availableMembers.length,
              total_count: members.length,
              availability_percentage: Math.round(
                (availableMembers.length / members.length) * 100,
              ),
              available_members: availableMembers,
            });
          }
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return {
      team_id: teamId,
      date_range: { start: startDate, end: endDate },
      timezone: resolvedTimezone,
      slots,
      members: [],
    };
  }

  async findOptimalTimes(
    teamId: string,
    requesterUserId: string,
    startDate: Date,
    endDate: Date,
    durationMinutes: number,
    requiredMembers?: string[],
    timezone?: string,
  ): Promise<OptimalMeetingTime[]> {
    const resolvedTimezone = await this.resolveTimezone(
      teamId,
      requesterUserId,
      timezone,
    );
    const members =
      requiredMembers || (await this.memberRepo.getMemberIds(teamId));
    const optimalTimes: OptimalMeetingTime[] = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        for (
          let hour = TEAM_CONSTANTS.HEATMAP.WORK_HOURS_START;
          hour < TEAM_CONSTANTS.HEATMAP.WORK_HOURS_END;
          hour++
        ) {
          const slotStart = new Date(currentDate);
          slotStart.setHours(hour, 0, 0, 0);

          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + durationMinutes);

          if (slotEnd.getHours() >= TEAM_CONSTANTS.HEATMAP.WORK_HOURS_END)
            continue;

          const availableMembers = await this.getAvailableMembersForSlot(
            teamId,
            members,
            slotStart,
            slotEnd,
          );

          if (availableMembers.length === members.length) {
            const score = this.calculateScore(
              slotStart,
              slotEnd,
              availableMembers.length,
              members.length,
            );

            optimalTimes.push({
              datetime: slotStart.toISOString(),
              day: slotStart.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              }),
              time: slotStart.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }),
              duration_minutes: durationMinutes,
              availability_percentage: 100,
              available_members: availableMembers,
              score,
              timezone_conflicts: false,
              buffer_violations: 0,
            });
          }
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    this.logger.debug(
      `Resolved timezone for team ${teamId}: ${resolvedTimezone}`,
    );
    return optimalTimes.sort((a, b) => b.score - a.score);
  }

  private async getAvailableMembersForSlot(
    teamId: string,
    memberIds: string[],
    startTime: Date,
    endTime: Date,
  ): Promise<string[]> {
    const available: string[] = [];

    for (const memberId of memberIds) {
      const events = await this.eventService.getEventsByDateRange(
        memberId,
        startTime,
        endTime,
        { page: 1, limit: 100 },
      );

      const hasConflict = events.data.some((event) => {
        const eventStart = new Date(event.start_time);
        const eventEnd = new Date(event.end_time);
        return (
          (startTime >= eventStart && startTime < eventEnd) ||
          (endTime > eventStart && endTime <= eventEnd) ||
          (startTime <= eventStart && endTime >= eventEnd)
        );
      });

      if (!hasConflict) {
        available.push(memberId);
      }
    }

    return available;
  }

  private calculateScore(
    startTime: Date,
    endTime: Date,
    available: number,
    total: number,
  ): number {
    let score = (available / total) * 100;

    const hour = startTime.getHours();
    if ((hour >= 9 && hour < 11) || (hour >= 14 && hour < 16)) {
      score += 20;
    }

    if (hour >= 16) {
      score -= 10;
    }

    return Math.min(Math.round(score), 100);
  }
}
