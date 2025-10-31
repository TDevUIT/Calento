import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { TeamAvailability, TimeSlot } from '../interfaces/team.interface';

@Injectable()
export class TeamAvailabilityRepository {
  private readonly logger = new Logger(TeamAvailabilityRepository.name);

  constructor(private readonly db: DatabaseService) {}

  async upsert(teamId: string, userId: string, date: Date, slots: TimeSlot[], timezone: string): Promise<TeamAvailability> {
    const result = await this.db.query(
      `INSERT INTO team_availability (team_id, user_id, date, available_slots, timezone)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (team_id, user_id, date)
       DO UPDATE SET available_slots = $4, timezone = $5
       RETURNING *`,
      [teamId, userId, date, JSON.stringify(slots), timezone]
    );
    return this.mapToAvailability(result.rows[0]);
  }

  async findByTeamAndDateRange(teamId: string, startDate: Date, endDate: Date): Promise<TeamAvailability[]> {
    const result = await this.db.query(
      `SELECT * FROM team_availability
       WHERE team_id = $1 AND date >= $2 AND date <= $3
       ORDER BY date ASC, user_id ASC`,
      [teamId, startDate, endDate]
    );
    return result.rows.map(row => this.mapToAvailability(row));
  }

  async findByUserAndDateRange(teamId: string, userId: string, startDate: Date, endDate: Date): Promise<TeamAvailability[]> {
    const result = await this.db.query(
      `SELECT * FROM team_availability
       WHERE team_id = $1 AND user_id = $2 AND date >= $3 AND date <= $4
       ORDER BY date ASC`,
      [teamId, userId, startDate, endDate]
    );
    return result.rows.map(row => this.mapToAvailability(row));
  }

  async delete(teamId: string, userId: string, date: Date): Promise<void> {
    await this.db.query(
      'DELETE FROM team_availability WHERE team_id = $1 AND user_id = $2 AND date = $3',
      [teamId, userId, date]
    );
  }

  async deleteByTeam(teamId: string): Promise<void> {
    await this.db.query('DELETE FROM team_availability WHERE team_id = $1', [teamId]);
  }

  async deleteOldRecords(beforeDate: Date): Promise<void> {
    await this.db.query('DELETE FROM team_availability WHERE date < $1', [beforeDate]);
  }

  private mapToAvailability(row: any): TeamAvailability {
    return {
      id: row.id,
      team_id: row.team_id,
      user_id: row.user_id,
      date: row.date,
      available_slots: typeof row.available_slots === 'string' 
        ? JSON.parse(row.available_slots) 
        : row.available_slots,
      timezone: row.timezone,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
