import { Injectable, Logger } from '@nestjs/common';
import { TeamRepository } from '../repositories/team.repository';
import { TeamMemberRepository } from '../repositories/team-member.repository';
import { Team } from '../interfaces/team.interface';
import { CreateTeamDto, UpdateTeamDto } from '../dto/team.dto';
import {
  TeamNotFoundException,
  NotTeamOwnerException,
  NotTeamAdminException,
} from '../exceptions/team.exceptions';
import { TEAM_CONSTANTS } from '../constants/team.constants';

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  constructor(
    private readonly teamRepo: TeamRepository,
    private readonly memberRepo: TeamMemberRepository,
  ) {}

  async createTeam(userId: string, dto: CreateTeamDto): Promise<Team> {
    this.logger.log(`Creating team: ${dto.name} for user: ${userId}`);

    const team = await this.teamRepo.create(userId, dto);

    await this.memberRepo.create(
      team.id,
      userId,
      TEAM_CONSTANTS.ROLES.OWNER,
      TEAM_CONSTANTS.STATUS.ACTIVE,
    );

    return team;
  }

  async getTeamById(teamId: string, userId: string): Promise<Team> {
    const team = await this.teamRepo.findById(teamId);
    if (!team) {
      throw new TeamNotFoundException(teamId);
    }

    await this.validateMemberAccess(teamId, userId);
    return team;
  }

  async getMyTeams(userId: string): Promise<Team[]> {
    return await this.teamRepo.findByMember(userId);
  }

  async getOwnedTeams(userId: string): Promise<Team[]> {
    return await this.teamRepo.findByOwner(userId);
  }

  async updateTeam(
    teamId: string,
    userId: string,
    dto: UpdateTeamDto,
  ): Promise<Team> {
    await this.validateOwnerAccess(teamId, userId);
    return await this.teamRepo.update(teamId, dto);
  }

  async deleteTeam(teamId: string, userId: string): Promise<void> {
    await this.validateOwnerAccess(teamId, userId);
    await this.teamRepo.delete(teamId);
  }

  async validateMemberAccess(teamId: string, userId: string): Promise<void> {
    const member = await this.memberRepo.findByTeamAndUser(teamId, userId);
    if (!member || member.status !== TEAM_CONSTANTS.STATUS.ACTIVE) {
      throw new TeamNotFoundException(teamId);
    }
  }

  async validateAdminAccess(teamId: string, userId: string): Promise<void> {
    const member = await this.memberRepo.findByTeamAndUser(teamId, userId);
    if (!member || member.status !== TEAM_CONSTANTS.STATUS.ACTIVE) {
      throw new TeamNotFoundException(teamId);
    }
    if (
      member.role !== TEAM_CONSTANTS.ROLES.OWNER &&
      member.role !== TEAM_CONSTANTS.ROLES.ADMIN
    ) {
      throw new NotTeamAdminException();
    }
  }

  async validateOwnerAccess(teamId: string, userId: string): Promise<void> {
    const team = await this.teamRepo.findById(teamId);
    if (!team) {
      throw new TeamNotFoundException(teamId);
    }
    if (team.owner_id !== userId) {
      throw new NotTeamOwnerException();
    }
  }

  async isTeamOwner(teamId: string, userId: string): Promise<boolean> {
    const team = await this.teamRepo.findById(teamId);
    return team ? team.owner_id === userId : false;
  }

  async isTeamAdmin(teamId: string, userId: string): Promise<boolean> {
    const member = await this.memberRepo.findByTeamAndUser(teamId, userId);
    if (!member) return false;
    return (
      member.role === TEAM_CONSTANTS.ROLES.OWNER ||
      member.role === TEAM_CONSTANTS.ROLES.ADMIN
    );
  }
}
