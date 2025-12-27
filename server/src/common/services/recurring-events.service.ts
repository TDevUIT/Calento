import { Injectable, Logger } from '@nestjs/common';
import { RRule, RRuleSet, rrulestr } from 'rrule';
import { Event } from '../../modules/event/event';

export interface ExpandedEvent extends Event {
  original_event_id?: string;
  occurrence_index?: number;
  is_recurring_instance: boolean;
}

@Injectable()
export class RecurringEventsService {
  private readonly logger = new Logger(RecurringEventsService.name);

  expandRecurringEvents(
    recurringEvents: Event[],
    startDate: Date,
    endDate: Date,
    maxOccurrences: number = 100,
  ): ExpandedEvent[] {
    const expandedEvents = recurringEvents.reduce((acc, event) => {
      if (!this.isRecurringEvent(event)) return acc;

      const occurrences = this.tryGenerateOccurrences(
        event,
        startDate,
        endDate,
        maxOccurrences,
      );
      return [...acc, ...occurrences];
    }, [] as ExpandedEvent[]);

    return this.sortByStartTime(expandedEvents);
  }

  private tryGenerateOccurrences(
    event: Event,
    startDate: Date,
    endDate: Date,
    maxOccurrences: number,
  ): ExpandedEvent[] {
    try {
      return this.generateOccurrences(
        event,
        startDate,
        endDate,
        maxOccurrences,
      );
    } catch (error) {
      this.logger.warn(`Failed to expand event ${event.id}: ${error.message}`);
      return [{ ...event, is_recurring_instance: false }];
    }
  }

  private generateOccurrences(
    event: Event,
    startDate: Date,
    endDate: Date,
    maxOccurrences: number,
  ): ExpandedEvent[] {
    const rrule = this.parseRecurrenceRule(
      event.recurrence_rule!,
      event.start_time,
    );
    const occurrences = rrule
      .between(startDate, endDate, true)
      .slice(0, maxOccurrences);
    const duration = this.calculateDuration(event);

    return occurrences.map((date, index) =>
      this.createOccurrence(event, date, duration, index),
    );
  }

  private createOccurrence(
    event: Event,
    occurrenceDate: Date,
    duration: number,
    index: number,
  ): ExpandedEvent {
    return {
      ...event,
      id: `${event.id}_occurrence_${index}`,
      original_event_id: event.id,
      occurrence_index: index,
      start_time: occurrenceDate,
      end_time: new Date(occurrenceDate.getTime() + duration),
      is_recurring_instance: true,
    };
  }

  private calculateDuration(event: Event): number {
    return event.end_time.getTime() - event.start_time.getTime();
  }

  private sortByStartTime(events: ExpandedEvent[]): ExpandedEvent[] {
    return events.sort(
      (a, b) => a.start_time.getTime() - b.start_time.getTime(),
    );
  }

  private parseRecurrenceRule(recurrenceRule: string, dtstart: Date): RRule {
    try {
      const rruleString = this.normalizeRRuleString(recurrenceRule);
      return rrulestr(rruleString, { dtstart }) as RRule;
    } catch (error) {
      this.logger.error(`Failed to parse RRULE: ${recurrenceRule}`, error);
      throw new Error(`Invalid recurrence rule: ${recurrenceRule}`);
    }
  }

  private normalizeRRuleString(rule: string): string {
    return rule.toUpperCase().startsWith('RRULE:') ? rule : `RRULE:${rule}`;
  }

  validateRecurrenceRule(recurrenceRule: string): boolean {
    if (!recurrenceRule?.trim()) return false;

    try {
      this.parseRecurrenceRule(recurrenceRule, new Date());
      return true;
    } catch {
      return false;
    }
  }

  getNextOccurrences(
    event: Event,
    count: number = 10,
    afterDate: Date = new Date(),
  ): Date[] {
    if (!this.isRecurringEvent(event)) return [];

    try {
      const rrule = this.parseRecurrenceRule(
        event.recurrence_rule!,
        event.start_time,
      );
      return rrule.all((date, i) => i < count && date > afterDate);
    } catch (error) {
      this.logger.error(
        `Failed to get next occurrences for ${event.id}:`,
        error,
      );
      return [];
    }
  }

  getOccurrenceById(
    event: Event,
    occurrenceIndex: number,
  ): ExpandedEvent | null {
    if (!this.isRecurringEvent(event)) {
      return null;
    }

    try {
      const rrule = this.parseRecurrenceRule(
        event.recurrence_rule!,
        event.start_time,
      );

      const allOccurrences = rrule.all();

      if (occurrenceIndex < 0 || occurrenceIndex >= allOccurrences.length) {
        return null;
      }

      const occurrenceDate = allOccurrences[occurrenceIndex];
      const duration = this.calculateDuration(event);

      return this.createOccurrence(
        event,
        occurrenceDate,
        duration,
        occurrenceIndex,
      );
    } catch (error) {
      this.logger.error(
        `Failed to get occurrence ${occurrenceIndex} for event ${event.id}:`,
        error,
      );
      return null;
    }
  }

  isRecurringEvent(event: Event): boolean {
    return !!event.recurrence_rule?.trim();
  }
}
