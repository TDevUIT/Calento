import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import {
  EventAnalytics,
  TimeDistribution,
  CategoryAnalytics,
  AttendeeAnalytics,
  BookingAnalytics,
  TimeUtilization,
  AnalyticsPeriod,
} from './interfaces/analytics.interface';

@Injectable()
export class AnalyticsRepository {
  private readonly logger = new Logger(AnalyticsRepository.name);

  constructor(private databaseService: DatabaseService) {}

  async getEventAnalytics(
    userId: string,
    startDate: Date,
    endDate: Date,
    calendarId?: string,
  ): Promise<EventAnalytics> {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const baseConditions = this.buildBaseConditions(userId, calendarId);
    const dateConditions = `${baseConditions} AND e.start_time >= $2 AND e.end_time <= $3`;

    try {
      const [total, upcoming, past, recurring, thisWeek, thisMonth] =
        await Promise.all([
          this.countEvents(dateConditions, [userId, startDate, endDate]),
          this.countEvents(`${baseConditions} AND e.start_time >= $2`, [
            userId,
            now,
          ]),
          this.countEvents(`${baseConditions} AND e.end_time < $2`, [
            userId,
            now,
          ]),
          this.countEvents(
            `${dateConditions} AND e.recurrence_rule IS NOT NULL`,
            [userId, startDate, endDate],
          ),
          this.countEvents(
            `${baseConditions} AND e.start_time >= $2 AND e.start_time < $3`,
            [userId, weekStart, endDate],
          ),
          this.countEvents(
            `${baseConditions} AND e.start_time >= $2 AND e.start_time < $3`,
            [userId, monthStart, endDate],
          ),
        ]);

      return {
        total_events: total,
        upcoming_events: upcoming,
        past_events: past,
        recurring_events: recurring,
        events_this_week: thisWeek,
        events_this_month: thisMonth,
      };
    } catch (error) {
      this.logger.error('Failed to get event analytics:', error);
      throw error;
    }
  }

  async getTimeUtilization(
    userId: string,
    startDate: Date,
    endDate: Date,
    calendarId?: string,
  ): Promise<TimeUtilization> {
    const baseConditions = this.buildBaseConditions(userId, calendarId);

    try {
      const query = `
            SELECT 
            SUM(EXTRACT(EPOCH FROM (e.end_time - e.start_time)) / 3600) as scheduled_hours,
            EXTRACT(DOW FROM e.start_time) as day_of_week,
            EXTRACT(HOUR FROM e.start_time) as hour_of_day,
            COUNT(*) as event_count
            FROM events e
            INNER JOIN calendars c ON e.calendar_id = c.id
            WHERE ${baseConditions}
            AND e.start_time >= $2
            AND e.end_time <= $3
            GROUP BY day_of_week, hour_of_day
            ORDER BY event_count DESC
        `;

      const result = await this.databaseService.query(query, [
        userId,
        startDate,
        endDate,
      ]);

      const totalHours =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      const scheduledHours = result.rows.reduce(
        (sum, row) => sum + parseFloat(row.scheduled_hours || 0),
        0,
      );
      const freeHours = totalHours - scheduledHours;
      const utilizationRate = scheduledHours / totalHours;

      const busiestRow = result.rows[0];
      const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      const busiestDay = busiestRow
        ? dayNames[parseInt(busiestRow.day_of_week)]
        : 'N/A';
      const busiestHour = busiestRow ? parseInt(busiestRow.hour_of_day) : 0;

      return {
        total_hours: totalHours,
        scheduled_hours: scheduledHours,
        free_hours: freeHours,
        utilization_rate: utilizationRate,
        busiest_day: busiestDay,
        busiest_hour: busiestHour,
      };
    } catch (error) {
      this.logger.error('Failed to get time utilization:', error);
      throw error;
    }
  }

  async getCategoryAnalytics(
    userId: string,
    startDate: Date,
    endDate: Date,
    limit: number = 10,
  ): Promise<CategoryAnalytics[]> {
    try {
      const query = `
        SELECT 
          c.id as calendar_id,
          c.name as calendar_name,
          COUNT(e.id) as event_count,
          SUM(EXTRACT(EPOCH FROM (e.end_time - e.start_time)) / 3600) as total_duration_hours
        FROM calendars c
        LEFT JOIN events e ON e.calendar_id = c.id 
          AND e.start_time >= $2 
          AND e.end_time <= $3
        WHERE c.user_id = $1
        GROUP BY c.id, c.name
        ORDER BY event_count DESC
        LIMIT $4
      `;

      const result = await this.databaseService.query(query, [
        userId,
        startDate,
        endDate,
        limit,
      ]);

      return result.rows.map((row) => ({
        calendar_id: row.calendar_id,
        calendar_name: row.calendar_name,
        event_count: parseInt(row.event_count),
        total_duration_hours: parseFloat(row.total_duration_hours || 0),
      }));
    } catch (error) {
      this.logger.error('Failed to get category analytics:', error);
      throw error;
    }
  }

  async getTimeDistribution(
    userId: string,
    startDate: Date,
    endDate: Date,
    period: AnalyticsPeriod,
    calendarId?: string,
  ): Promise<TimeDistribution[]> {
    const baseConditions = this.buildBaseConditions(userId, calendarId);
    const dateFormat = this.getDateFormat(period);

    try {
      const query = `
        SELECT 
          TO_CHAR(e.start_time, $4) as date,
          COUNT(e.id) as count,
          SUM(EXTRACT(EPOCH FROM (e.end_time - e.start_time)) / 3600) as duration_hours
        FROM events e
        INNER JOIN calendars c ON e.calendar_id = c.id
        WHERE ${baseConditions}
          AND e.start_time >= $2
          AND e.end_time <= $3
        GROUP BY date
        ORDER BY date ASC
      `;

      const result = await this.databaseService.query(query, [
        userId,
        startDate,
        endDate,
        dateFormat,
      ]);

      return result.rows.map((row) => ({
        date: row.date,
        count: parseInt(row.count),
        duration_hours: parseFloat(row.duration_hours || 0),
      }));
    } catch (error) {
      this.logger.error('Failed to get time distribution:', error);
      throw error;
    }
  }

  async getAttendeeAnalytics(
    userId: string,
    startDate: Date,
    endDate: Date,
    calendarId?: string,
  ): Promise<AttendeeAnalytics> {
    const baseConditions = this.buildBaseConditions(userId, calendarId);

    try {
      const totalQuery = `
        SELECT 
          COUNT(*) as total_attendees,
          COUNT(DISTINCT email) as unique_attendees
        FROM event_attendees ea
        INNER JOIN events e ON ea.event_id = e.id
        INNER JOIN calendars c ON e.calendar_id = c.id
        WHERE ${baseConditions}
          AND e.start_time >= $2
          AND e.end_time <= $3
      `;

      const topQuery = `
        SELECT 
          ea.email,
          ea.name,
          COUNT(ea.event_id) as event_count
        FROM event_attendees ea
        INNER JOIN events e ON ea.event_id = e.id
        INNER JOIN calendars c ON e.calendar_id = c.id
        WHERE ${baseConditions}
          AND e.start_time >= $2
          AND e.end_time <= $3
        GROUP BY ea.email, ea.name
        ORDER BY event_count DESC
        LIMIT 10
      `;

      const [totalResult, topResult] = await Promise.all([
        this.databaseService.query(totalQuery, [userId, startDate, endDate]),
        this.databaseService.query(topQuery, [userId, startDate, endDate]),
      ]);

      const totalAttendees = parseInt(
        totalResult.rows[0]?.total_attendees || 0,
      );
      const uniqueAttendees = parseInt(
        totalResult.rows[0]?.unique_attendees || 0,
      );
      const eventCount = await this.countEvents(
        `${baseConditions} AND e.start_time >= $2 AND e.end_time <= $3`,
        [userId, startDate, endDate],
      );

      return {
        total_attendees: totalAttendees,
        unique_attendees: uniqueAttendees,
        average_per_event: eventCount > 0 ? totalAttendees / eventCount : 0,
        top_attendees: topResult.rows.map((row) => ({
          email: row.email,
          name: row.name,
          event_count: parseInt(row.event_count),
        })),
      };
    } catch (error) {
      this.logger.error('Failed to get attendee analytics:', error);
      throw error;
    }
  }

  async getBookingAnalytics(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<BookingAnalytics> {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) FILTER (WHERE status IN ('pending', 'confirmed', 'cancelled', 'completed')) as total_bookings,
          COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
          COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_bookings,
          COUNT(*) FILTER (WHERE status = 'pending') as pending_bookings,
          COUNT(*) FILTER (WHERE status = 'completed') as completed_bookings
        FROM bookings
        WHERE user_id = $1
          AND start_time >= $2
          AND end_time <= $3
      `;

      const topLinksQuery = `
        SELECT 
          bl.id,
          bl.title,
          COUNT(b.id) as booking_count
        FROM booking_links bl
        LEFT JOIN bookings b ON bl.id = b.booking_link_id
          AND b.start_time >= $2
          AND b.end_time <= $3
          AND b.status != 'cancelled'
        WHERE bl.user_id = $1
        GROUP BY bl.id, bl.title
        ORDER BY booking_count DESC
        LIMIT 5
      `;

      const [statsResult, topLinksResult] = await Promise.all([
        this.databaseService.query(statsQuery, [userId, startDate, endDate]),
        this.databaseService.query(topLinksQuery, [userId, startDate, endDate]),
      ]);

      const stats = statsResult.rows[0];
      const totalBookings = parseInt(stats?.total_bookings || 0);
      const confirmedBookings = parseInt(stats?.confirmed_bookings || 0);
      const cancelledBookings = parseInt(stats?.cancelled_bookings || 0);

      return {
        total_bookings: totalBookings,
        confirmed_bookings: confirmedBookings,
        cancelled_bookings: cancelledBookings,
        pending_bookings: parseInt(stats?.pending_bookings || 0),
        completed_bookings: parseInt(stats?.completed_bookings || 0),
        booking_rate: totalBookings > 0 ? confirmedBookings / totalBookings : 0,
        cancellation_rate:
          totalBookings > 0 ? cancelledBookings / totalBookings : 0,
        top_booking_links: topLinksResult.rows.map((row) => ({
          id: row.id,
          title: row.title,
          booking_count: parseInt(row.booking_count),
        })),
      };
    } catch (error) {
      this.logger.error('Failed to get booking analytics:', error);
      throw error;
    }
  }

  private buildBaseConditions(userId: string, calendarId?: string): string {
    let conditions = 'c.user_id = $1';
    if (calendarId) {
      conditions += ` AND e.calendar_id = '${calendarId}'`;
    }
    return conditions;
  }

  private async countEvents(
    conditions: string,
    params: any[],
  ): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM events e
      INNER JOIN calendars c ON e.calendar_id = c.id
      WHERE ${conditions}
    `;

    const result = await this.databaseService.query(query, params);
    return parseInt(result.rows[0]?.count || 0);
  }

  private getDateFormat(period: AnalyticsPeriod): string {
    switch (period) {
      case AnalyticsPeriod.DAY:
        return 'YYYY-MM-DD';
      case AnalyticsPeriod.WEEK:
        return 'IYYY-IW';
      case AnalyticsPeriod.MONTH:
        return 'YYYY-MM';
      case AnalyticsPeriod.QUARTER:
        return 'YYYY-Q';
      case AnalyticsPeriod.YEAR:
        return 'YYYY';
      default:
        return 'YYYY-MM-DD';
    }
  }
}
