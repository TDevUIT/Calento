import { Injectable } from '@nestjs/common';
import { z, ZodObject, ZodRawShape } from 'zod';
import { BaseTool } from './base-tool';
import { AgentContext } from '../agents/base/agent.interface';
import { AIAnalysisService } from '../services/analysis.service';
import { FUNCTION_DESCRIPTIONS } from '../prompts/function-prompts';

@Injectable()
export class AnalyzeTeamAvailabilityTool extends BaseTool {
  constructor(private readonly aiAnalysisService: AIAnalysisService) {
    const funcDef = FUNCTION_DESCRIPTIONS.ANALYZE_TEAM_AVAILABILITY;
    super(
      funcDef.name,
      funcDef.description,
      funcDef.category,
      funcDef.parameters,
    );
  }

  getZodSchema(): ZodObject<ZodRawShape> {
    return z.object({
      member_ids: z
        .array(z.string())
        .optional()
        .describe('List of team member IDs'),
      start_date: z.string().describe('Start date in ISO format'),
      end_date: z.string().describe('End date in ISO format'),
      meeting_duration: z
        .number()
        .optional()
        .describe('Meeting duration in minutes'),
      preferred_time_range: z
        .object({
          start: z.string(),
          end: z.string(),
        })
        .optional()
        .describe('Preferred time range'),
    });
  }

  protected async run(args: any, context: AgentContext): Promise<any> {
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
      preferredTimeRange,
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
    };
  }

  private getBestMatchReason(window: any): string {
    const hour = window.start.getHours();
    const reasons: string[] = [];

    if (window.availability_percentage === 100) {
      reasons.push('Everyone is available');
    }

    if (hour >= 9 && hour < 11) {
      reasons.push('Peak productivity time (morning)');
    } else if (hour >= 14 && hour < 16) {
      reasons.push('Peak productivity time (afternoon)');
    }

    if (reasons.length === 0) {
      reasons.push('Good availability window');
    }

    return reasons.join(' - ');
  }
}
