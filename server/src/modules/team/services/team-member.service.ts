import { Injectable, Logger } from '@nestjs/common';
import { TeamMemberRepository } from '../repositories/team-member.repository';
import { TeamRepository } from '../repositories/team.repository';
import { TeamMember } from '../interfaces/team.interface';
import { InviteMemberDto, UpdateMemberRoleDto } from '../dto/team.dto';
import {
  TeamMemberNotFoundException,
  AlreadyTeamMemberException,
  MaxTeamMembersException,
  CannotRemoveOwnerException,
} from '../exceptions/team.exceptions';
import { TEAM_CONSTANTS } from '../constants/team.constants';
import { DatabaseService } from '../../../database/database.service';

@Injectable()
export class TeamMemberService {
  private readonly logger = new Logger(TeamMemberService.name);

  constructor(
    private readonly memberRepo: TeamMemberRepository,
    private readonly teamRepo: TeamRepository,
    private readonly db: DatabaseService,
  ) {}

  async inviteMember(teamId: string, dto: InviteMemberDto): Promise<TeamMember> {
    this.logger.log(`Inviting member to team ${teamId}: ${dto.email}`);

    const memberCount = await this.teamRepo.countMembers(teamId);
    if (memberCount >= TEAM_CONSTANTS.LIMITS.MAX_MEMBERS) {
      throw new MaxTeamMembersException(TEAM_CONSTANTS.LIMITS.MAX_MEMBERS);
    }

    const userResult = await this.db.query(
      'SELECT id FROM users WHERE email = $1',
      [dto.email]
    );

    if (!userResult.rows[0]) {
      throw new TeamMemberNotFoundException();
    }

    const userId = userResult.rows[0].id;
    const existing = await this.memberRepo.findByTeamAndUser(teamId, userId);

    if (existing) {
      throw new AlreadyTeamMemberException();
    }

    return await this.memberRepo.create(teamId, userId, dto.role || TEAM_CONSTANTS.ROLES.MEMBER);
  }

  async getTeamMembers(teamId: string, status?: string): Promise<TeamMember[]> {
    return await this.memberRepo.findByTeam(teamId, status);
  }

  async getMemberById(memberId: string): Promise<TeamMember> {
    const member = await this.memberRepo.findById(memberId);
    if (!member) {
      throw new TeamMemberNotFoundException(memberId);
    }
    return member;
  }

  async acceptInvitation(memberId: string, userId: string): Promise<TeamMember> {
    const member = await this.getMemberById(memberId);
    
    if (member.user_id !== userId) {
      throw new TeamMemberNotFoundException();
    }

    return await this.memberRepo.updateStatus(memberId, TEAM_CONSTANTS.STATUS.ACTIVE);
  }

  async declineInvitation(memberId: string, userId: string): Promise<void> {
    const member = await this.getMemberById(memberId);
    
    if (member.user_id !== userId) {
      throw new TeamMemberNotFoundException();
    }

    await this.memberRepo.updateStatus(memberId, TEAM_CONSTANTS.STATUS.DECLINED);
  }

  async updateMemberRole(memberId: string, dto: UpdateMemberRoleDto): Promise<TeamMember> {
    const member = await this.getMemberById(memberId);
    
    const team = await this.teamRepo.findById(member.team_id);
    if (team && team.owner_id === member.user_id) {
      throw new CannotRemoveOwnerException();
    }

    return await this.memberRepo.updateRole(memberId, dto.role);
  }

  async removeMember(memberId: string): Promise<void> {
    const member = await this.getMemberById(memberId);
    
    const team = await this.teamRepo.findById(member.team_id);
    if (team && team.owner_id === member.user_id) {
      throw new CannotRemoveOwnerException();
    }

    await this.memberRepo.delete(memberId);
  }

  async leaveteam(teamId: string, userId: string): Promise<void> {
    const member = await this.memberRepo.findByTeamAndUser(teamId, userId);
    if (!member) {
      throw new TeamMemberNotFoundException();
    }

    const team = await this.teamRepo.findById(teamId);
    if (team && team.owner_id === userId) {
      throw new CannotRemoveOwnerException();
    }

    await this.memberRepo.delete(member.id);
  }

  async getMemberIds(teamId: string, status: string = TEAM_CONSTANTS.STATUS.ACTIVE): Promise<string[]> {
    return await this.memberRepo.getMemberIds(teamId, status);
  }
}
