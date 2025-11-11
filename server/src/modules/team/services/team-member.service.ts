import { Injectable, Logger } from '@nestjs/common';
import { TeamMemberRepository } from '../repositories/team-member.repository';
import { TeamRepository } from '../repositories/team.repository';
import { TeamMember } from '../interfaces/team.interface';
import { InviteMemberDto, UpdateMemberRoleDto } from '../dto/team.dto';
import { EmailService } from '../../email/services/email.service';
import {
  TeamMemberNotFoundException,
  AlreadyTeamMemberException,
  MaxTeamMembersException,
  CannotRemoveOwnerException,
  CannotInviteOwnerException,
  UserNotFoundForInviteException,
  UnauthorizedInvitationActionException,
  InvitationNotPendingException,
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
    private readonly emailService: EmailService,
  ) {}

  async inviteMember(teamId: string, dto: InviteMemberDto): Promise<TeamMember> {
    this.logger.log(`Inviting member to team ${teamId}: ${dto.email}`);

    const team = await this.teamRepo.findById(teamId);
    if (!team) {
      throw new TeamMemberNotFoundException();
    }

    const memberCount = await this.teamRepo.countMembers(teamId);
    if (memberCount >= TEAM_CONSTANTS.LIMITS.MAX_MEMBERS) {
      throw new MaxTeamMembersException(TEAM_CONSTANTS.LIMITS.MAX_MEMBERS);
    }

    const userResult = await this.db.query(
      'SELECT id FROM users WHERE email = $1',
      [dto.email]
    );

    if (!userResult.rows[0]) {
      throw new UserNotFoundForInviteException(dto.email);
    }

    const userId = userResult.rows[0].id;

    if (team.owner_id === userId) {
      throw new CannotInviteOwnerException();
    }

    const existing = await this.memberRepo.findByTeamAndUser(teamId, userId);

    if (existing) {
      if (existing.status === TEAM_CONSTANTS.STATUS.ACTIVE || existing.status === TEAM_CONSTANTS.STATUS.PENDING) {
        throw new AlreadyTeamMemberException();
      }
      const member = await this.memberRepo.updateStatus(existing.id, TEAM_CONSTANTS.STATUS.PENDING);
      await this.sendInvitationEmail(team, member, dto.email);
      return member;
    }

    const member = await this.memberRepo.create(teamId, userId, dto.role || TEAM_CONSTANTS.ROLES.MEMBER);
    
    // Send invitation email
    await this.sendInvitationEmail(team, member, dto.email);
    
    return member;
  }

  private async sendInvitationEmail(
    team: any,
    member: TeamMember,
    inviteeEmail: string,
  ): Promise<void> {
    try {
      // Get inviter (owner) info
      const ownerResult = await this.db.query(
        'SELECT first_name, last_name, email FROM users WHERE id = $1',
        [team.owner_id]
      );
      const owner = ownerResult.rows[0];

      // Get invitee info
      const inviteeResult = await this.db.query(
        'SELECT first_name, last_name FROM users WHERE id = $1',
        [member.user_id]
      );
      const invitee = inviteeResult.rows[0];

      const inviterName = `${owner.first_name} ${owner.last_name}`.trim() || owner.email;
      const inviteeName = `${invitee.first_name} ${invitee.last_name}`.trim() || inviteeEmail;

      await this.emailService.sendTeamInvitationEmail(
        team.owner_id, // userId for email log
        inviteeEmail,
        inviteeName,
        team.name,
        team.description || '',
        inviterName,
        owner.email,
        member.role,
        team.id,
        member.id,
      );

      this.logger.log(`✅ Team invitation email sent to ${inviteeEmail}`);
    } catch (error) {
      // Don't fail the invitation if email fails
      this.logger.error(`❌ Failed to send team invitation email: ${error.message}`);
    }
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

  async acceptInvitation(memberId: string, userId: string, teamId?: string): Promise<TeamMember> {
    this.logger.log(`User ${userId} attempting to accept invitation ${memberId}`);
    const member = await this.getMemberById(memberId);
    
    // Only the invited user can accept their own invitation
    if (member.user_id !== userId) {
      this.logger.warn(`Unauthorized: User ${userId} tried to accept invitation for user ${member.user_id}`);
      throw new UnauthorizedInvitationActionException();
    }

    if (teamId && member.team_id !== teamId) {
      throw new TeamMemberNotFoundException();
    }

    // Verify invitation is still pending
    if (member.status !== TEAM_CONSTANTS.STATUS.PENDING) {
      throw new InvitationNotPendingException(member.status);
    }

    this.logger.log(`User ${userId} accepted invitation to team ${member.team_id}`);
    return await this.memberRepo.updateStatus(memberId, TEAM_CONSTANTS.STATUS.ACTIVE);
  }

  async declineInvitation(memberId: string, userId: string, teamId?: string): Promise<void> {
    this.logger.log(`User ${userId} attempting to decline invitation ${memberId}`);
    const member = await this.getMemberById(memberId);
    
    // Only the invited user can decline their own invitation
    if (member.user_id !== userId) {
      this.logger.warn(`Unauthorized: User ${userId} tried to decline invitation for user ${member.user_id}`);
      throw new UnauthorizedInvitationActionException();
    }

    if (teamId && member.team_id !== teamId) {
      throw new TeamMemberNotFoundException();
    }

    // Verify invitation is still pending
    if (member.status !== TEAM_CONSTANTS.STATUS.PENDING) {
      throw new InvitationNotPendingException(member.status);
    }

    this.logger.log(`User ${userId} declined invitation to team ${member.team_id}`);
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

  async leaveTeam(teamId: string, userId: string): Promise<void> {
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

  async getMyPendingInvitations(userId: string): Promise<TeamMember[]> {
    this.logger.log(`Getting pending invitations for user ${userId}`);
    const result = await this.db.query(
      `SELECT tm.*, 
              t.name as team_name, 
              t.description as team_description,
              u.email as inviter_email,
              u.first_name as inviter_first_name,
              u.last_name as inviter_last_name
       FROM team_members tm
       JOIN teams t ON tm.team_id = t.id
       LEFT JOIN users u ON t.owner_id = u.id
       WHERE tm.user_id = $1 AND tm.status = $2
       ORDER BY tm.created_at DESC`,
      [userId, TEAM_CONSTANTS.STATUS.PENDING]
    );
    return result.rows;
  }
}
