import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TeamService } from './services/team.service';
import { TeamMemberService } from './services/team-member.service';
import { TeamRitualService } from './services/team-ritual.service';
import { TeamAvailabilityService } from './services/team-availability.service';
import {
  CreateTeamDto,
  UpdateTeamDto,
  InviteMemberDto,
  UpdateMemberRoleDto,
  CreateRitualDto,
  UpdateRitualDto,
  GetAvailabilityHeatmapDto,
  FindOptimalTimeDto,
} from './dto/team.dto';

@ApiTags('Teams')
@ApiBearerAuth()
@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly memberService: TeamMemberService,
    private readonly ritualService: TeamRitualService,
    private readonly availabilityService: TeamAvailabilityService,
  ) {}

  private getUserId = (req: any): string => req.user?.id || req.user?.sub;

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  async createTeam(@Req() req, @Body() dto: CreateTeamDto) {
    return await this.teamService.createTeam(this.getUserId(req), dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get my teams' })
  async getMyTeams(@Req() req) {
    return await this.teamService.getMyTeams(this.getUserId(req));
  }

  @Get('invitations/pending')
  @ApiOperation({
    summary: 'Get my pending team invitations',
    description:
      'Get all pending invitations for the current user where they can accept/decline',
  })
  async getMyPendingInvitations(@Req() req) {
    return await this.memberService.getMyPendingInvitations(
      this.getUserId(req),
    );
  }

  @Get('owned')
  @ApiOperation({ summary: 'Get teams I own' })
  async getOwnedTeams(@Req() req) {
    return await this.teamService.getOwnedTeams(this.getUserId(req));
  }

  @Get(':teamId')
  @ApiOperation({ summary: 'Get team by ID' })
  async getTeam(@Req() req, @Param('teamId') teamId: string) {
    return await this.teamService.getTeamById(teamId, this.getUserId(req));
  }

  @Put(':teamId')
  @ApiOperation({ summary: 'Update team' })
  async updateTeam(
    @Req() req,
    @Param('teamId') teamId: string,
    @Body() dto: UpdateTeamDto,
  ) {
    return await this.teamService.updateTeam(teamId, this.getUserId(req), dto);
  }

  @Delete(':teamId')
  @ApiOperation({ summary: 'Delete team' })
  async deleteTeam(@Req() req, @Param('teamId') teamId: string) {
    await this.teamService.deleteTeam(teamId, this.getUserId(req));
    return { success: true };
  }

  @Post(':teamId/members')
  @ApiOperation({ summary: 'Invite team member' })
  async inviteMember(
    @Req() req,
    @Param('teamId') teamId: string,
    @Body() dto: InviteMemberDto,
  ) {
    await this.teamService.validateAdminAccess(teamId, this.getUserId(req));
    return await this.memberService.inviteMember(teamId, dto);
  }

  @Get(':teamId/members')
  @ApiOperation({ summary: 'Get team members' })
  async getMembers(
    @Req() req,
    @Param('teamId') teamId: string,
    @Query('status') status?: string,
  ) {
    await this.teamService.validateMemberAccess(teamId, this.getUserId(req));
    return await this.memberService.getTeamMembers(teamId, status);
  }

  @Put(':teamId/members/:memberId/accept')
  @ApiOperation({
    summary: 'Accept team invitation',
    description:
      'Accept a team invitation. Only the invited user can accept their own invitation.',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Invitation accepted successfully',
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'Not authorized to accept this invitation',
  })
  @SwaggerApiResponse({ status: 400, description: 'Invitation is not pending' })
  async acceptInvitation(
    @Req() req,
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
  ) {
    return await this.memberService.acceptInvitation(
      memberId,
      this.getUserId(req),
      teamId,
    );
  }

  @Put(':teamId/members/:memberId/decline')
  @ApiOperation({
    summary: 'Decline team invitation',
    description:
      'Decline a team invitation. Only the invited user can decline their own invitation.',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Invitation declined successfully',
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'Not authorized to decline this invitation',
  })
  @SwaggerApiResponse({ status: 400, description: 'Invitation is not pending' })
  async declineInvitation(
    @Req() req,
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
  ) {
    await this.memberService.declineInvitation(
      memberId,
      this.getUserId(req),
      teamId,
    );
    return { success: true };
  }

  @Put(':teamId/members/:memberId/role')
  @ApiOperation({ summary: 'Update member role' })
  async updateMemberRole(
    @Req() req,
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    await this.teamService.validateAdminAccess(teamId, this.getUserId(req));
    return await this.memberService.updateMemberRole(memberId, dto);
  }

  @Delete(':teamId/members/:memberId')
  @ApiOperation({ summary: 'Remove team member' })
  async removeMember(
    @Req() req,
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
  ) {
    await this.teamService.validateAdminAccess(teamId, this.getUserId(req));
    await this.memberService.removeMember(memberId);
    return { success: true };
  }

  @Post(':teamId/leave')
  @ApiOperation({ summary: 'Leave team' })
  async leaveTeam(@Req() req, @Param('teamId') teamId: string) {
    await this.memberService.leaveTeam(teamId, this.getUserId(req));
    return { success: true };
  }

  @Post(':teamId/rituals')
  @ApiOperation({ summary: 'Create team ritual' })
  async createRitual(
    @Req() req,
    @Param('teamId') teamId: string,
    @Body() dto: CreateRitualDto,
  ) {
    await this.teamService.validateAdminAccess(teamId, this.getUserId(req));
    return await this.ritualService.createRitual(teamId, dto);
  }

  @Get(':teamId/rituals')
  @ApiOperation({ summary: 'Get team rituals' })
  async getRituals(
    @Req() req,
    @Param('teamId') teamId: string,
    @Query('active') active?: string,
  ) {
    await this.teamService.validateMemberAccess(teamId, this.getUserId(req));
    return await this.ritualService.getTeamRituals(teamId, active === 'true');
  }

  @Put(':teamId/rituals/:ritualId')
  @ApiOperation({ summary: 'Update team ritual' })
  async updateRitual(
    @Req() req,
    @Param('teamId') teamId: string,
    @Param('ritualId') ritualId: string,
    @Body() dto: UpdateRitualDto,
  ) {
    await this.teamService.validateAdminAccess(teamId, this.getUserId(req));
    return await this.ritualService.updateRitual(ritualId, dto);
  }

  @Delete(':teamId/rituals/:ritualId')
  @ApiOperation({ summary: 'Delete team ritual' })
  async deleteRitual(
    @Req() req,
    @Param('teamId') teamId: string,
    @Param('ritualId') ritualId: string,
  ) {
    await this.teamService.validateAdminAccess(teamId, this.getUserId(req));
    await this.ritualService.deleteRitual(ritualId);
    return { success: true };
  }

  @Get(':teamId/rituals/:ritualId/rotation')
  @ApiOperation({ summary: 'Get ritual rotation history' })
  async getRotationHistory(
    @Req() req,
    @Param('teamId') teamId: string,
    @Param('ritualId') ritualId: string,
  ) {
    await this.teamService.validateMemberAccess(teamId, this.getUserId(req));
    return await this.ritualService.getRotationHistory(ritualId);
  }

  @Post(':teamId/availability/heatmap')
  @ApiOperation({ summary: 'Generate team availability heatmap' })
  async getAvailabilityHeatmap(
    @Req() req,
    @Param('teamId') teamId: string,
    @Body() dto: GetAvailabilityHeatmapDto,
  ) {
    await this.teamService.validateMemberAccess(teamId, this.getUserId(req));
    return await this.availabilityService.generateHeatmap(
      teamId,
      this.getUserId(req),
      new Date(dto.start_date),
      new Date(dto.end_date),
      dto.timezone,
    );
  }

  @Post(':teamId/availability/optimal')
  @ApiOperation({ summary: 'Find optimal meeting times' })
  async findOptimalTimes(
    @Req() req,
    @Param('teamId') teamId: string,
    @Body() dto: FindOptimalTimeDto,
  ) {
    await this.teamService.validateMemberAccess(teamId, this.getUserId(req));
    return await this.availabilityService.findOptimalTimes(
      teamId,
      this.getUserId(req),
      new Date(dto.start_date),
      new Date(dto.end_date),
      dto.duration_minutes,
      dto.required_members,
      dto.timezone,
    );
  }
}
