import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { Team, TeamSettings } from '../interfaces/team.interface';
import { CreateTeamDto, UpdateTeamDto } from '../dto/team.dto';

@Injectable()
export class TeamRepository {
  private readonly logger = new Logger(TeamRepository.name);

  constructor(private readonly db: DatabaseService) {}

  async create(userId: string, dto: CreateTeamDto): Promise<Team> {
    const settings = dto.settings || {};
    const result = await this.db.query(
      `INSERT INTO teams (name, description, owner_id, timezone, settings)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        dto.name,
        dto.description,
        userId,
        dto.timezone || 'UTC',
        JSON.stringify(settings),
      ],
    );
    return this.mapToTeam(result.rows[0]);
  }

  async findById(id: string): Promise<Team | null> {
    const result = await this.db.query('SELECT * FROM teams WHERE id = $1', [
      id,
    ]);
    return result.rows[0] ? this.mapToTeam(result.rows[0]) : null;
  }

  async findByOwner(userId: string): Promise<Team[]> {
    const result = await this.db.query(
      'SELECT * FROM teams WHERE owner_id = $1 ORDER BY created_at DESC',
      [userId],
    );
    return result.rows.map((row) => this.mapToTeam(row));
  }

  async findByMember(userId: string): Promise<Team[]> {
    const result = await this.db.query(
      `SELECT t.* FROM teams t
       INNER JOIN team_members tm ON t.id = tm.team_id
       WHERE tm.user_id = $1 AND tm.status = 'active'
       ORDER BY t.created_at DESC`,
      [userId],
    );
    return result.rows.map((row) => this.mapToTeam(row));
  }

  async update(id: string, dto: UpdateTeamDto): Promise<Team> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (dto.name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(dto.name);
    }
    if (dto.description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(dto.description);
    }
    if (dto.timezone !== undefined) {
      updates.push(`timezone = $${paramCount++}`);
      values.push(dto.timezone);
    }
    if (dto.settings !== undefined) {
      updates.push(`settings = $${paramCount++}`);
      values.push(JSON.stringify(dto.settings));
    }
    if (dto.is_active !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(dto.is_active);
    }

    values.push(id);
    const result = await this.db.query(
      `UPDATE teams SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values,
    );
    return this.mapToTeam(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.query('DELETE FROM teams WHERE id = $1', [id]);
  }

  async countMembers(teamId: string): Promise<number> {
    const result = await this.db.query(
      'SELECT COUNT(*) as count FROM team_members WHERE team_id = $1 AND status = $2',
      [teamId, 'active'],
    );
    return parseInt(result.rows[0].count);
  }

  async countRituals(teamId: string): Promise<number> {
    const result = await this.db.query(
      'SELECT COUNT(*) as count FROM team_rituals WHERE team_id = $1 AND is_active = true',
      [teamId],
    );
    return parseInt(result.rows[0].count);
  }

  private mapToTeam(row: any): Team {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      owner_id: row.owner_id,
      timezone: row.timezone,
      settings:
        typeof row.settings === 'string'
          ? JSON.parse(row.settings)
          : row.settings,
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
