import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { TeamRitual, TeamMeetingRotation } from '../interfaces/team.interface';
import { CreateRitualDto, UpdateRitualDto } from '../dto/team.dto';

@Injectable()
export class TeamRitualRepository {
  private readonly logger = new Logger(TeamRitualRepository.name);

  constructor(private readonly db: DatabaseService) {}

  async create(teamId: string, dto: CreateRitualDto): Promise<TeamRitual> {
    const result = await this.db.query(
      `INSERT INTO team_rituals (
        team_id, title, description, recurrence_rule, duration_minutes,
        buffer_before, buffer_after, rotation_type, rotation_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        teamId,
        dto.title,
        dto.description,
        dto.recurrence_rule,
        dto.duration_minutes || 30,
        dto.buffer_before || 0,
        dto.buffer_after || 0,
        dto.rotation_type || 'none',
        dto.rotation_order ? JSON.stringify(dto.rotation_order) : null,
      ]
    );
    return this.mapToRitual(result.rows[0]);
  }

  async findById(id: string): Promise<TeamRitual | null> {
    const result = await this.db.query(
      'SELECT * FROM team_rituals WHERE id = $1',
      [id]
    );
    return result.rows[0] ? this.mapToRitual(result.rows[0]) : null;
  }

  async findByTeam(teamId: string, activeOnly: boolean = false): Promise<TeamRitual[]> {
    const query = activeOnly
      ? 'SELECT * FROM team_rituals WHERE team_id = $1 AND is_active = true ORDER BY created_at DESC'
      : 'SELECT * FROM team_rituals WHERE team_id = $1 ORDER BY created_at DESC';

    const result = await this.db.query(query, [teamId]);
    return result.rows.map(row => this.mapToRitual(row));
  }

  async update(id: string, dto: UpdateRitualDto): Promise<TeamRitual> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (dto.title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(dto.title);
    }
    if (dto.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(dto.description);
    }
    if (dto.recurrence_rule !== undefined) {
      updates.push(`recurrence_rule = $${paramCount++}`);
      values.push(dto.recurrence_rule);
    }
    if (dto.duration_minutes !== undefined) {
      updates.push(`duration_minutes = $${paramCount++}`);
      values.push(dto.duration_minutes);
    }
    if (dto.buffer_before !== undefined) {
      updates.push(`buffer_before = $${paramCount++}`);
      values.push(dto.buffer_before);
    }
    if (dto.buffer_after !== undefined) {
      updates.push(`buffer_after = $${paramCount++}`);
      values.push(dto.buffer_after);
    }
    if (dto.rotation_type !== undefined) {
      updates.push(`rotation_type = $${paramCount++}`);
      values.push(dto.rotation_type);
    }
    if (dto.rotation_order !== undefined) {
      updates.push(`rotation_order = $${paramCount++}`);
      values.push(JSON.stringify(dto.rotation_order));
    }
    if (dto.is_active !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(dto.is_active);
    }

    values.push(id);
    const result = await this.db.query(
      `UPDATE team_rituals SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    return this.mapToRitual(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.query('DELETE FROM team_rituals WHERE id = $1', [id]);
  }

  async getNextRotationUser(ritualId: string): Promise<string | null> {
    const ritual = await this.findById(ritualId);
    if (!ritual || !ritual.rotation_order || ritual.rotation_order.length === 0) {
      return null;
    }

    const nextIndex = ritual.current_rotation_index % ritual.rotation_order.length;
    return ritual.rotation_order[nextIndex];
  }

  async incrementRotation(ritualId: string): Promise<void> {
    await this.db.query(
      'UPDATE team_rituals SET current_rotation_index = current_rotation_index + 1 WHERE id = $1',
      [ritualId]
    );
  }

  async createRotationRecord(ritualId: string, userId: string, scheduledAt: Date, eventId?: string): Promise<TeamMeetingRotation> {
    const result = await this.db.query(
      `INSERT INTO team_meeting_rotations (ritual_id, user_id, scheduled_at, event_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [ritualId, userId, scheduledAt, eventId]
    );
    return result.rows[0];
  }

  async getRotationHistory(ritualId: string, limit: number = 10): Promise<TeamMeetingRotation[]> {
    const result = await this.db.query(
      `SELECT * FROM team_meeting_rotations
       WHERE ritual_id = $1
       ORDER BY scheduled_at DESC
       LIMIT $2`,
      [ritualId, limit]
    );
    return result.rows;
  }

  private mapToRitual(row: any): TeamRitual {
    return {
      id: row.id,
      team_id: row.team_id,
      title: row.title,
      description: row.description,
      recurrence_rule: row.recurrence_rule,
      duration_minutes: row.duration_minutes,
      buffer_before: row.buffer_before,
      buffer_after: row.buffer_after,
      rotation_type: row.rotation_type,
      rotation_order: row.rotation_order ? JSON.parse(row.rotation_order) : null,
      current_rotation_index: row.current_rotation_index,
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
