import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { TeamMember } from '../interfaces/team.interface';

@Injectable()
export class TeamMemberRepository {
    private readonly logger = new Logger(TeamMemberRepository.name);

    constructor(private readonly db: DatabaseService) {}

    async create(teamId: string, userId: string, role: string): Promise<TeamMember> {
        const result = await this.db.query(
        `INSERT INTO team_members (team_id, user_id, role, status)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [teamId, userId, role, 'pending']
        );
        return this.mapToTeamMember(result.rows[0]);
    }

    async findById(id: string): Promise<TeamMember | null> {
        const result = await this.db.query(
        `SELECT tm.*, 
                u.id as user_id, u.email, u.username, 
                u.first_name, u.last_name, u.avatar
        FROM team_members tm
        LEFT JOIN users u ON tm.user_id = u.id
        WHERE tm.id = $1`,
        [id]
        );
        return result.rows[0] ? this.mapToTeamMember(result.rows[0]) : null;
    }

    async findByTeamAndUser(teamId: string, userId: string): Promise<TeamMember | null> {
        const result = await this.db.query(
        `SELECT tm.*, 
                u.id as user_id, u.email, u.username, 
                u.first_name, u.last_name, u.avatar
        FROM team_members tm
        LEFT JOIN users u ON tm.user_id = u.id
        WHERE tm.team_id = $1 AND tm.user_id = $2`,
        [teamId, userId]
        );
        return result.rows[0] ? this.mapToTeamMember(result.rows[0]) : null;
    }

    async findByTeam(teamId: string, status?: string): Promise<TeamMember[]> {
        const query = status
        ? `SELECT tm.*, 
                    u.id as user_id, u.email, u.username, 
                    u.first_name, u.last_name, u.avatar
            FROM team_members tm
            LEFT JOIN users u ON tm.user_id = u.id
            WHERE tm.team_id = $1 AND tm.status = $2
            ORDER BY tm.joined_at DESC, tm.created_at DESC`
        : `SELECT tm.*, 
                    u.id as user_id, u.email, u.username, 
                    u.first_name, u.last_name, u.avatar
            FROM team_members tm
            LEFT JOIN users u ON tm.user_id = u.id
            WHERE tm.team_id = $1
            ORDER BY tm.joined_at DESC, tm.created_at DESC`;

        const params = status ? [teamId, status] : [teamId];
        const result = await this.db.query(query, params);
        return result.rows.map(row => this.mapToTeamMember(row));
    }

    async updateRole(id: string, role: string): Promise<TeamMember> {
        const result = await this.db.query(
        `UPDATE team_members SET role = $1 WHERE id = $2 RETURNING *`,
        [role, id]
        );
        return this.mapToTeamMember(result.rows[0]);
    }

    async updateStatus(id: string, status: string): Promise<TeamMember> {
        const joinedAt = status === 'active' ? new Date() : null;
        const result = await this.db.query(
        `UPDATE team_members SET status = $1, joined_at = $2 WHERE id = $3 RETURNING *`,
        [status, joinedAt, id]
        );
        return this.mapToTeamMember(result.rows[0]);
    }

    async delete(id: string): Promise<void> {
        await this.db.query('DELETE FROM team_members WHERE id = $1', [id]);
    }

    async getMemberIds(teamId: string, status: string = 'active'): Promise<string[]> {
        const result = await this.db.query(
        'SELECT user_id FROM team_members WHERE team_id = $1 AND status = $2',
        [teamId, status]
        );
        return result.rows.map(row => row.user_id);
    }

    private mapToTeamMember(row: any): TeamMember {
        const member: TeamMember = {
        id: row.id,
        team_id: row.team_id,
        user_id: row.user_id,
        role: row.role,
        status: row.status,
        joined_at: row.joined_at,
        created_at: row.created_at,
        updated_at: row.updated_at,
        };

        if (row.email) {
        member.user = {
            id: row.user_id,
            email: row.email,
            username: row.username,
            first_name: row.first_name,
            last_name: row.last_name,
            avatar: row.avatar,
        };
        }

        return member;
    }
}
